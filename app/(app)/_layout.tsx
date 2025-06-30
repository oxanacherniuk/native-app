import { Drawer } from 'expo-router/drawer';
import { useAtom, useAtomValue } from 'jotai';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { authAtom } from '../../entities/auth/model/auth.state';
import { Colors, Fonts } from '../../shared/tokens';
import { MenuButton } from '../../features/layout/ui/MenuButton/MenuButton';
import { CustomDrawer } from '../../widget/layout/ui/CustomDrawer/CustomDrawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function AppLayout() {
    const { access_token, isLoading } = useAtomValue(authAtom);
    const [authState] = useAtom(authAtom);
    const router = useRouter();
    
    useEffect(() => {
        if (!isLoading && !access_token) {
        router.replace('/login');
        }
    }, [access_token, isLoading]);
    
    if (isLoading) return <ActivityIndicator />;

    return (
        <GestureHandlerRootView style={styles.wrapper}>
            <Drawer 
                drawerContent={(props) => <CustomDrawer {...props} />}
                screenOptions={({ navigation }) => ({
                headerStyle: {
                    backgroundColor: Colors.blackLight,
                    shadowColor: Colors.blackLight,
                    shadowOpacity: 0,
                },
                headerLeft: () => <MenuButton navigation={navigation} />,
                headerTitleStyle: {
                    fontFamily: 'FiraSans',
                    color: Colors.white,
                    fontSize: Fonts.f20,
                },
                headerTitleAlign: 'center',
                sceneStyle: {
                    backgroundColor: Colors.black,
                },
                })}>
                <Drawer.Screen name='index' options={{ title: 'Библиотека' }} />
                <Drawer.Screen name='profile' options={{ title: 'Профиль' }} />
                <Drawer.Screen name='mybooks' options={{ title: 'Мои книги' }} />
                <Drawer.Screen name='aboutus' options={{ title: 'О нас' }} />
                <Drawer.Screen name='premium' options={{ title: 'Premium' }} />
                <Drawer.Screen name='settings' options={{ title: 'Настройки' }} />
            </Drawer>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
})