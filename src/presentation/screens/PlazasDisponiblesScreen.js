import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, ActivityIndicator, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../../infrastructure/firebase/FirestoreAdapter';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

export default function PlazasDisponiblesScreen() {
  const [available, setAvailable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'config', 'plazas');
    const unsub = onSnapshot(ref, async s => {
      if (!s.exists()) {
        await setDoc(ref, { available: 100, total: 100, ocupadas: 0, updatedAt: serverTimestamp() }, { merge: true });
        setAvailable(100);
        setLoading(false);
        return;
      }
      const data = s.data() || {};
      let value = Number.isFinite(data.available)
        ? data.available
        : Number.isFinite(data.plazas)
          ? data.plazas
          : Number.isFinite(data.disponibles)
            ? data.disponibles
            : Number.isFinite(data.total) && Number.isFinite(data.ocupadas)
              ? data.total - data.ocupadas
              : 100;
      value = Math.max(0, Math.min(100, Math.round(value)));
      setAvailable(value);
      setLoading(false);
    }, (e) => {
      console.warn('Firestore onSnapshot error', e);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const displayCount = available != null ? String(available) : '100';

  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={3}>
        <Text style={styles.title}>Plazas disponibles</Text>
        <View style={styles.iconCircle}>
          <MaterialIcons name="local-parking" size={40} color="#44C265" />
        </View>
        {loading ? (
          <ActivityIndicator animating={true} style={styles.loader} />
        ) : (
          <>
            <Text style={styles.count}>{displayCount}</Text>
            <Chip icon="parking" style={styles.chip} textStyle={styles.chipText}>Disponibles</Chip>
            <Text style={styles.caption}>Capacidad total 100 plazas</Text>
            <Text style={styles.note}>Actualización en tiempo real</Text>
          </>
        )}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  card: { alignItems: 'center', paddingVertical: 28, borderRadius: 20, backgroundColor: '#F5F5F5', width: '92%', alignSelf: 'center' },
  title: { fontSize: 16, color: '#666666', marginBottom: 8 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#DEF3DB', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  count: { fontSize: 64, fontWeight: '800', color: '#000000', lineHeight: 72, letterSpacing: 0.5 },
  chip: { marginTop: 6, backgroundColor: '#EAF7E7' },
  chipText: { color: '#2E7D32', fontWeight: '700' },
  caption: { marginTop: 10, fontSize: 16, color: '#555555' },
  note: { marginTop: 4, fontSize: 12, color: '#888888' },
  loader: { marginTop: 8 },
});
