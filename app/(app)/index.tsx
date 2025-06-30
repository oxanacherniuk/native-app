import { useAtom } from 'jotai';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, TextInput, Button, Image, ScrollView } from 'react-native';
import { authAtom } from '../../entities/auth/model/auth.state';
import { Colors, Fonts } from '../../shared/tokens';
import { Book, ProductCard } from '../../shared/ProductCard/ProductCard';
import { CustomLink } from '../../shared/CustomLink/CustomLink';
import { useEffect, useMemo, useState } from 'react';
import { Footer } from '../../shared/Footer/Footer';
import SearchIcon from '../../assets/icons/search';
import { ButtonCategory } from '../../shared/ButtonCategory/ButtonCategory';
import { API_URL } from '../../src/constants/Config';

const CATEGORIES = [
    { category: 'Python' },
    { category: 'JavaScript' },
    { category: 'JQuery' },
    { category: 'React' },
    { category: 'Vue' },
    { category: 'HTML, CSS' },
    { category: 'Node' },
    { category: 'PHP' },
];

export default function Index() {
    const [authState] = useAtom(authAtom);
    const [booksByCategory, setBooksByCategory] = useState<Record<string, Book[]>>({});
    const [loading, setLoading] = useState(true);
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(`http://192.168.0.200:3001/api/books`);
                if (!response.ok) throw new Error('Ошибка загрузки книг');
                
                const data = await response.json();
                
                const processedBooks = data.map((book: Book) => ({
                    ...book,
                    small_image: book.small_image.startsWith('http') 
                        ? book.small_image 
                        : `http://192.168.0.200:3001/uploads/${book.small_image}`
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

    const filteredBooksByCategory = useMemo(() => {
        let filteredBooks = allBooks.filter(book => 
            CATEGORIES.some(c => c.category === book.category)
        );
        if (searchQuery) {
            filteredBooks = filteredBooks.filter(book => 
                book.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedCategory) {
            filteredBooks = filteredBooks.filter(book => 
                book.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }
        return filteredBooks.reduce((acc: Record<string, Book[]>, book) => {
            if (!acc[book.category]) acc[book.category] = [];
            acc[book.category].push(book);
            return acc;
        }, {});
    }, [allBooks, searchQuery, selectedCategory]);

    const handleCategoryPress = (categoryName: string) => {
        setSelectedCategory(prev => prev === categoryName ? null : categoryName);
    };

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
            
            <FlatList
                data={CATEGORIES}
                keyExtractor={(item) => item.category}
                ListHeaderComponent={
                    <View style={styles.categoryButtons}>
                        <Text style={styles.titleCategory}>Все категории</Text>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.buttons}
                        >
                            <ButtonCategory
                                onPress={() => handleCategoryPress('React')}
                                isActive={selectedCategory === 'React'} 
                                imageSource={require('../../assets/images/react.png')} />
                            <ButtonCategory
                                onPress={() => handleCategoryPress('HTML, CSS')}
                                isActive={selectedCategory === 'HTML, CSS'} 
                                imageSource={require('../../assets/images/css.png')} />
                            <ButtonCategory 
                                onPress={() => handleCategoryPress('Vue')}
                                isActive={selectedCategory === 'Vue'}
                                imageSource={require('../../assets/images/vue.png')} />
                            <ButtonCategory 
                                onPress={() => handleCategoryPress('JavaScript')}
                                isActive={selectedCategory === 'JavaScript'}
                                imageSource={require('../../assets/images/js.png')} />
                            <ButtonCategory 
                                onPress={() => handleCategoryPress('Python')}
                                isActive={selectedCategory === 'Python'}
                                imageSource={require('../../assets/images/python.png')} />
                            <ButtonCategory 
                                onPress={() => handleCategoryPress('PHP')}
                                isActive={selectedCategory === 'PHP'}
                                imageSource={require('../../assets/images/php.png')} />
                            <ButtonCategory 
                                onPress={() => handleCategoryPress('JQuery')}
                                isActive={selectedCategory === 'JQuery'}
                                imageSource={require('../../assets/images/jquery.png')} />
                            <ButtonCategory 
                                onPress={() => handleCategoryPress('Node')}
                                isActive={selectedCategory === 'Node'}
                                imageSource={require('../../assets/images/nodejs.png')} />
                        </ScrollView>
                    </View>
                }
                renderItem={({ item }) => {
                    const categoryBooks = filteredBooksByCategory[item.category] || [];
                    if ((searchQuery || selectedCategory) && categoryBooks.length === 0) return null;
                    
                    return (
                        <View style={styles.cardCategory}>
                            <View style={styles.topBoxCategory}>
                                <Text style={styles.titleCategory}>{item.category}</Text>
                                <CustomLink 
                                    href={{
                                        pathname: "/(app)/category/[category]",
                                        params: { category: item.category }
                                    }}
                                    text={'Все книги'} 
                                />
                            </View>
                            {categoryBooks.length > 0 ? (
                                <FlatList
                                    horizontal
                                    data={categoryBooks}
                                    keyExtractor={(book) => book.id.toString()}
                                    renderItem={({ item: book }) => (
                                        <ProductCard book={book} />
                                    )}
                                    contentContainerStyle={styles.booksContainer}
                                    showsHorizontalScrollIndicator={false}
                                />
                            ) : (
                                <Text>Нет книг в этой категории</Text>
                            )}
                        </View>
                    );
                }}
                ListFooterComponent={
                    <View style={{ paddingTop: 100 }}>
                        <Footer />
                    </View>
                }
                contentContainerStyle={[styles.listContainer, { flexGrow: 1 }]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    cardCategory: {},
    container: {
        flex: 1,
        position: 'relative'
    },
    search: {
        paddingVertical: 20,
        paddingHorizontal: 25,
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
    categoryButtons: {
        paddingLeft: 20,
        paddingBottom: 10,
    },
    buttons: {
        gap: 10,
        marginTop: 15,
    },
    topBoxCategory: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 25,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleCategory: {
        color: Colors.white,
        fontSize: Fonts.f20,
        fontFamily: 'FiraSansSemiBold',
    },
    text: {
        color: Colors.white, 
    },
    booksContainer: {
        paddingHorizontal: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingTop: 16,
    },
});