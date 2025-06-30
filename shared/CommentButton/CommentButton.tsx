import { Pressable, PressableProps, StyleSheet, Text, GestureResponderEvent, Animated, ActivityIndicator } from 'react-native'
import { Colors, Fonts, Radius } from '../tokens';
import PlusIcon from '../../assets/icons/plus';

export function CommentButton({text, isLoading, onPress, ...props}: PressableProps & {text: string; isLoading?: boolean; onPress: () => void; }) {
    const animatedValue = new Animated.Value(100)
    const color = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [Colors.darkGreyHover, Colors.violetDark]
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
        <Pressable {...props} onPress={onPress} onPressIn={fadeIn} onPressOut={fadeOut}>
            <Animated.View style={{...styles.button, backgroundColor: color}}>
                <PlusIcon />
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
        alignSelf: 'center',
        borderRadius: Radius.r10,
        height: 50,
        flexDirection: 'row',
        width: 250,
    },
    text: {
        color: Colors.white,
        fontSize: Fonts.f16,
        fontFamily: 'FiraSans',
        marginLeft: 8,
    }
})