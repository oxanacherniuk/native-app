import { Stack } from 'expo-router';
import { Colors } from '../../../shared/tokens';

export default function BookLayout() {
    return (
        <Stack
            screenOptions={{
                statusBarStyle: 'light',
                statusBarTranslucent: false,
                contentStyle: { backgroundColor: Colors.black },
                headerShown: false,
                animation: 'fade',
            }}
        >
            <Stack.Screen 
                name="comment" 
                options={{ 
                    presentation: 'modal',
                    statusBarStyle: 'light',
                    statusBarHidden: false,
                    gestureEnabled: true
                }} 
            />
            <Stack.Screen name="details" />
        </Stack>
    );
}