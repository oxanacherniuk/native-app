import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors, Fonts } from '../../../shared/tokens';
import { Button } from '../../../shared/Button/Button';
import { Footer } from '../../../shared/Footer/Footer';
import { CommentButton } from '../../../shared/CommentButton/CommentButton';
import { useCallback, useEffect, useState } from 'react';
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
    userId: string;
};

type Book = {
    id: number;
    small_image: string;
    large_image: string;
    title: string;
    price: number | string;
    category: string;
    direction: string;
    description?: string;
    rating?: number | string;
    comments?: Comment[];
};

export default function Details() {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const router = useRouter();

    const fetchBook = async () => {
        try {
            setLoading(true);
            setError('');
            
            if (!id) {
                throw new Error('Не указан ID книги');
            }

            const response = await fetch(`http://192.168.0.200:3001/api/books/${id}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Не удалось загрузить данные книги');
            }

            const data = await response.json();
            
            if (!data.success || !data.book) {
                throw new Error('Неверный формат данных книги');
            }

            const processedBook = {
                ...data.book,
                price: typeof data.book.price === 'string' 
                    ? parseFloat(data.book.price) 
                    : data.book.price,
                rating: typeof data.book.rating === 'string' 
                    ? parseFloat(data.book.rating) 
                    : data.book.rating
            };

            setBook(processedBook);
        } catch (err) {
            console.error('Ошибка загрузки книги:', err);
            setError('Ошибка загрузки книги');
        } finally {
            setLoading(false);
        }
    };

    const { id, refresh } = useLocalSearchParams<{ 
        id: string;
        refresh?: string;
    }>();
    
    const fetchComments = useCallback(async () => {
        try {
            setCommentsLoading(true);
            
            const response = await fetch(`http://192.168.0.200:3001/api/books/${id}/comments`);
            let serverComments = [];
            
            if (response.ok) {
                const data = await response.json();
                serverComments = data.success ? data.comments : [];
            }
            
            const stored = await AsyncStorage.getItem(`comments_${id}`) || '[]';
            const localComments = JSON.parse(stored);
            
            const merged = [
                ...serverComments,
                ...localComments
            ].filter((c, i, a) => a.findIndex(cc => cc.id === c.id) === i);
            
            setComments(merged);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setCommentsLoading(false);
        }
    }, [id, API_URL]);
    
    useEffect(() => {
        const loadData = async () => {
            await fetchBook();
            await fetchComments();
        };
        loadData();
    }, [id, fetchComments, refresh]);

    const handleBuy = () => {
        if (book) {
            router.push({
                pathname: '/(app)/payment',
                params: { 
                    book: JSON.stringify(book),
                    presentation: 'modal'
                },
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!book) {
        return (
            <View style={styles.container}>
                <Text>Книга не найдена</Text>
            </View>
        );
    }

    const imageUrl = book.large_image.startsWith('http') 
        ? book.large_image 
        : `http://192.168.0.200:3001/uploads/${book.large_image}`;

    const formattedPrice = typeof book.price === 'number' 
        ? book.price.toFixed(0)
        : parseFloat(book.price).toFixed(0);
    
    const formattedRating = book.rating 
        ? (typeof book.rating === 'number' ? book.rating : parseFloat(book.rating)).toFixed(1)
        : null;

    const handleAddComment = () => {
        router.push({
            pathname: '/(app)/(book)/comment',
            params: { 
                bookId: book.id.toString(),
                title: book.title 
            },
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Image 
                source={{ uri: imageUrl }} 
                style={styles.largeImage}
                resizeMode="contain"
                onError={() => console.log('Ошибка загрузки изображения книги')}
            />
            
            <View style={styles.details}>
                <Text style={styles.title}>{book.title}</Text>
                
                <View style={styles.metaContainer}>
                    <Text style={styles.category}>{book.category}</Text>
                    <Text style={styles.direction}>{book.direction}</Text>
                    {formattedRating && (
                        <Text style={styles.rating}>★ {formattedRating}</Text>
                    )}
                </View>
                
                <Text style={styles.price}>{formattedPrice} рублей</Text>
                
                <View style={styles.buttonsContainer}>
                    <Button onPress={handleBuy} text="Купить" style={styles.buyButton} />
                </View>
            </View>
            
            {book.description && (
                <View style={styles.description}>
                    <Text style={styles.descriptionTitle}>Описание</Text>
                    <Text style={styles.descriptionText}>{book.description}</Text>
                </View>
            )}
            
            <View style={styles.comments}>
        <Text style={styles.commentsTitle}>Отзывы</Text>
        
        
        {commentsLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
        ) : comments.length > 0 ? (
            <>
                <ScrollView 
                    style={styles.commentSlider} 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                >
                    {comments.map(comment => (
                        <View key={`${comment.id}-${comment.date}`} style={styles.comment}>
                            <View style={styles.commentHeader}>
                                <Text style={styles.commentatorName}>
                                    {comment.author || 'Аноним'}
                                </Text>
                                <Text style={styles.stars}>
                                    {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
                                </Text>
                            </View>
                            <Text style={styles.commentText}>{comment.text}</Text>
                            <Text style={styles.commentDate}>
                                {new Date(comment.date).toLocaleDateString('ru-RU')}
                            </Text>
                        </View>
                            ))}
                        </ScrollView>
                    </>
                ) : (
                    <Text style={styles.noCommentsText}>Пока нет отзывов</Text>
                )}
                
                <CommentButton 
                    text={'Оставить отзыв'} 
                    onPress={handleAddComment} 
                />
            </View>
            
            <View style={{ paddingTop: 100 }}>
                <Footer />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        position: 'relative'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    metaContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 35,
    },
    direction: {
        backgroundColor: '#e0f0ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 14,
        fontFamily: 'FiraSans',
    },
    rating: {
        backgroundColor: '#fff0e0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 14,
        fontFamily: 'FiraSans',
    },
    largeImage: {
        width: '100%',
        height: 300,
        marginTop: 15,
    },
    details: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontFamily: 'FiraSansSemiBold',
        marginBottom: 8,
        color: Colors.white,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        marginBottom: 10,
    },
    errorDetails: {
        fontSize: 14,
        color: '#666',
    },
    category: {
        fontSize: 16,
        color: Colors.links,
        marginBottom: 8,
        fontFamily: 'FiraSans',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: Colors.links,
        fontFamily: 'FiraSansSemiBold',
    },
    description: {
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 10,
    },
    descriptionTitle: {
        fontFamily: 'FiraSansSemiBold',
        color: Colors.white,
        fontSize: Fonts.f20,
        paddingBottom: 15,
    },
    descriptionText: {
        fontFamily: 'FiraSans',
        color: Colors.white,
        fontSize: Fonts.f14,
    },
    comments: {
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    commentsTitle: {
        fontFamily: 'FiraSansSemiBold',
        color: Colors.white,
        fontSize: Fonts.f20,
        paddingBottom: 15,
    },
    commentSlider: {
        marginBottom: 15,
    },
    comment: {
        backgroundColor: Colors.violetDark,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        maxWidth: 320,
        marginTop: 10,
        marginRight: 10,
    },
    commentHeader: {
        flexDirection:'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        width: '100%',
    },
    commentatorName: {
        fontFamily: 'FiraSansSemiBold',
        color: Colors.white,
        fontSize: Fonts.f14
    },
    stars: {
        color: Colors.premium,
    },
    commentText: {
        fontFamily: 'FiraSans',
        color: Colors.white,
        fontSize: Fonts.f12,
        paddingVertical: 10,
    },
    commentDate: {
        color: Colors.gray,
        fontSize: Fonts.f11,
        textAlign: 'right',
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buyButton: {
        width: '100%',
    },
    noCommentsText: {
        color: Colors.gray,
        textAlign:'center',
        marginTop: 15,
        marginBottom: 25,
    }
});

