import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { db } from '../../infrastructure/firebase/FirestoreAdapter';
import { runTransaction, doc, getDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export default function SalidaScreen({ navigation }) {
  const [placa, setPlaca] = useState('');
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const [salidaData, setSalidaData] = useState(null);
  const [error, setError] = useState('');

  // Validar cédula ecuatoriana
  const validarCedulaEcuatoriana = (ci) => {
    if (!ci || ci.length !== 10) return false;
    const digitoRegion = parseInt(ci.substring(0, 2), 10);
    if (digitoRegion < 1 || digitoRegion > 24) return false;
    
    const tercerDigito = parseInt(ci.substring(2, 3), 10);
    if (tercerDigito >= 6) return false; // Solo personas naturales

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const verificador = parseInt(ci.substring(9, 10), 10);
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      let valor = parseInt(ci.substring(i, i + 1), 10) * coeficientes[i];
      suma += (valor >= 10) ? valor - 9 : valor;
    }

    const digitoCalculado = (suma % 10 === 0) ? 0 : 10 - (suma % 10);
    return digitoCalculado === verificador;
  };

  const isCedulaValid = useMemo(() => {
    if (cedula.length === 0) return true;
    return validarCedulaEcuatoriana(cedula);
  }, [cedula]);

  const isFormValid = useMemo(() => {
    return placa.length > 0 && 
           cedula.length === 10 && 
           validarCedulaEcuatoriana(cedula);
  }, [placa, cedula]);

  const handleSalida = async () => {
    if (!isFormValid) {
      setError('Por favor complete todos los campos correctamente');
      return;
    }
    setError('');
    setLoading(true);

    const placaClean = placa.trim().toUpperCase();
    const cedulaClean = cedula.trim();

    // Debugging logs
    console.log('Intentando registrar salida con:');
    console.log('Placa:', placaClean);
    console.log('Cédula:', cedulaClean);

    try {
      // 1. Get current pricing
      const pricingRef = doc(db, 'config', 'pricing');
      const pricingDoc = await getDoc(pricingRef);
      const pricingData = pricingDoc.data() || {};
      const priceCents = typeof pricingData.priceCents === 'number'
        ? pricingData.priceCents
        : typeof pricingData.pricing === 'number'
          ? Math.round(pricingData.pricing * 100)
          : 50;

    // 2. Find active entry - Query by uppercase placa since IngresoScreen always saves as uppercase
    const q = query(
      collection(db, 'ingresos'),
      where('placa', '==', placaClean),
      where('estado', '==', 'activo')
    );
    
    const querySnapshot = await getDocs(q);
    
    let ingresoDoc = null;
    
    if (!querySnapshot.empty) {
      // Filter locally by cedula to avoid composite index issues or mismatch
      ingresoDoc = querySnapshot.docs.find(doc => doc.data().cedula === cedulaClean);
    }

      if (!ingresoDoc) {
        console.log('No se encontró documento. Resultados parciales:', querySnapshot.size);
        if (!querySnapshot.empty) {
            console.log('Documentos encontrados por placa:', querySnapshot.docs.map(d => d.data()));
        }
        setError('No se encontró un registro de ingreso activo con estos datos.');
        setLoading(false);
        return;
      }
      const ingresoData = ingresoDoc.data();
      const ingresoId = ingresoDoc.id;
      
      const fechaIngreso = ingresoData.fechaIngreso.toDate();
      const fechaSalida = new Date();
      
      // Calculate duration in hours (ceiling)
      const diffMs = fechaSalida - fechaIngreso;
      const diffHrs = Math.ceil(diffMs / (1000 * 60 * 60));
      // Ensure at least 1 hour charged
      const hoursToCharge = Math.max(1, diffHrs);
      
      const totalCents = hoursToCharge * priceCents;
      const totalUsd = (totalCents / 100).toFixed(2);

      // 3. Process transaction
      await runTransaction(db, async (transaction) => {
        const plazasRef = doc(db, 'config', 'plazas');
        const plazasDoc = await transaction.get(plazasRef);

        if (!plazasDoc.exists()) {
          throw new Error('Configuración de plazas no encontrada');
        }

        const data = plazasDoc.data();
        const currentAvailable = Number.isFinite(data.available) ? data.available : 100;
        const currentOccupied = Number.isFinite(data.ocupadas) ? data.ocupadas : 0;

        // Increment available spots, decrement occupied
        const newAvailable = Math.min(data.total || 100, currentAvailable + 1);
        const newOccupied = Math.max(0, currentOccupied - 1);
        
        transaction.update(plazasRef, { 
          available: newAvailable,
          ocupadas: newOccupied
        });

        // Update entry record
        const ingresoRef = doc(db, 'ingresos', ingresoId);
        transaction.update(ingresoRef, {
          estado: 'finalizado',
          fechaSalida: serverTimestamp(),
          horasCobradas: hoursToCharge,
          totalPagado: totalCents,
          tarifaAplicada: priceCents
        });
      });

      setSalidaData({
        placa: placaClean,
        fechaIngreso: fechaIngreso.toLocaleString(),
        fechaSalida: fechaSalida.toLocaleString(),
        tiempo: `${diffHrs} horas`,
        total: totalUsd,
        qrValue: JSON.stringify({
          id: ingresoId,
          type: 'SALIDA',
          timestamp: fechaSalida.toISOString(),
          status: 'PAID'
        })
      });

    } catch (e) {
      console.error(e);
      setError('Hubo un error al procesar la salida. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSalidaData(null);
    setPlaca('');
    setCedula('');
    setError('');
  };

  if (salidaData) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.card} elevation={4}>
          <Text style={styles.successTitle}>¡Salida Registrada!</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Placa:</Text>
              <Text style={styles.value}>{salidaData.placa}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Ingreso:</Text>
              <Text style={styles.value}>{salidaData.fechaIngreso}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Salida:</Text>
              <Text style={styles.value}>{salidaData.fechaSalida}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tiempo:</Text>
              <Text style={styles.value}>{salidaData.tiempo}</Text>
            </View>
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total a Pagar</Text>
              <Text style={styles.totalValue}>${salidaData.total}</Text>
            </View>
          </View>

          <Text style={styles.instruction}>Presente este código para salir</Text>
          <View style={styles.qrContainer}>
            <QRCode value={salidaData.qrValue} size={180} />
          </View>
        </Surface>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.card} elevation={2}>
        <Text style={styles.title}>Registro de Salida</Text>
        
        <TextInput
          label="Placa del Vehículo"
          value={placa}
          onChangeText={setPlaca}
          style={styles.input}
          mode="outlined"
          autoCapitalize="characters"
        />
        
        <TextInput
          label="Cédula de Identidad"
          value={cedula}
          onChangeText={setCedula}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          error={!isCedulaValid && cedula.length > 0}
        />
        {!isCedulaValid && cedula.length > 0 && (
          <HelperText type="error" visible={true}>
            Cédula inválida
          </HelperText>
        )}

        <Button 
          mode="contained" 
          onPress={handleSalida} 
          loading={loading} 
          disabled={!isFormValid || loading}
          style={[styles.button, { backgroundColor: isFormValid ? '#D32F2F' : '#ccc' }]}
        >
          Registrar Salida
        </Button>

        {error ? <HelperText type="error" visible={!!error} style={{ marginTop: 10, textAlign: 'center' }}>{error}</HelperText> : null}
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
    width: '100%',
    paddingVertical: 6,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
  },
  totalContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
  }
});
