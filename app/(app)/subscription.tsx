import { useRouter } from 'expo-router';
import { Colors, Fonts, Gaps } from '../../shared/tokens';
import { useState } from 'react';
import { ScrollView, View, Image, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';

export default function Payment() {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardHolder, setCardHolder] = useState('');

    const validateForm = () => {
        if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
            return 'Некорректный номер карты';
        }
        if (!expiryDate || expiryDate.length !== 5) {
            return 'Некорректная дата';
        }
        if (!cvc || cvc.length !== 3) {
            return 'Некорректный CVC';
        }
        if (!cardHolder) {
            return 'Введите имя владельца';
        }
        return null;
    };

    const handlePayment = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsProcessing(true);
        setError('');
        setCardNumber('');
        setExpiryDate('');
        setCvc('');
        setCardHolder('');
                
        router.push({
            pathname: '/(app)/bot',
            params: { refresh: Date.now() }
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Оформить premium-подписку</Text>
            </View>

            <View style={styles.paymentForm}>
                <Text style={styles.sectionTitle}>Данные карты</Text>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Номер карты</Text>
                    <MaskedTextInput
                        style={styles.input}
                        mask="9999 9999 9999 9999"
                        keyboardType="numeric"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        placeholder="4242 4242 4242 4242"
                        placeholderTextColor={Colors.gray}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Срок действия</Text>
                        <MaskedTextInput
                            style={styles.input}
                            mask="99/99"
                            keyboardType="numeric"
                            value={expiryDate}
                            onChangeText={setExpiryDate}
                            placeholder="ММ/ГГ"
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                    
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                        <Text style={styles.label}>CVC</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            maxLength={3}
                            value={cvc}
                            onChangeText={setCvc}
                            placeholder="123"
                            secureTextEntry
                            placeholderTextColor={Colors.gray}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Имя владельца</Text>
                    <TextInput
                        style={styles.input}
                        value={cardHolder}
                        onChangeText={setCardHolder}
                        placeholder="IVAN IVANOV"
                        autoCapitalize="characters"
                        placeholderTextColor={Colors.gray}
                    />
                </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            {isProcessing ? (
                <ActivityIndicator size="large" color="#3498db" />
            ) : (
                <TouchableOpacity 
                    style={styles.payButton} 
                    onPress={handlePayment}
                    disabled={isProcessing}
                >
                    <Text style={styles.payButtonText}>Оплатить 1299 ₽</Text>
                </TouchableOpacity>
            )}
            
            <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => router.back()}
                disabled={isProcessing}
            >
                <Text style={styles.cancelButtonText}>Отменить</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: Gaps.g20,
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: Fonts.f20,
        fontFamily: 'FiraSansSemiBold',
        color: Colors.white,
    },
    rightInfo: {
        marginLeft: 10,
    },
    bookTitle: {
        fontSize: Fonts.f16,
        fontWeight: '600',
        color: Colors.white,
    },
    price: {
        fontSize: Fonts.f16,
        fontFamily: 'FiraSans',
        color: Colors.links,
        marginTop: 10,
    },
    cardInfo: {
        fontSize: 16,
        marginBottom: 10,
    },
    payButton: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 10,
        width: '100%'
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'FiraSans',
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: '#e74c3c',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%'
    },
    cancelButtonText: {
        color: '#e74c3c',
        fontSize: 18,
        fontFamily: 'FiraSans',
    },
    bookImage: {
        width: 70,
        height: 85
    },
    paymentForm: {
        marginBottom: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.darkGrey,
        padding: 10,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'FiraSansSemiBold',
        marginBottom: 15,
        color: Colors.white,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: Colors.white,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
    },
});

function clearForm() {
    throw new Error('Function not implemented.');
}
