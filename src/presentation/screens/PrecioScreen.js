import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, ActivityIndicator, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../../infrastructure/firebase/FirestoreAdapter';
import { doc, onSnapshot } from 'firebase/firestore';

export default function PrecioScreen() {
  const [priceCents, setPriceCents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'config', 'pricing');
    const unsub = onSnapshot(ref, s => {
      const data = s.data() || {};
      const cents = typeof data.priceCents === 'number'
        ? data.priceCents
        : typeof data.pricing === 'number'
          ? Math.round(data.pricing * 100)
          : 50;
      setPriceCents(cents);
      setLoading(false);
    }, (e) => {
      console.warn('Firestore onSnapshot error', e);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const priceUsd = priceCents != null ? (priceCents / 100).toFixed(2) : '0.50';

  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={3}>
        <Text style={styles.title}>Tarifa actual</Text>
        <View style={styles.iconCircle}>
          <MaterialIcons name="attach-money" size={40} color="#44C265" />
        </View>
        {loading ? (
          <ActivityIndicator animating={true} style={styles.loader} />
        ) : (
          <>
            <Text style={styles.price}>{priceUsd}</Text>
            <Chip icon="currency-usd" style={styles.chip} textStyle={styles.chipText}>USD</Chip>
            <Text style={styles.caption}>Precio por hora o fracción</Text>
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
  price: { fontSize: 64, fontWeight: '800', color: '#000000', lineHeight: 72, letterSpacing: 0.5 },
  chip: { marginTop: 6, backgroundColor: '#EAF7E7' },
  chipText: { color: '#2E7D32', fontWeight: '700' },
  caption: { marginTop: 10, fontSize: 16, color: '#555555' },
  note: { marginTop: 4, fontSize: 12, color: '#888888' },
  loader: { marginTop: 8 },
});
