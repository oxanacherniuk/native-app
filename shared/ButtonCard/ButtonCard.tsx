import { ActivityIndicator, Animated, GestureResponderEvent, Pressable, PressableProps, StyleSheet, Text } from 'react-native';
import { Colors, Fonts, Radius } from '../tokens';

export function ButtonCard({text, isLoading, ...props}: PressableProps & {text: string; isLoading?: boolean }) {
    const animatedValue = new Animated.Value(100)
    const color = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [Colors.primaryHover, Colors.primary]
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
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Radius.r10,
        height: 26,
    },
    text: {
        color: Colors.white,
        fontSize: 12,
        fontFamily: 'FiraSans',
    }
})