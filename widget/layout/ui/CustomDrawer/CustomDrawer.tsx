import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Colors } from '../../../../shared/tokens';
import { CustomLink } from '../../../../shared/CustomLink/CustomLink';
import { CloseDrawer } from '../../../../entities/layout/ui/CloseDrawer/CloseDrawer';
import { useAtom, useSetAtom } from 'jotai';
import { logoutAtom } from '../../../../entities/auth/model/auth.state';
import { loadProfileAtom } from '../../../../entities/user/model/user.state';
import { useEffect, useState } from 'react';
import { UserMenu } from '../../../user/ui/UserMenu/UserMenu';
import ProfileIcon from '../../../../assets/icons/menu/profile';
import LibraryIcon from '../../../../assets/icons/menu/library';
import MyBooksIcon from '../../../../assets/icons/menu/my-books';
import FavoriteIcon from '../../../../assets/icons/menu/favorite';
import AboutUsIcon from '../../../../assets/icons/menu/about-us';
import PremiumIcon from '../../../../assets/icons/menu/premium';
import { MenuItem } from '../../../../entities/layout/ui/MenuItem/MenuItem';

const MENU = [{ text: 'Профиль', icon: <ProfileIcon />, path: 'profile' },
    { text: 'Библиотека', icon: <LibraryIcon />, path: 'index' },
    { text: 'Мои книги', icon: <MyBooksIcon />, path: 'mybooks' },
    { text: 'О нас', icon: <AboutUsIcon />, path: 'aboutus' },
    { text: 'Premium', icon: <PremiumIcon />, path: 'premium' },
    { text: 'Настройки', icon: <FavoriteIcon />, path: 'settings' },
]

export function CustomDrawer(props: DrawerContentComponentProps) {
    const logout = useSetAtom(logoutAtom);
    const [profile, loadProfile] = useAtom(loadProfileAtom);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await loadProfile();
            setIsLoading(false);
        };
        load();
    }, [loadProfile]);

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
            <View style={styles.content}>
                <CloseDrawer {...props.navigation} />
                <UserMenu user={profile.profile} />
                {MENU.map((menu) => (
                    <MenuItem key={menu.path} drawer={props} {...menu}  />
                ))}
            </View>
            <View style={styles.footer}>
                <CustomLink text='Выход' onPress={() => logout()} href={'/login'} />
                <Image 
                    style={styles.logo}
                    resizeMode='contain'
                    source={require('../../../../assets/logo.png')}
                />
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    content: {
        flex: 1,
    },
    footer: {
        gap: 5,
        alignItems: 'center',
        marginBottom: 5,
    },
    logo: {
        width: 160
    }
})