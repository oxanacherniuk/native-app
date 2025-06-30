import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { API_URL } from '../../../src/constants/Config';
import { UserProfile } from '../../user/model/user.state'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    access_token: string | null;
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
}

export const authAtom = atomWithStorage<AuthState>(
    'auth',
    {
        access_token: null,
        user: null,
        isLoading: true,  
        error: null,
    },
    {
        getItem: async (key) => {
            try {
                const value = await AsyncStorage.getItem(key);
                return value ? { 
                    ...JSON.parse(value), 
                    isLoading: false  
                } : { 
                    access_token: null,
                    user: null,
                    isLoading: false,
                    error: null
                };
            } catch (e) {
                console.error('Ошибка чтения auth:', e);
                return {
                    access_token: null,
                    user: null,
                    isLoading: false,
                    error: 'Ошибка чтения данных'
                };
            }
        },
        setItem: async (key, value) => {
            try {
                await AsyncStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Ошибка сохранения auth:', e);
            }
        },
        removeItem: async (key) => {
            try {
                await AsyncStorage.removeItem(key);
            } catch (e) {
                console.error('Ошибка удаления auth:', e);
            }
        },
    }
);

export const loginAtom = atom(
    (get) => get(authAtom),
    async (get, set, { email, password }) => {
        try {
            console.log('[КЛИЕНТ] Отправка запроса на вход');
            set(authAtom, { 
                ...get(authAtom) || {},  
                isLoading: true, 
                error: null 
            });
            
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Ошибка входа');
            }

            const newState = {
                access_token: data.token,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.name || '',
                    photo: data.user.photo || null
                },
                isLoading: false,  
                error: null
            };
            
            set(authAtom, newState);
            console.log('[КЛИЕНТ] Успешный вход');
            return data;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
            set(authAtom, {
                ...get(authAtom) || {},
                isLoading: false,
                error: errorMessage
            });
            throw error;
        }
    }
);

export const logoutAtom = atom(null, async (_get, set) => {
    try {
        await AsyncStorage.multiRemove(['auth', 'user_token', 'current_user_id']);
        set(authAtom, {
            access_token: null,
            user: null,
            isLoading: false,  
            error: null
        });
    } catch (e) {
        console.error('Ошибка при выходе:', e);
        set(authAtom, {
            access_token: null,
            user: null,
            isLoading: false,
            error: 'Ошибка при выходе'
        });
    }
});

export const currentUserAtom = atom<UserProfile | null>(null);