import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useState } from 'react';
import { Book } from '../../shared/ProductCard/ProductCard';
import { Colors, Fonts, Gaps } from '../../shared/tokens';
import { MaskedTextInput } from 'react-native-mask-text';
import { ScrollView } from 'react-native-gesture-handler';
import { usePurchasedBooks } from '../../hooks/usePurchasedBooks';
import { API_URL } from '../../src/constants/Config';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';

export default function Payment() {
    const { book } = useLocalSearchParams();
    const parsedBook: Book = JSON.parse(book as string);
    const router = useRouter();
    const { addPurchasedBook } = usePurchasedBooks();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardHolder, setCardHolder] = useState('');

    const imageUrl = parsedBook.large_image.startsWith('http') 
        ? parsedBook.large_image 
        : `http://192.168.0.200:3001/uploads/${parsedBook.large_image}`;

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
        
        try {
            const success = await addPurchasedBook(parsedBook);
            if (success) {
                setCardNumber('');
                setExpiryDate('');
                setCvc('');
                setCardHolder('');
                
                router.push({
                    pathname: '/(app)/mybooks',
                    params: { refresh: Date.now() }
                });
            } else {
                setError('Не удалось завершить покупку');
            }
        } catch (e) {
            setError('Ошибка при обработке платежа');
        } finally {
            setIsProcessing(false);
        }
    };

    const backward = async () => {
        router.push({
            pathname: '/(app)/index'
        });
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.bookInfo}>
                <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.bookImage}
                    resizeMode="contain"
                />
                <View style={styles.rightInfo}>
                    <Text style={styles.bookTitle}>{parsedBook.title}</Text>
                    <Text style={styles.price}>{parsedBook.price.toFixed(0)} ₽</Text>
                </View>
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
                            placeholderTextColor={Colors.gray}
                            secureTextEntry
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
                        placeholderTextColor={Colors.gray}
                        autoCapitalize="characters"
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
                    <Text style={styles.payButtonText}>Оплатить {parsedBook.price.toFixed(0)} ₽</Text>
                </TouchableOpacity>
            )}
            
            <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={backward}
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
    bookInfo: {
        marginBottom: 20,
        borderRadius: 10,
        flexDirection: 'row',
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
