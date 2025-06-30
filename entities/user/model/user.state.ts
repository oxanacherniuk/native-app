import { atom } from 'jotai';
import { authAtom } from '../../auth/model/auth.state';
import { API_URL } from '../../../src/constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atomWithStorage } from 'jotai/utils';

export interface UserProfile {
    id: number;
    email: string;
    photo?: string;
    name?: string;
}

interface ProfileState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
}

export const profileAtom = atomWithStorage<ProfileState>(
    'profile',
    {
        profile: null,
        isLoading: false,
        error: null,
    },
    {
        getItem: async (key) => {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : { profile: null, isLoading: false, error: null };
        },
        setItem: async (key, value) => {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
            await AsyncStorage.removeItem(key);
        },
    }
);

const baseProfileUpdater = async (
    get: any,
    set: any,
    options: {
        method?: 'GET' | 'PATCH';
        body?: any;
    } = {}
) => {
    try {
    set(profileAtom, {
        ...get(profileAtom),
        isLoading: true,
        error: null,
    });

    const { access_token } = get(authAtom);

    if (!access_token) {
        throw new Error('Необходима авторизация');
    }

    const response = await fetch(`${API_URL}/api/profile`, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка запроса профиля');
    }

    const data = await response.json();

    set(profileAtom, {
        profile: data,
        isLoading: false,
        error: null,
    });

    return data;
    } catch (error: any) {
    set(profileAtom, {
        ...get(profileAtom),
        isLoading: false,
        error: error.message || 'Неизвестная ошибка',
    });
        throw error;
    }
};

export const loadProfileAtom = atom(
    (get) => get(profileAtom),
    (get, set) => baseProfileUpdater(get, set)
);

export const updateProfileAtom = atom(
    (get) => get(profileAtom),
    async (get, set, updateData: { photo?: string; name?: string }) => {
        const formData = new FormData();
        
        if (updateData.photo) {
            formData.append('photo', {
                uri: updateData.photo,
                type: 'image/png',
                name: 'photo.png',
            });
        }
        
        if (updateData.name) {
            formData.append('name', updateData.name);
        }
        
        return baseProfileUpdater(get, set, {
            method: 'PATCH',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
);