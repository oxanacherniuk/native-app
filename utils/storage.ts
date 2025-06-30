import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserId = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('user_id');
    } catch (error) {
        console.error('Failed to get user ID:', error);
        return null;
    }
};

