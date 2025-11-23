import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Text, Surface, Chip, TouchableRipple } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../../infrastructure/firebase/FirestoreAdapter';
import { doc, onSnapshot } from 'firebase/firestore';

export default function MenuScreen({ navigation }) {
  const defaultFeatures = [
    { key: 'precio', label: 'Precio hora', icon: 'attach-money', type: 'navigate', value: 'Precio' },
    { key: 'plazas', label: 'Plazas disponibles', icon: 'local-parking', type: 'noop' },
    { key: 'ingresar', label: 'Ingresar', icon: 'login', type: 'noop' },
    { key: 'salir', label: 'Salir', icon: 'logout', type: 'noop' },
    { key: 'servicios', label: 'Servicios', icon: 'miscellaneous-services', type: 'noop' },
    { key: 'ruta', label: 'Como llegar', icon: 'directions', type: 'link', value: "https://www.google.com/maps/place/0%C2%B018'02.6%22S+78%C2%B032'55.1%22W/@-0.3007016,-78.5512209,755m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d-0.300707!4d-78.548646?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D" },
  ];
  const [features, setFeatures] = useState(defaultFeatures.map(i => ({
    key: i.key,
    label: i.label,
    icon: i.icon,
    onPress: () => i.type === 'navigate' ? navigation.navigate(i.value) : i.type === 'link' ? Linking.openURL(i.value) : null,
  })));

  useEffect(() => {
    const ref = doc(db, 'config', 'menu');
    const unsub = onSnapshot(ref, s => {
      const items = (s.data()?.items || []).filter(x => x.enabled !== false);
      const sorted = items.sort((a, b) => (a.order || 0) - (b.order || 0));
      const mapped = sorted.map(i => ({
        key: i.key,
        label: i.label,
        icon: i.icon,
        onPress: () => i.type === 'navigate' ? navigation.navigate(i.value) : i.type === 'link' ? Linking.openURL(i.value) : null,
      }));
      setFeatures(mapped.length ? mapped : defaultFeatures.map(i => ({
        key: i.key,
        label: i.label,
        icon: i.icon,
        onPress: () => i.type === 'navigate' ? navigation.navigate(i.value) : i.type === 'link' ? Linking.openURL(i.value) : null,
      })));
    });
    return () => unsub();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accesos rápidos</Text>
      <View style={styles.grid}>
        {features.map((f) => (
          <View key={f.key} style={styles.tileWrap}>
            <TouchableRipple onPress={f.onPress} rippleColor="rgba(68,194,101,0.2)">
              <Surface style={styles.tile} elevation={3}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name={f.icon} size={32} color="#44C265" />
                </View>
                <Chip style={styles.chip} textStyle={styles.chipText}>{f.label}</Chip>
              </Surface>
            </TouchableRipple>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#333333', marginBottom: 12, alignSelf: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tileWrap: { width: '48%', marginBottom: 14 },
  tile: { backgroundColor: '#F5F5F5', borderRadius: 20, paddingVertical: 20, paddingHorizontal: 12, alignItems: 'center' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#DEF3DB', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  chip: { backgroundColor: '#EAF7E7' },
  chipText: { color: '#000000', fontWeight: '700' },
});
