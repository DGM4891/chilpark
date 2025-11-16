import { View, Text, StyleSheet } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="CHILPARK" />
        <Appbar.Action icon={({ size, color }) => (
          <MaterialIcons name="search" size={size} color={color} />
        )} onPress={() => {}} />
        <Appbar.Action icon={({ size, color }) => (
          <MaterialIcons name="refresh" size={size} color={color} />
        )} onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.body}>
        <Text style={styles.title}>Mapa interactivo próximamente</Text>
        <Button mode="contained" icon={({ size, color }) => (
          <MaterialIcons name="map" size={size} color={color} />
        )}>Abrir mapa</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
});