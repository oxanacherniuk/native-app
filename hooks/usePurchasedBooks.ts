import { useState, useEffect, useCallback } from 'react';
import { Book } from '../shared/ProductCard/ProductCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/constants/Config';
import { useAtom } from 'jotai';
import { authAtom } from '../entities/auth/model/auth.state';

export function usePurchasedBooks() {
    const [auth] = useAtom(authAtom);
    const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPurchasedBooks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!auth.access_token) {
                throw new Error('Требуется авторизация');
            }

            const response = await fetch(`${API_URL}/api/mybooks`, {
                headers: {
                    'Authorization': `Bearer ${auth.access_token}`
                }
            });

            if (response.status === 401) {
                throw new Error('Сессия истекла');
            }

            if (!response.ok) {
                throw new Error(`Ошибка загрузки книг: ${response.status}`);
            }

            const data = await response.json();
            setPurchasedBooks(data.books || []);
            return data.books || [];
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
            return [];
        } finally {
            setLoading(false);
        }
    }, [auth.access_token]);

    const addPurchasedBook = async (book: Book) => {
        try {
            if (!auth.access_token) {
                throw new Error('Требуется авторизация');
            }

            if (purchasedBooks.some(b => b.id === book.id)) {
                return true;
            }

            const response = await fetch(`${API_URL}/api/purchase`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.access_token}`
                },
                body: JSON.stringify({ book_id: book.id })
            });

            if (!response.ok) {
                throw new Error(`Ошибка покупки: ${response.status}`);
            }

            setPurchasedBooks(prev => [...prev, book]);
            
            await fetchPurchasedBooks();
            
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
            return false;
        }
    };

    useEffect(() => {
        fetchPurchasedBooks();
    }, [fetchPurchasedBooks]);

    return { 
        purchasedBooks, 
        loading, 
        error,
        addPurchasedBook, 
        refreshPurchasedBooks: fetchPurchasedBooks 
    };
}