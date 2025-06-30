import { Image, View, StyleSheet, Text } from 'react-native';
import { Colors, Fonts, Gaps } from '../../../../shared/tokens';
import { UserProfile } from '../../../../entities/user/model/user.state';

export function UserMenu({ user }: { user: UserProfile | null | undefined }) {
    const defaultAvatar = require('../../../../assets/images/avatar.png');
    
    const getImageSource = () => {
        if (!user?.photo) return defaultAvatar;
        
        const uri = user.photo.startsWith('http') ? user.photo : `http://${user.photo}`;
        return { uri: `${uri}?${Date.now()}` };
    };
    
    return (
        <View style={styles.container}>
            <Image 
                source={getImageSource()}
                style={styles.avatar}
                defaultSource={defaultAvatar}
                onError={(e) => {
                    console.log('Ошибка загрузки аватарки:', e.nativeEvent.error);
                    return defaultAvatar;
                }}
            />
            <Text style={styles.name}>
                {user?.name || user?.email || 'Пользователь'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: Gaps.g8,
        marginTop: 30,
        marginBottom: 40,
    },
    name: {
        fontSize: Fonts.f16,
        color: Colors.white,
        fontFamily: 'FiraSans'
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
})