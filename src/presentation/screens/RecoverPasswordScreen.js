import { View, StyleSheet, Image } from 'react-native';
import { Text, Card, TextInput, Button, Portal, Dialog } from 'react-native-paper';
import { useState } from 'react';
import { sendPasswordResetEmail, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase/AuthAdapter';

export default function RecoverPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const validEmail = (v) => /.+@.+\..+/.test(v);

  const onSubmit = async () => {
    const e = email.trim();
    if (!e) {
      setMessage('Ingrese su correo');
      setDialogTitle('Error');
      setVisible(true);
      return;
    }
    if (!validEmail(e)) {
      setMessage('El correo no es válido');
      setDialogTitle('Error');
      setVisible(true);
      return;
    }
    
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, e);
      setMessage('Si el correo existe en nuestro sistema, recibirás un email para restablecer tu contraseña');
      setDialogTitle('Correo Enviado');
      setVisible(true);
    } catch (err) {
      console.log('RecoverPasswordScreen: error', err.code, err.message);
      let msg = 'Ocurrió un error. Intenta nuevamente';
      if (err.code === 'auth/invalid-email') msg = 'El correo no es válido';
      setMessage(msg);
      setDialogTitle('Error');
      setVisible(true);
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
        <Text variant="titleMedium" style={styles.title}>¿Olvidó su contraseña?</Text>
        <Text style={styles.subtitle}>Ingrese su correo para recuperar su contraseña</Text>
        <TextInput
          label="Correo"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          outlineColor="#DEF3DB"
          activeOutlineColor="#000000"
          textColor="#000000"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button mode="contained" onPress={onSubmit} loading={loading} buttonColor="#DEF3DB" textColor="#000000" style={styles.submit}>
          Enviar
        </Button>
      </Card>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{dialogTitle}</Dialog.Title>
          <Dialog.Content>
            <Text>{message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)} textColor="#000000">Aceptar</Button>
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
  title: { color: '#000000', textAlign: 'center', marginBottom: 6 },
  subtitle: { color: '#000000', textAlign: 'center', marginBottom: 16 },
  input: { marginBottom: 16, backgroundColor: '#FFFFFF' },
  submit: { marginTop: 10 },
  footer: { position: 'absolute', bottom: 16, left: 0, right: 0, alignItems: 'center' },
  footerText: { color: '#000000' },
});