import { StyleSheet, View, Image, Dimensions, KeyboardAvoidingView, Platform, Animated, Keyboard, Alert } from 'react-native';
import { Input } from '../../shared/Input/Input';
import { Colors, Gaps } from '../../shared/tokens';
import { Button } from '../../shared/Button/Button';
import { ErrorNotification } from '../../shared/ErrorNotification/ErrorNotification';
import { useEffect, useRef, useState } from 'react';
import { CustomLink } from '../../shared/CustomLink/CustomLink';
import { useAtom } from 'jotai';
import { loginAtom } from '../../entities/auth/model/auth.state';
import { useScreenOrientation } from '../../shared/hooks';
import { Orientation } from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Login() {
  const [localError, setLocalError] = useState<string | undefined>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authState, login] = useAtom(loginAtom);
  const router = useRouter();
  const orientation = useScreenOrientation();
  const { isLoading, error } = authState || {};

  useEffect(() => {
    if (authState.access_token) {
        AsyncStorage.multiSet([
          ['authToken', authState.access_token],
          ['currentUser', JSON.stringify({
            id: authState.user?.id,
            email: authState.user?.email,
            name: authState.user?.name,
          })]
        ]);
        router.replace('/(app)');
    }
}, [authState.access_token]);

const submit = async () => {
  if (!email) {
    setLocalError('Не введен email');
    return;
  }

  if (!password) {
    setLocalError('Не введен пароль');
    return;
  }

  try {
    const result = await login({ email, password });
    if (result?.success) {
      Alert.alert('Вы успешно вошли в аккаунт!')
    }
  } catch (err) {
    setLocalError("");
    await AsyncStorage.multiRemove(['authToken', 'currentUser']);
  }
};

useEffect(() => {
  if (error) {
    setLocalError(error);
  }
}, [error]);

  return (
    <View style={styles.container}>
      <ErrorNotification error={localError} />
      <KeyboardAvoidingView 
        behavior='padding'
        style={styles.content}
      >
        <Image
          resizeMode='contain'
          style={styles.logo}
          source={require('../../assets/logo.png')}
        />
        <View style={styles.form}>
          <View style={{
            ...styles.inputs, 
            flexDirection: orientation === Orientation.PORTRAIT_UP ? 'column' : 'row'
          }}>
            <Input 
              style={{
                width: orientation === Orientation.PORTRAIT_UP 
                  ? 'auto' 
                  : Dimensions.get('window').width / 2 - 16 - 48
              }} 
              placeholder='Email' 
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input 
              style={{
                width: orientation === Orientation.PORTRAIT_UP 
                  ? 'auto' 
                  : Dimensions.get('window').width / 2 - 16 - 48
              }} 
              isPassword 
              placeholder='Пароль' 
              onChangeText={setPassword}
            />
          </View>
          <Button 
            text='Войти' 
            onPress={submit} 
            isLoading={isLoading} 
          />
        </View>
        <View style={styles.links}>
          <CustomLink href={'/register'} text='Зарегистрироваться' />
          <CustomLink href={'/restore'} text='Восстановить пароль' />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    backgroundColor: Colors.black,
    padding: 55
  },
  content: {
    alignItems: 'center',
    gap: Gaps.g50,
    maxWidth: 400,
  },
  form: {
    alignSelf: 'stretch',
    gap: Gaps.g16
  },
  logo: {
    width: 220,
  },
  links: {
    flexDirection: 'row',
    gap: 15,
  },
  inputs: {
    gap: Gaps.g16
  },
});
