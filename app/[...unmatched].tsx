import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomLink } from '../shared/CustomLink/CustomLink';
import { Colors, Fonts, Gaps } from '../shared/tokens';

export default function UnmatchedCustom() {
    return <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <Image
                resizeMode='contain'
                style={styles.image}
                source={require('../assets/images/unmatched.png')}
            />
            <Text style={styles.text}>Ооо... что-то пошло не так. Попробуйте вернуться на главный экран приложения</Text>
            <CustomLink href={'/(auth)/login'} text='На главный экран' />
        </View>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    image: {
        width: 204,
        height: 282
    },
    text: {
        color: Colors.white,
        fontSize: Fonts.f18,
        textAlign: 'center',
        fontFamily: 'FiraSans'
    },
    container: {
        justifyContent: 'center',
        flex: 1,
        padding: 55
    },
    content: {
        alignItems: 'center',
        gap: Gaps.g50
    }
})