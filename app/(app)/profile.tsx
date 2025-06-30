import { Text, View, StyleSheet, Alert, Image, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { UploadButton } from '../../shared/UploadButton/UploadButton';
import { Colors, Gaps, Radius } from '../../shared/tokens';
import { useAtom } from 'jotai';
import { loadProfileAtom, updateProfileAtom, UserProfile } from '../../entities/user/model/user.state';
import { Button } from '../../shared/Button/Button';
import * as Sharing from 'expo-sharing';
import { SharedButton } from '../../shared/SharedButton/SharedButton';
import { Avatar } from '../../entities/user/ui/Avatar/Avatar';
import { Footer } from '../../shared/Footer/Footer';
import { currentUserAtom } from '../../entities/auth/model/auth.state';

export default function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [profileState, updateProfile] = useAtom(updateProfileAtom);
    const [, loadProfile] = useAtom(loadProfileAtom);
    const [user, setUser] = useAtom(currentUserAtom);

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        if (profileState.profile) {
            setName(profileState.profile.name || '');
            setEmail(profileState.profile.email || '');
            if (profileState.profile.photo) {
                setImage(profileState.profile.photo);
            }
            setUser(profileState.profile); 
        }
    }, [profileState.profile]);

    const handleUpdateProfile = async () => {
        if (newPassword && newPassword !== confirmPassword) {
            Alert.alert('Ошибка', 'Новые пароли не совпадают');
            return;
        }

        try {
            const updateData: {
                name?: string;
                photo?: string;
                currentPassword?: string;
                newPassword?: string;
            } = {};

            if (name !== profileState.profile?.name) {
                updateData.name = name;
            }

            if (image && image !== profileState.profile?.photo) {
                updateData.photo = image;
            }

            if (newPassword) {
                updateData.currentPassword = currentPassword;
                updateData.newPassword = newPassword;
            }

            if (Object.keys(updateData).length > 0) {
                await updateProfile(updateData);
                await loadProfile();
                Alert.alert('Успех', 'Профиль обновлен');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            console.error('Ошибка обновления профиля:', error);
            Alert.alert('Ошибка', 'Не удалось обновить профиль');
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    <Avatar image={image} />
                    <UploadButton 
                        onUpload={setImage} 
                        onError={(error) => Alert.alert('Ошибка', error)} 
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Имя</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor={Colors.gray}
                        placeholder="Введите ваше имя"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor={Colors.gray}
                        placeholder="Введите ваш email"
                        keyboardType="email-address"
                        editable={false}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Текущий пароль</Text>
                    <TextInput
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholderTextColor={Colors.gray}
                        placeholder="Введите текущий пароль"
                        secureTextEntry
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Новый пароль</Text>
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholderTextColor={Colors.gray}
                        placeholder="Введите новый пароль"
                        secureTextEntry
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Подтвердите пароль</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholderTextColor={Colors.gray}
                        placeholder="Подтвердите новый пароль"
                        secureTextEntry
                    />
                </View>

                <Button
                    text="Сохранить изменения"
                    style={styles.save}
                    onPress={handleUpdateProfile}
                    isLoading={profileState.isLoading}
                    disabled={profileState.isLoading}
                />
            </View>
            <Footer />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'FiraSans',
        color: Colors.white,
    },
    input: {
        backgroundColor: Colors.violetDark,
        height: 58,
        paddingHorizontal: 24,
        borderRadius: Radius.r10,
        fontSize: 16,
        color: Colors.gray,
        fontFamily: 'FiraSans',
    },
    save: {
        marginTop: 10,
        marginBottom: 120,
    },
});
function setUser(profile: UserProfile) {
    throw new Error('Function not implemented.');
}

