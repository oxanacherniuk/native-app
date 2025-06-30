import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, RefreshControl, StyleSheet, Linking } from 'react-native';
import { Colors, Fonts } from '../../shared/tokens';
import { usePurchasedBooks } from '../../hooks/usePurchasedBooks';
import { ButtonCard } from '../../shared/ButtonCard/ButtonCard';
import { API_URL } from '../../src/constants/Config';

export default function MyBooks() {
    const { purchasedBooks } = usePurchasedBooks();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
        } finally {
            setRefreshing(false);
        }
    }, []);

    const handleReadBook = (file) => {
        if (!file) {
            console.error('Файл книги не найден');
            return;
        }

        const pdfUrl = file.startsWith('http') 
            ? file 
            : `http://192.168.0.200:3001/uploads/books/${file}`;
        
        Linking.openURL(pdfUrl).catch(err => {
            console.error('Не удалось открыть PDF:', err);
        });
    };

    return (
        <View style={styles.container}>
            {purchasedBooks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>У вас пока нет купленных книг</Text>
                </View>
            ) : (
                <FlatList
                    data={purchasedBooks}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.book}>
                            <Image 
                                source={{ uri: item.large_image.startsWith('http') 
                                    ? item.large_image 
                                    : `${API_URL}/uploads/${item.large_image}` }} 
                                style={styles.img}
                            />
                            <View style={styles.bookInfo}>
                                <Text style={styles.titleBook} numberOfLines={2}>{item.title}</Text>
                                <View style={styles.direction}>
                                    <Text style={styles.directionText}>{item.direction}</Text>
                                </View>
                                <ButtonCard onPress={() => handleReadBook(item.file)} text={'Читать'} />
                            </View>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        alignItems: 'center'
    },
    book: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: '#1E1F24',
        borderRadius: 10,
    },
    img: {
        width: 150,
        height: 182,
        borderRadius: 5,
    },
    bookInfo: {
        marginLeft: 10,
    },
    titleBook: {
        color: Colors.white,
        fontFamily: 'FiraSansSemiBold',
        paddingLeft: 10,
        paddingBottom: 8,
        maxWidth: 160,
    },
    direction: {
        borderRadius: 17,
        marginLeft: 10,
        borderBlockColor: '#4D5064',
        borderLeftColor: '#4D5064',
        borderRightColor: '#4D5064',
        borderWidth: 1,
        fontFamily: 'FiraSans',
        maxWidth: 58,
        marginBottom: 91,
    },
    directionText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: Colors.white,
        fontSize: 8,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    listContent: {
        paddingBottom: 20,
    },
})