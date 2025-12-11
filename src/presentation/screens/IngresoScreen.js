import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { db } from '../../infrastructure/firebase/FirestoreAdapter';
import { runTransaction, doc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export default function IngresoScreen() {
  const [placa, setPlaca] = useState('');
  const [cedula, setCedula] = useState('');
  const [nombres, setNombres] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
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
    if (cedula.length === 0) return true; // No mostrar error si está vacío
    return validarCedulaEcuatoriana(cedula);
  }, [cedula]);

  const isFormValid = useMemo(() => {
    return placa.length > 0 && 
           nombres.length > 0 && 
           cedula.length === 10 && 
           validarCedulaEcuatoriana(cedula);
  }, [placa, nombres, cedula]);

  const handleIngreso = async () => {
    if (!isFormValid) {
      setError('Por favor complete todos los campos correctamente');
      return;
    }
    setError('');
    setLoading(true);

    const placaClean = placa.trim().toUpperCase();
    const cedulaClean = cedula.trim();
    const nombresClean = nombres.trim().toUpperCase();

    try {
      // 1. Validar duplicados antes de la transacción
      // Consultamos por placa y cédula por separado para detectar si alguno ya tiene ingreso activo
      // IMPORTANTE: Buscamos registros ACTIVOS. Si hay finalizados, no cuenta como duplicado.
      const qPlaca = query(
        collection(db, 'ingresos'), 
        where('placa', '==', placaClean), 
        where('estado', '==', 'activo')
      );

      const qCedula = query(
        collection(db, 'ingresos'), 
        where('cedula', '==', cedulaClean), 
        where('estado', '==', 'activo')
      );
      
      const [placaSnapshot, cedulaSnapshot] = await Promise.all([
        getDocs(qPlaca),
        getDocs(qCedula)
      ]);

      if (!placaSnapshot.empty || !cedulaSnapshot.empty) {
        setError('Esta placa y cédula ya están registrados y no han salido del parqueadero.');
        setLoading(false);
        return;
      }

      // 2. Ejecutar transacción
      const result = await runTransaction(db, async (transaction) => {
        const plazasRef = doc(db, 'config', 'plazas');
        const plazasDoc = await transaction.get(plazasRef);

        if (!plazasDoc.exists()) {
          throw new Error('Configuración de plazas no encontrada');
        }

        const data = plazasDoc.data();
        const currentAvailable = Number.isFinite(data.available) ? data.available : 100;

        if (currentAvailable <= 0) {
          throw new Error('No hay plazas disponibles');
        }

        // Decrement available spots
        const newAvailable = currentAvailable - 1;
        transaction.update(plazasRef, { 
          available: newAvailable,
          ocupadas: (data.ocupadas || 0) + 1
        });

        // Create new entry record
        const newIngresoRef = doc(collection(db, 'ingresos'));
        const ingresoData = {
          placa: placaClean,
          cedula: cedulaClean,
          nombres: nombresClean,
          fechaIngreso: serverTimestamp(),
          estado: 'activo'
        };
        transaction.set(newIngresoRef, ingresoData);

        return { id: newIngresoRef.id, ...ingresoData };
      });

      setQrData(JSON.stringify({
        id: result.id,
        placa: result.placa,
        timestamp: new Date().toISOString()
      }));
      
    } catch (e) {
      console.error(e);
      if (e.message === 'No hay plazas disponibles') {
        Alert.alert('Lo sentimos', 'Ya no existen plazas disponibles en el parqueadero. Inténtelo más tarde.');
      } else {
        Alert.alert('Error', 'Hubo un problema al procesar el ingreso. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQrData(null);
    setPlaca('');
    setCedula('');
    setNombres('');
    setError('');
  };

  if (qrData) {
    return (
      <View style={styles.container}>
        <Surface style={styles.card} elevation={4}>
          <Text style={styles.successTitle}>¡Ingreso Exitoso!</Text>
          <Text style={styles.instruction}>Presente este código QR en la entrada</Text>
          
          <View style={styles.qrContainer}>
            <QRCode value={qrData} size={200} />
          </View>
          
          <Button mode="contained" onPress={handleReset} style={styles.button}>
            Nuevo Ingreso
          </Button>
        </Surface>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.card} elevation={2}>
        <Text style={styles.title}>Registro de Ingreso</Text>
        
        <TextInput
          label="Placa del Vehículo"
          value={placa}
          onChangeText={(text) => setPlaca(text.toUpperCase())}
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
        
        <TextInput
          label="Nombres Completos"
          value={nombres}
          onChangeText={(text) => setNombres(text.toUpperCase())}
          style={styles.input}
          mode="outlined"
          autoCapitalize="characters"
        />

        <Button 
          mode="contained" 
          onPress={handleIngreso} 
          loading={loading} 
          disabled={!isFormValid || loading}
          style={[styles.button, { backgroundColor: isFormValid ? '#44C265' : '#ccc' }]}
        >
          Ingresar
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
    color: '#2e7d32',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  }
});
