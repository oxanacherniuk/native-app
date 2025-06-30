import { ActivityIndicator, Animated, GestureResponderEvent, ImageSourcePropType, Pressable, PressableProps, Image, StyleSheet } from 'react-native';
import { Colors } from '../tokens';
import React from 'react';

interface ButtonCategoryProps extends PressableProps {
    imageSource: ImageSourcePropType;
    isLoading?: boolean;
    isActive?: boolean;
}

export function ButtonCategory({
    imageSource,
    isLoading,
    isActive,
    onPress,
    ...props
}: ButtonCategoryProps) {
    const animatedValue = React.useRef(new Animated.Value(100)).current;
    const color = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [Colors.buttonCategoryHover, Colors.buttonCategory]
    })

    const fadeIn = (e:GestureResponderEvent) => {
        Animated.timing(animatedValue, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false
        }).start()
        props.onPressIn && props.onPressIn(e)
    }

    const fadeOut = (e:GestureResponderEvent) => {
        Animated.timing(animatedValue, {
            toValue: 100,
            duration: 100,
            useNativeDriver: false
        }).start()
        props.onPressOut && props.onPressOut(e)
    }

    return (
        <Pressable {...props} onPress={onPress} onPressIn={fadeIn} onPressOut={fadeOut}>
            <Animated.View style={{...styles.button, backgroundColor: color}}>
                {!isLoading ? (
                    <Image style={styles.image} source={imageSource} />
                ) : <ActivityIndicator size={'large'} />
                }
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 10,
        maxWidth: 51,
        maxHeight: 51,
        alignItems: 'center',
    },
    image: {
        maxWidth: 28,
        maxHeight: 28,
    }
})