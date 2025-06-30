import { Stack } from 'expo-router';
import { Colors } from '../../shared/tokens';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: Colors.black },
                headerShown: false,
            }}
            >
            <Stack.Screen name="login" />
            <Stack.Screen 
                name="restore" 
                options={{ presentation: 'modal' }} 
            />
            <Stack.Screen name="register" />
        </Stack>
    );
}