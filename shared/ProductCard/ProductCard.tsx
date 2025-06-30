import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { Colors, Radius } from '../tokens';
import { ButtonCard } from '../ButtonCard/ButtonCard';
import { useRouter } from 'expo-router';

export type Book = {
    file(file: any): void;
    id: number;
    small_image: string;
    large_image: string;
    title: string;
    price: number;
    category: string;
    direction: string;
    rating?: number;
};

export function ProductCard({ book }: { book: Book }) {
    const router = useRouter();
    
    const handlePress = () => {
        router.push(`/(app)/(book)/details?id=${book.id}`);
    };
    
    const imageUrl = book.small_image;

    return (
        <TouchableOpacity 
            onPress={handlePress} 
            style={styles.card}
            activeOpacity={0.7}
        >
            <Image 
                style={styles.image} 
                source={{ 
                    uri: imageUrl,
                    cache: 'force-cache'
                }} 
                resizeMode="contain"
                onError={(e) => console.log('Ошибка загрузки изображения:', e.nativeEvent.error)}
            />
            
            <View style={styles.middleBlock}>
                <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
                <View style={styles.direction}>
                    <Text style={styles.directionText}>{book.direction}</Text>
                </View>
                <Text style={styles.price}>{book.price} ₽</Text>
            </View>
            
            <View style={styles.bottomBlock}>
                <ButtonCard text={'Купить'} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 10,
        paddingVertical: 25,
    },
    image: {
        width: 150,
        height: 117,
    },
    middleBlock: {
        paddingTop: 20,
        backgroundColor: Colors.blackLight,
        width: 150,
    },
    title: {
        color: Colors.white,
        fontFamily: 'FiraSansSemiBold',
        paddingLeft: 10,
        paddingBottom: 8,
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
    },
    directionText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: Colors.white,
        fontSize: 8,
    },
    price: {
        color: Colors.links,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    bottomBlock: {
        backgroundColor: Colors.violetDark,
        width: 150,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderEndEndRadius: 17,
        borderBottomLeftRadius: 17,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Radius.r10,
        height: 22,
        fontSize: 10,
    },
})