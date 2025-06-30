import { View, Text, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { CustomLink } from '../../shared/CustomLink/CustomLink';
import { Colors, Fonts, Gaps } from '../../shared/tokens';
import { useEffect, useState } from 'react';
import { Input } from '../../shared/Input/Input';
import { Button } from '../../shared/Button/Button';
import { useRouter } from 'expo-router';
import { API_URL } from '../../src/constants/Config';

export default function Register() {
  const [localError, setLocalError] = useState<string | undefined>();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const submit = async () => {
    console.log('Submitting with:', { email, password });
    if (!name) {
      setLocalError('Не введено имя');
      return;
    }
    
    if (!email) {
      setLocalError('Не введен email');
      return;
    }
  
    if (!password) {
      setLocalError('Не введен пароль');
      return;
    }
    
    if (password !== confirmPassword) {
      setLocalError('Пароли не совпадают');
      return;
    }
    
    setIsLoading(true);
    setLocalError(undefined);
    
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации');
      }
      
      Alert.alert('Успех', 'Вы успешно зарегистрированы!', [
        { text: 'OK', onPress: () => router.push('/login') },
      ]);
    } catch (error) {
      setLocalError('Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding' style={styles.content}>
        <Image
          resizeMode='contain'
          style={styles.logo}
          source={require('../../assets/logo.png')}
        />
        <View 
            style={styles.form}>
          <Input placeholder='Введите имя' onChangeText={setName} />
          <Input 
            placeholder='Введите email' 
            onChangeText={setEmail} 
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input 
            isPassword 
            placeholder='Придумайте пароль' 
            onChangeText={setPassword} 
          />
          <Input 
            isPassword 
            placeholder='Повторите пароль' 
            onChangeText={setConfirmPassword} 
          />
          <Button 
            text='Зарегистрироваться' 
            onPress={submit} 
            isLoading={isLoading}
          />
        </View>
        <View style={styles.links}>
          <Text style={styles.textLink}>Уже есть аккаунт?</Text>
          <CustomLink href={'/login'} text='Войдите' />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: Colors.black,
    padding: 55
  },
  content: {
    alignItems: 'center',
    gap: Gaps.g20
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
    gap: 5,
  },
  textLink: {
    fontSize: Fonts.f14,
    fontFamily: 'Fira Sans',
    color: Colors.gray
  }
})