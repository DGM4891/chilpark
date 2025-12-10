import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import MenuScreen from '../screens/MenuScreen';
import MapScreen from '../screens/MapScreen';
import PrecioScreen from '../screens/PrecioScreen';
import PlazasDisponiblesScreen from '../screens/PlazasDisponiblesScreen';
import ServiciosScreen from '../screens/ServiciosScreen';
import IngresoScreen from '../screens/IngresoScreen';
import SalidaScreen from '../screens/SalidaScreen';
import RecoverPasswordScreen from '../screens/RecoverPasswordScreen';
import { Avatar, Menu, Divider } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase/AuthAdapter';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const HeaderAvatarMenu = ({ navigation }) => {
    const [visible, setVisible] = useState(false);
    const email = auth.currentUser?.email ?? '';
    const initial = email ? email.charAt(0).toUpperCase() : 'U';
    return (
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setVisible(true)} style={{ marginRight: 12 }}>
            <Avatar.Text size={28} label={initial} />
          </TouchableOpacity>
        }
      >
        <Menu.Item title={email || 'Sin correo'} disabled />
        <Divider />
        <Menu.Item
          onPress={async () => {
            await signOut(auth);
            setVisible(false);
            navigation.replace('Login');
          }}
          title="Cerrar Sesión"
          leadingIcon="logout"
        />
      </Menu>
    );
  };
  // Ensure SalidaScreen is registered
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RecuperarClave" component={RecoverPasswordScreen} options={{ title: 'Recuperar clave' }} />
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={({ navigation }) => ({
          title: 'Menu Principal',
          headerRight: () => <HeaderAvatarMenu navigation={navigation} />,
        })}
      />
      <Stack.Screen name="Mapa" component={MapScreen} />
      <Stack.Screen name="Precio" component={PrecioScreen} options={{ title: 'Precio hora' }} />
      <Stack.Screen name="Plazas" component={PlazasDisponiblesScreen} options={{ title: 'Plazas disponibles' }} />
      <Stack.Screen name="Servicios" component={ServiciosScreen} options={{ title: 'Servicios' }} />
      <Stack.Screen name="Ingreso" component={IngresoScreen} options={{ title: 'Registro de Ingreso' }} />
      <Stack.Screen name="Salida" component={SalidaScreen} options={{ title: 'Registro de Salida' }} />
    </Stack.Navigator>
  );
}
