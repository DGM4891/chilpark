import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, ActivityIndicator, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../../infrastructure/firebase/FirestoreAdapter';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

export default function ServiciosScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'config', 'servicios');
    const unsub = onSnapshot(ref, async s => {
      if (!s.exists()) {
        const seed = {
          items: [
            { key: 'lavado', title: 'Lavado de autos', description: 'Servicio de lavado', priceCents: 300, icon: 'local-car-wash' },
            { key: 'arriendo', title: 'Arrendamiento mensual', description: 'Plaza por mes', priceCents: 2000, icon: 'local-parking' },
            { key: 'mantenimiento', title: 'Mantenimiento preventivo', description: 'Baterías y limpieza', priceCents: 1000, icon: 'build' },
          ],
          updatedAt: serverTimestamp(),
        };
        await setDoc(ref, seed, { merge: true });
        setItems(seed.items);
        setLoading(false);
        return;
      }
      const data = s.data() || {};
      const list = Array.isArray(data.items) ? data.items : [];
      setItems(list);
      setLoading(false);
    }, (e) => {
      console.warn('Firestore onSnapshot error', e);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios</Text>
      {loading ? (
        <ActivityIndicator animating={true} style={styles.loader} />
      ) : (
        <View style={styles.list}>
          {items.map(item => (
            <Surface key={item.key} style={styles.card} elevation={3}>
              <View style={styles.iconRow}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name={item.icon || 'miscellaneous-services'} size={32} color="#44C265" />
                </View>
                <View style={styles.texts}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.description ? <Text style={styles.cardDesc}>{item.description}</Text> : null}
                </View>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{typeof item.priceCents === 'number' ? (item.priceCents / 100).toFixed(2) : typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</Text>
                <Chip icon="currency-usd" style={styles.chip} textStyle={styles.chipText}>USD</Chip>
              </View>
            </Surface>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF' },
  title: { fontSize: 18, fontWeight: '700', color: '#333333', marginBottom: 12, alignSelf: 'center' },
  list: { gap: 12 },
  card: { backgroundColor: '#F5F5F5', borderRadius: 20, paddingVertical: 16, paddingHorizontal: 12 },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#DEF3DB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  texts: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#000000' },
  cardDesc: { fontSize: 13, color: '#666666', marginTop: 2 },
  priceRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center' },
  price: { fontSize: 22, fontWeight: '800', color: '#000000', marginRight: 8 },
  chip: { backgroundColor: '#EAF7E7' },
  chipText: { color: '#2E7D32', fontWeight: '700' },
  loader: { marginTop: 8, alignSelf: 'center' },
});

