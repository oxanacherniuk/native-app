import { useAtom } from 'jotai';
import { authAtom } from '../entities/auth/model/auth.state';
import { ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';

export default function Index() {
  const [authState] = useAtom(authAtom);
  
  if (authState.isLoading) {
    return <ActivityIndicator />;
  }
  
  return authState.access_token 
    ? <Redirect href="/(app)/home" /> 
    : <Redirect href="/(auth)/login" />;
}