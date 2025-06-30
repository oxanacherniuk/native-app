
import { ScrollView, TextInput, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors, Fonts } from '../../../shared/tokens';
import { useState } from 'react';
import { CommentButton } from '../../../shared/CommentButton/CommentButton';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../src/constants/Config';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Comment = {
    id: string;
    bookId: string;
    author: string;
    text: string;
    rating: number;
    date: string;
    userId?: string;
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

export default function CommentModal() {
    const [rating, setRating] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { bookId, title } = useLocalSearchParams<{ bookId: string; title: string }>();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!rating || !commentText.trim()) {
            setError('Заполните все поля');
            return;
        }

    setIsSubmitting(true);
    setError('');

    const commentData = {
        author: 'Читатель',
        text: commentText,
        rating
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(`http://192.168.0.200:3001/api/books/${bookId}/comments`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            body: JSON.stringify(commentData),
            signal: controller.signal
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        
        router.replace({
            pathname: '/(app)/book/details',
            params: { id: bookId, refresh: Date.now().toString() }
        });

        } catch (error) {
        
        try {
            const newComment = {
            id: generateId(),
            bookId: bookId!,
            ...commentData,
            date: new Date().toISOString()
            };

            const existing = await AsyncStorage.getItem(`comments_${bookId}`) || '[]';
            const updated = [...JSON.parse(existing), newComment];
            await AsyncStorage.setItem(`comments_${bookId}`, JSON.stringify(updated));

            router.replace({
            pathname: '/(app)/(book)/details',
            params: { id: bookId, refresh: Date.now().toString() }
            });

        } catch (localError) {
            console.error('Ошибка локального сохранения:', localError);
            setError('Не удалось сохранить комментарий');
        }
        } finally {
        clearTimeout(timeout);
        setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>{title}</Text>
                
                <Text style={styles.subTitle}>Ваша оценка:</Text>
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => {
                                setRating(star);
                                setError('');
                            }}
                        >
                            <Text style={[styles.star, star <= rating && styles.activeStar]}>
                                {star <= rating ? '★' : '☆'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                <Text style={styles.subTitle}>Ваш отзыв:</Text>
                <TextInput
                    style={styles.input}
                    multiline
                    numberOfLines={5}
                    placeholder="Напишите ваш отзыв..."
                    value={commentText}
                    onChangeText={(text) => {
                        setCommentText(text);
                        setError('');
                    }}
                    placeholderTextColor={Colors.gray}
                />
                
                {error ? (
                    <Text>{error}</Text>
                ) : null}
                
                <CommentButton 
                    text={isSubmitting ? 'Отправка...' : 'Отправить отзыв'} 
                    onPress={handleSubmit} 
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                />
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.black,
    },
    scrollContainer: {
        paddingBottom: 30,
    },
    title: {
        fontSize: Fonts.f18,
        fontFamily: 'FiraSansSemiBold',
        marginBottom: 25,
        color: Colors.white,
    },
    subTitle: {
        fontSize: Fonts.f16,
        fontFamily: 'FiraSans',
        marginBottom: 10,
        color: Colors.white,
    },
    ratingContainer: {
        marginBottom: 20,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        minHeight: 120,
        textAlignVertical: 'top',
        color: Colors.white
    },
    submitButton: {
        backgroundColor: Colors.violetDark,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitText: {
        color: Colors.white,
        fontFamily: 'FiraSans',
        fontSize: Fonts.f16,
    },
    star: {
        color: Colors.premium,
        fontSize: 36,
    },
    activeStar: {},
});

function uuid(): string {
    throw new Error('Function not implemented.');
}
