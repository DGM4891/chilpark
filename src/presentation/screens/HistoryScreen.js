import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, TextInput, Button, HelperText, ActivityIndicator } from 'react-native-paper';
import { db } from '../../infrastructure/firebase/FirestoreAdapter';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function HistoryScreen() {
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  const validarCedulaEcuatoriana = (ci) => {
    if (!ci || ci.length !== 10) return false;
    const digitoRegion = parseInt(ci.substring(0, 2), 10);
    if (digitoRegion < 1 || digitoRegion > 24) return false;
    const tercerDigito = parseInt(ci.substring(2, 3), 10);
    if (tercerDigito >= 6) return false;
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
    return cedula.length === 10 && validarCedulaEcuatoriana(cedula);
  }, [cedula]);

  const handleBuscar = async () => {
    setError('');
    setLoading(true);
    try {
      const cedulaClean = cedula.trim();
      if (!cedulaClean) {
        setError('Ingrese la cédula');
        setLoading(false);
        return;
      }
      const q = query(collection(db, 'ingresos'), where('cedula', '==', cedulaClean), where('estado', '==', 'finalizado'));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const fa = a.fechaSalida?.toDate?.() ?? a.fechaIngreso?.toDate?.() ?? new Date(0);
        const fb = b.fechaSalida?.toDate?.() ?? b.fechaIngreso?.toDate?.() ?? new Date(0);
        return fb - fa;
      });
      setItems(list);
    } catch (e) {
      setError('Error al obtener historial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.card} elevation={2}>
        <Text style={styles.title}>Historial de visitas</Text>

        <TextInput
          label="Cédula"
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
        <Button mode="contained" onPress={handleBuscar} style={[styles.button, { backgroundColor: isFormValid ? '#1976D2' : '#ccc' }]} disabled={!isFormValid || loading}>
          Mostrar historial
        </Button>

        {error ? <HelperText type="error" visible={!!error} style={{ marginTop: 10, textAlign: 'center' }}>{error}</HelperText> : null}
        {loading ? <ActivityIndicator animating={true} style={{ marginTop: 12 }} /> : null}

        {items.map(item => {
          const fechaIngreso = item.fechaIngreso?.toDate?.() ?? null;
          const fechaSalida = item.fechaSalida?.toDate?.() ?? null;
          const horas = typeof item.horasCobradas === 'number' ? item.horasCobradas : (fechaIngreso && fechaSalida) ? Math.ceil((fechaSalida - fechaIngreso) / (1000*60*60)) : 0;
          const total = typeof item.totalPagado === 'number' ? (item.totalPagado / 100).toFixed(2) : '0.00';
          return (
            <Surface key={item.id} style={styles.entry} elevation={1}>
              <View style={styles.rowBetween}>
                <Text style={styles.entryTitle}>{item.placa}</Text>
                <Text style={styles.entryCost}>${total}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.entryLabel}>Horas</Text>
                <Text style={styles.entryValue}>{horas}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.entryLabel}>Ingreso</Text>
                <Text style={styles.entryValue}>{fechaIngreso ? fechaIngreso.toLocaleString() : '-'}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.entryLabel}>Salida</Text>
                <Text style={styles.entryValue}>{fechaSalida ? fechaSalida.toLocaleString() : '-'}</Text>
              </View>
            </Surface>
          );
        })}
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#f5f5f5' },
  card: { padding: 20, borderRadius: 10, backgroundColor: 'white', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  input: { width: '100%', marginBottom: 12, backgroundColor: 'white' },
  button: { marginTop: 4, width: '100%', paddingVertical: 6 },
  entry: { width: '100%', marginTop: 10, padding: 12, borderRadius: 8, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEEEEE' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  entryTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
  entryLabel: { fontSize: 13, color: '#666' },
  entryValue: { fontSize: 13, color: '#333', fontWeight: '700' },
  entryCost: { fontSize: 16, fontWeight: '800', color: '#2E7D32' },
});
