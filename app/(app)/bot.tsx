import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { Footer } from '../../shared/Footer/Footer';
import { Button } from '../../shared/Button/Button';
import { Colors, Fonts } from '../../shared/tokens';
import { CustomLink } from '../../shared/CustomLink/CustomLink';
import { useRouter } from 'expo-router';


export default function Bot() {
    const router = useRouter();

    const onMain = async () => {
        router.push({
            pathname: '/(app)/index'
        });
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Image style={styles.owl} source={require('../../assets/images/premium-owl.png')} />
                <Text style={styles.title}>Теперь ты - <Text style={{color: Colors.premium}}>Premium-пользователь! </Text></Text>
                <Text style={styles.text}>Переходи в раздел Библиотека и читай книги бесплатно! Также не забывай про нашего Telegram-бота Совенка Либру, который уже ждет общения с тобой!</Text>
                <Button 
                    style={styles.subscription} 
                    text={'Перейти в Библиотеку'} 
                    onPress={onMain}
                />
                <View style={styles.telegramBlock}>
                    <CustomLink href={'https://t.me/libracoder_bot'} text={'Перейти к Телеграм-боту'} />
                    <Image style={styles.telegramImage} source={require('../../assets/images/telegram.png')} />
                </View>
                <Text style={{...styles.title, marginTop: 20, paddingBottom: 50, maxWidth: 310, color: Colors.premium}}>Добро пожаловать в мир программирования с Совенком Либра!</Text>
            </View>
            <Footer />
        
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingBottom: 100,
        alignItems: 'center',
    },
    owl: {
        width: 128,
        height: 171,
        marginBottom: 15,
    },
    title: {
        color: Colors.white,
        fontSize: Fonts.f16,
        fontFamily: 'FiraSansSemiBold',
        textAlign: 'center',
        marginBottom: 10,
    },
    text: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: Fonts.f14,
        fontFamily: 'FiraSans',
        paddingHorizontal: 30,
        paddingBottom: 30,
    },
    telegramBlock:{
        paddingVertical: 10,
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    telegramImage: {
        width: 30,
        height: 30,
        marginLeft: 10,
    },
    subscription: {
        width: 280,
    }
})