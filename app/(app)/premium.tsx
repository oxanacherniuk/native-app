import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Fonts } from '../../shared/tokens';
import { useState } from 'react';
import ArrowStatic from '../../assets/icons/arrow-static';
import ArrowNew from '../../assets/icons/arrow-new';
import { Button } from '../../shared/Button/Button';
import { Footer } from '../../shared/Footer/Footer';
import { useRouter } from 'expo-router';


export default function Premium() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isExpandedSecond, setIsExpandedSecond] = useState(false);
    const [isExpandedThird, setIsExpandedThird] = useState(false);
    const router = useRouter();
    
    const subscriptionBuy = () => {
        router.push({
            pathname: '/(app)/subscription',
            params: { 
                presentation: 'modal'
            },
        });
    };
    
    return (
        <ScrollView>
            <View style={styles.container}>
                <Image style={styles.owl} source={require('../../assets/images/premium-owl.png')} />
                <Text style={{...styles.title, maxWidth: 243}}>Стань <Text style={{color: Colors.premium}}>Premium-пользователем</Text> и открой новые горизонты в мире программирования!</Text>
                <Text style={styles.text}>Добро пожаловать в мир безграничных возможностей! Стань Premium-пользователем нашего приложения LibraCoder и получи доступ к уникальным преимуществам, которые помогут вам развивать свои навыки программирования и достигать новых высот в карьере.</Text>
                <Text style={styles.title}>Почему стоит стать <Text style={{color: Colors.premium}}>Premium-пользователем</Text>?</Text>
                <View style={styles.list}>
                    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                        <Text style={styles.listText}>1. Эксклюзивный контент {isExpanded ? <ArrowNew /> : <ArrowStatic />}</Text>
                    </TouchableOpacity>
                    
                    {isExpanded && (
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.listText}>Премиум подписка открывает доступ к уникальным электронным книгам, которые не доступны обычным пользователям. Получите доступ к последним изданиям по самым актуальным темам в программировании, от современных языков до передовых технологий.</Text>
                        </View>
                    )}
                </View>
                <View style={styles.list}>
                    <TouchableOpacity onPress={() => setIsExpandedSecond(!isExpandedSecond)}>
                        <Text style={styles.listText}>2. Безлимитный доступ {isExpandedSecond ? <ArrowNew /> : <ArrowStatic />}</Text>
                    </TouchableOpacity>
                    
                    {isExpandedSecond && (
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.listText}>Скачивайте и читайте любое количество книг без ограничений! Премиум пользователи могут наслаждаться неограниченным доступом к нашей обширной библиотеке, что позволяет вам изучать новые темы в любое время и в любом месте.</Text>
                        </View>
                    )}
                </View>
                <View style={styles.list}>
                    <TouchableOpacity onPress={() => setIsExpandedThird(!isExpandedThird)}>
                        <Text style={styles.listText}>3. Обновления в реальном времени {isExpandedThird ? <ArrowNew /> : <ArrowStatic />}</Text>
                    </TouchableOpacity>
                    
                    {isExpandedThird && (
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.listText}>Будьте в курсе последних трендов и технологий! Как Премиум пользователь, вы получите уведомления о новых поступлениях в Telegram и обновлениях книг, чтобы всегда быть на шаг впереди.</Text>
                        </View>
                    )}
                </View>
                <View style={styles.telegramBlock}>
                    <Text style={styles.telegramText}>
                        Не упусти возможность стать частью нашего эксклюзивного клуба <Text style={{color: Colors.premium}}>Premium-пользователей!</Text> 
                    </Text>
                    <Image style={styles.telegramImage} source={require('../../assets/images/telegram.png')} />
                </View>
                <Button 
                    style={styles.subscription} 
                    text={'Оформить подписку'} 
                    onPress={subscriptionBuy}
                />
                <Text style={{...styles.title, marginTop: 20, paddingBottom: 90}}>Присоединяйтесь к нам и начните свое путешествие к успеху уже сегодня!</Text>
            </View>
            <Footer />
        
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        alignItems: 'center'
    },
    owl: {
        width: 100,
        height: 133,
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
        paddingBottom: 20,
        paddingHorizontal: 30,
    },
    list: {
        marginBottom: 5,
    },
    listText: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: Fonts.f14,
        fontFamily: 'FiraSans',
        paddingBottom: 5,
        paddingHorizontal: 30,
    },
    telegramBlock:{
        paddingVertical: 20,
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',

    },
    telegramText: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: Fonts.f12,
        fontFamily: 'FiraSansSemiBold',
        maxWidth: 280,
    },
    telegramImage: {
        width: 30,
        height: 30,
    },
    subscription: {
        width: 280,
    }
})