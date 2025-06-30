import { Colors, Fonts } from '../tokens';
import { Link,  } from 'expo-router';
import { LinkProps } from 'expo-router/build/link/Link';
import { Text, StyleSheet } from 'react-native';

export function CustomLink({ text, ...props}: LinkProps & { text: string }) {

    return (
        <Link style={styles.link} {...props}>
            <Text>{text}</Text>
        </Link>
    );
}


const styles = StyleSheet.create({
    link: {
        fontSize: Fonts.f14,
        color: Colors.links,
        fontFamily: 'FiraSans',
    },
});