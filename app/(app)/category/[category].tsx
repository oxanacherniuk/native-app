import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, ScrollView, Pressable } from 'react-native';
import { useAtom } from 'jotai';
import { authAtom } from '../../../entities/auth/model/auth.state';
import { Book, ProductCard } from '../../../shared/ProductCard/ProductCard';
import { Colors, Fonts, Gaps } from '../../../shared/tokens';
import SearchIcon from '../../../assets/icons/search';
import { Footer } from '../../../shared/Footer/Footer';
import { API_URL } from '../../../src/constants/Config';
import { useLocalSearchParams } from 'expo-router';

export default function AllBooks() {
    const [authState] = useAtom(authAtom);
    const { category } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(`${API_URL}/api/books`);
                if (!response.ok) throw new Error('Ошибка загрузки книг');
                
                const data = await response.json();
                
                const processedBooks = data.map((book: Book) => ({
                    ...book,
                    small_image: book.small_image.startsWith('http') 
                        ? book.small_image 
                        : `${API_URL}/uploads/${book.small_image}`
                }));
                
                setAllBooks(processedBooks);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка:', error);
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const filteredBooks = useMemo(() => {
        let filtered = [...allBooks];
        
        if (category) {
            filtered = filtered.filter(book => 
                book.category.toLowerCase() === String(category).toLowerCase()
            );
        }
        
        if (searchQuery) {
            filtered = filtered.filter(book => 
                book.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        });

        return filtered;
    }, [allBooks, searchQuery, sortOrder, category]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <View style={styles.searchBox}>
                    <TextInput
                        placeholder='Искать'
                        placeholderTextColor={Colors.gray}
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery} />
                    <SearchIcon />
                </View>
            </View>

            <Text style={styles.categoryTitle}>Книги в категории: {category}</Text>
            
            <View style={styles.sortButtonsContainer}>
                <Pressable
                    onPress={() => setSortOrder('asc')}
                    style={({ pressed }) => [
                        styles.sortButton,
                        sortOrder === 'asc' && styles.activeSortButton,
                        pressed && styles.pressedButton
                    ]}
                >
                    <Text style={styles.sortButtonText}>По возрастанию цены</Text>
                </Pressable>
                
                <Pressable
                    onPress={() => setSortOrder('desc')}
                    style={({ pressed }) => [
                        styles.sortButton,
                        sortOrder === 'desc' && styles.activeSortButton,
                        pressed && styles.pressedButton
                    ]}
                >
                    <Text style={styles.sortButtonText}>По убыванию цены</Text>
                </Pressable>
            </View>

            <FlatList
                data={filteredBooks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ProductCard book={item} />
                )}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Книги не найдены</Text>
                }
                ListFooterComponent={
                    <View style={{ paddingTop: 100 }}>
                        <Footer />
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        paddingHorizontal: 10,
    },
    search: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    searchBox: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
        backgroundColor: Colors.violetDark,
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    searchInput: {
        paddingVertical: 15,
        color: Colors.gray,
        justifyContent: 'space-between',
        fontSize: Fonts.f14,
    },
    categoryTitle: {
        color: Colors.white,
        fontSize: Fonts.f18,
        fontFamily: 'FiraSansSemiBold',
        paddingHorizontal: 10,
        paddingBottom: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingTop: 10,
    },
    emptyText: {
        color: Colors.white,
        textAlign: 'center',
        marginTop: 20,
        fontSize: Fonts.f16,
    },
    sortButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingBottom: 10,
    },
    sortButton: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        fontFamily: 'FiraSans',
        padding: 5,
        fontSize: Fonts.f12,
        backgroundColor: Colors.violetDark,
    },
    activeSortButton: {
        backgroundColor: Colors.darkGrey,
    },
    pressedButton: {
        opacity: 0.2,
    },
    sortButtonText: {
        color: Colors.white,
        fontSize: Fonts.f14,
    },
});