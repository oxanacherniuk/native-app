import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { Colors, Fonts, Gaps } from '../../shared/tokens';
import { Footer } from '../../shared/Footer/Footer';

export default function AboutAs() {
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image style={styles.icon} source={require('../../assets/icon.png')} />
                    <Text style={styles.title}>Добро пожаловать в LibraCoder!</Text>
                </View>
                <Text style={styles.text}> — ваше идеальное приложение для чтения электронных книг, созданное специально для программистов и IT-специалистов! Мы понимаем, как важно быть в курсе последних технологий и трендов в мире программирования, поэтому мы разработали платформу, которая объединяет знания, вдохновение и удобство.</Text>
                <Text style={styles.title}>Что мы предлагаем</Text>
                <View style={styles.offersBox}>
                    <View style={styles.offer}>
                        <Image style={styles.offerImage} source={require('../../assets/images/aboutus1.png')} />
                        <Text style={styles.miniText}>Широкий ассортимент</Text>
                    </View>
                    <View style={styles.offer}>
                        <Image style={styles.offerImage} source={require('../../assets/images/aboutus2.png')} />
                        <Text style={styles.miniText}>Удобный интерфейс</Text>
                    </View>
                    <View style={styles.offer}>
                        <Image style={styles.offerImage} source={require('../../assets/images/aboutus3.png')} />
                        <Text style={styles.miniText}>Интерактив функций</Text>
                    </View>
                    <View style={styles.offer}>
                        <Image style={styles.offerImage} source={require('../../assets/images/aboutus4.png')} />
                        <Text style={styles.miniText}>Офлайн - доступ</Text>
                    </View>
                </View>
                <Text style={styles.title}>Наша миссия</Text>
                <Text style={styles.text}> — это сделать обучение программированию доступным и увлекательным. Мы стремимся предоставить вам качественные ресурсы, которые помогут развивать ваши навыки, углублять знания и находить новые идеи для проектов. LibraCoder предлагает широкий выбор книг по различным языкам программирования, фреймворкам, методологиям разработки и другому.</Text>
                <Image style={styles.owl} source={require('../../assets/images/owl.png')} />
            </View>
            <View style={{ paddingTop: 45 }}>
                    <Footer />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        backgroundColor: Colors.black,
        padding: 30
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:  'center'
    },
    icon: {
        width: 55,
        height: 60,
    },
    title: {
        color: Colors.white,
        fontSize: Fonts.f16,
        fontFamily: 'FiraSansSemiBold',
        marginLeft: 20,
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: Fonts.f14,
        fontFamily: 'FiraSans',
        paddingTop: 10,
        paddingBottom: 20,
    },
    offersBox: {
        paddingTop: 15,
        paddingBottom: 20,
        flexDirection: 'row',
        gap: Gaps.g16,
        justifyContent: 'center',
    },
    offer: {},
    offerImage: {
        width: 65,
        height: 65,
    },
    miniText: {
        fontSize: Fonts.f10,
        color: Colors.white,
        textAlign: 'center',
        maxWidth: 65,
        marginTop: 10,
    },
    owl: {
        width: 314,
        height: 178,
        alignSelf: 'center'
    }
})