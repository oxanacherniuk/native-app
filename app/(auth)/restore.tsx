import React, { useState, useEffect } from 'react';
import { View, Image, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, Text, Alert } from 'react-native';
import { API_URL } from '../../src/constants/Config';
import { useScreenOrientation } from '../../shared/hooks';
import { ErrorNotification } from '../../shared/ErrorNotification/ErrorNotification';
import { Orientation } from 'expo-screen-orientation';
import { Input } from '../../shared/Input/Input';
import { CustomLink } from '../../shared/CustomLink/CustomLink';
import { Button } from '../../shared/Button/Button';
import { Colors, Fonts, Gaps } from '../../shared/tokens';

export default function Restore() {
    const [localError, setLocalError] = useState<string | undefined>();
    const [email, setEmail] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const orientation = useScreenOrientation();

    const submit = async () => {
        setIsLoading(true);
        setLocalError("");
    
        try {
            const response = await fetch(`${API_URL}/api/restore-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });
    
            const contentType = response.headers.get("content-type");
            if (!contentType?.includes("application/json")) {
                const text = await response.text();
                throw new Error(text.includes("<html") ? "Сервер недоступен" : text);
            }
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Ошибка сервера");
    
            Alert.alert("Успех!", "Пароль изменен.");
        } catch (err) {
            setLocalError(err.message.replace(/<[^>]+>/g, "")); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ErrorNotification error={localError} />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={styles.content}
            >
                <Text style={styles.title}>Восстановить пароль</Text>
                <View style={styles.form}>
                    <View style={{
                        ...styles.inputs, 
                        flexDirection: orientation === Orientation.PORTRAIT_UP ? 'column' : 'row'
                    }}>
                        <Input 
                            value={email}
                            style={{
                                width: orientation === Orientation.PORTRAIT_UP 
                                    ? 'auto' 
                                    : Dimensions.get('window').width / 2 - 16 - 48
                            }} 
                            placeholder='Email' 
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Input 
                            value={newPassword}
                            style={{
                                width: orientation === Orientation.PORTRAIT_UP 
                                    ? 'auto' 
                                    : Dimensions.get('window').width / 2 - 16 - 48
                            }} 
                            isPassword 
                            placeholder='Новый пароль' 
                            onChangeText={setNewPassword}
                        />
                        <Input 
                            value={confirmPassword}
                            style={{
                                width: orientation === Orientation.PORTRAIT_UP 
                                    ? 'auto' 
                                    : Dimensions.get('window').width / 2 - 16 - 48
                            }} 
                            isPassword 
                            placeholder='Повторите пароль' 
                            onChangeText={setConfirmPassword}
                        />
                    </View>
                    <Button 
                        text='Восстановить' 
                        onPress={submit} 
                        isLoading={isLoading} 
                    />
                </View>
                <View style={styles.links}>
                    <CustomLink href={'/register'} text='Зарегистрироваться' />
                    <CustomLink href={'/login'} text='Войти' />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1,
        backgroundColor: Colors.black,
        padding: 55
    },
    title:{
        color: Colors.white,
        fontSize: Fonts.f20,
        fontFamily: 'FiraSansSemiBold',
    },
    content: {
        alignItems: 'center',
        gap: Gaps.g50,
        maxWidth: 400,
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
        gap: 15,
    },
    inputs: {
        gap: Gaps.g16
    },
});
