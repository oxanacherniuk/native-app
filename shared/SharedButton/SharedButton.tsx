import { Pressable, PressableProps, StyleSheet, Text, GestureResponderEvent, Animated, ActivityIndicator } from 'react-native'
import { Colors, Fonts, Radius } from '../tokens';
import SharedIcon from '../../assets/icons/shared';

export function SharedButton({text, isLoading, ...props}: PressableProps & {text: string; isLoading?: boolean }) {
    const animatedValue = new Animated.Value(100)
    const color = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [Colors.darkGreyHover, Colors.darkGrey]
    })
    
    const fadeIn = (e:GestureResponderEvent) => {
        Animated.timing(animatedValue, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false
        }).start()
        props.onPressIn && props.onPressIn(e);
    }
    
    const fadeOut = (e:GestureResponderEvent) => {
        Animated.timing(animatedValue, {
            toValue: 100,
            duration: 100,
            useNativeDriver: false
        }).start()
        props.onPressOut && props.onPressOut(e);
    }

    return (
        <Pressable {...props} onPressIn={fadeIn} onPressOut={fadeOut}>
            <Animated.View style={{...styles.button, backgroundColor: color}}>
                {!isLoading ? (
                <Text style={styles.text}>{text || 'Default Text'}</Text>
                ) : (
                <ActivityIndicator size="large" color={Colors.white} />
                )}
                <SharedIcon />
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Radius.r10,
        height: 58,
        flexDirection: 'row'
    },
    text: {
        color: Colors.white,
        fontSize: Fonts.f16,
        fontFamily: 'FiraSans',
        marginRight: 6,
    }
})