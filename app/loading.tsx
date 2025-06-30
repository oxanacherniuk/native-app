import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Loading() {
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);
  
  return <ActivityIndicator />;
}