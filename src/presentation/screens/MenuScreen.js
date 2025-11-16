import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function MenuScreen({ navigation }) {

  const features = [
    { key: 'precio', label: 'Precio hora', icon: 'attach-money', onPress: () => {} },
    { key: 'plazas', label: 'Plazas disponibles', icon: 'local-parking', onPress: () => {} },
    { key: 'ingresar', label: 'Ingresar', icon: 'login', onPress: () => {} },
    { key: 'salir', label: 'Salir', icon: 'logout', onPress: () => {} },
    { key: 'servicios', label: 'Servicios', icon: 'miscellaneous-services', onPress: () => {} },
    { key: 'ruta', label: 'Como llegar', icon: 'directions', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {features.map((f) => (
          <TouchableOpacity key={f.key} style={styles.tileWrap} activeOpacity={0.8} onPress={f.onPress}>
            <Surface style={styles.tile} elevation={2}>
              <View style={styles.iconCircle}>
                <MaterialIcons name={f.icon} size={28} color="#44C265" />
              </View>
              <Text style={styles.tileText}>{f.label}</Text>
            </Surface>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tileWrap: { width: '48%', marginBottom: 14 },
  tile: { backgroundColor: '#F5F5F5', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 12, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#DEF3DB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  tileText: { color: '#000000', textAlign: 'center', fontWeight: '600' },
});