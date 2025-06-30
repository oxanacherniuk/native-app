import { StatusBar } from 'expo-status-bar';
import { useAtom } from 'jotai';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui';
import { authAtom } from '../entities/auth/model/auth.state';
import { Slot, SplashScreen } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';

export default function RootLayout() {
    const [authState] = useAtom(authAtom);

    useEffect(() => {
        SystemUI.setBackgroundColorAsync('#16171D');
        const hideSplash = async () => {
            await SplashScreen.hideAsync();
        };
        hideSplash();
    }, []);
  

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <Slot />
        </SafeAreaProvider>
    );
}