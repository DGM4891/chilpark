import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Card, Portal, Dialog } from 'react-native-paper';
import { useState } from 'react';
import LogoSvg from '../components/LogoSvg';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase/AuthAdapter';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  const validEmail = (v) => /.+@.+\..+/.test(v);

  const onLogin = async () => {
    setError('');
    const e = email.trim();
    const p = password.trim();
    if (!e || !p) {
      setError('Usuario y contraseña son requeridos');
      setErrorVisible(true);
      return;
    }
    if (!validEmail(e)) {
      setError('El usuario no cumple con la estructura de un correo electrónico.');
      setErrorVisible(true);
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, e, p);
      navigation.replace('Menu');
    } catch (e) {
      setError('El usuario o la contraseña son incorrectos.');
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.logoWrap}>
          <Image source={require('../../../assets/LOGO.png')} style={styles.logo} />
          <Text variant="titleLarge" style={styles.appName}>CHILPARK</Text>
        </View>
        <TextInput
          label="Usuario (email)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
          outlineColor="#DEF3DB"
          activeOutlineColor="#000000"
          textColor="#000000"
        />
        <TextInput
          label="Clave"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          mode="outlined"
          outlineColor="#DEF3DB"
          activeOutlineColor="#000000"
          textColor="#000000"
          right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
        />
        <Button mode="contained" onPress={onLogin} loading={loading} buttonColor="#DEF3DB" textColor="#000000" style={styles.submit}>
          Ingresar
        </Button>
        <Text onPress={() => navigation.navigate('RecuperarClave')} style={styles.forgotLink}>¿Olvidó su contraseña?</Text>
      </Card>
      <Portal>
        <Dialog visible={errorVisible} onDismiss={() => setErrorVisible(false)}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Text>{error}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setErrorVisible(false)} textColor="#000000">Aceptar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Derechos reservados © 2025 David Guamán</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#FFFFFF' },
  card: { padding: 24, backgroundColor: '#F5F5F5' },
  logoWrap: { alignItems: 'center', marginBottom: 24 },
  appName: { color: '#44C265', fontSize: 40, fontWeight: '900', marginTop: 12 },
  logo: { width: 100, height: 100, marginBottom: 8, resizeMode: 'contain' },
  input: { marginBottom: 16, backgroundColor: '#FFFFFF' },
  error: { color: 'red', marginBottom: 12 },
  forgot: { marginTop: 12 },
  forgotLink: { marginTop: 16, alignSelf: 'flex-end', color: '#44C265', textDecorationLine: 'underline', fontWeight: '700' },
  submit: { marginTop: 20, marginBottom: 4 },
  footer: { position: 'absolute', bottom: 16, left: 0, right: 0, alignItems: 'center' },
  footerText: { color: '#000000' },  
});