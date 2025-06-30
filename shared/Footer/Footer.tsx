import { View, StyleSheet, Text } from 'react-native'
import { Colors, Fonts } from '../tokens'

export function Footer() {
    return (
        <View style={styles.footer}>
            <View style={styles.box}>
                <Text style={styles.defaultText}>© "LibraCoder", 2025</Text>
                <Text style={styles.defaultText}>Все права защищены</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    footer: {
        width: '100%',
        backgroundColor: Colors.blackLight,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        marginBottom: 0,
    },
    box: {
        paddingHorizontal: 15,
        paddingVertical: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    defaultText: {
        fontSize: Fonts.f11,
        color: Colors.white,
        fontFamily: 'FiraSans',
    },
    link: {
        fontSize: Fonts.f11,
        color: Colors.white,
        fontFamily: 'FiraSans',
    },
})