require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const API_URL = process.env.API_URL;
const app = express();
const PORT = process.env.PORT || 3001 || 8081;

app.listen(5000, 'localhost', () => {
  console.log('Server is running on http://localhost:5000');
});

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'libracoder',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('DB_HOST:', process.env.DB_HOST);

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/api/ping', (req, res) => {
    console.log('Ping received');
    res.json({ success: true, message: 'Server is alive', timestamp: Date.now() });
});

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        
        res.status(201).json({ message: 'Пользователь зарегистрирован' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/api/login', async (req, res) => {
    console.log('Получен запрос на вход');
    
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            console.log('Отсутствует email или пароль');
            return res.status(400).json({ 
                success: false,
                error: 'Требуется email и пароль' 
            });
        }

        const connection = await pool.getConnection();
        console.log('Подключение к MySQL установлено');

        try {
            const [users] = await connection.query(
                'SELECT id, email, password FROM users WHERE email = ?', 
                [req.body.email]
            );

            if (users.length === 0) {
                console.log('Пользователь не найден');
                return res.status(401).json({
                    success: false,
                    error: 'Неверный email или пароль'
                });
            }

            const user = users[0];
            console.log(`Найден пользователь: ${user.email}`);

            console.log('Сравнение паролей...');
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            
            if (!isMatch) {
                console.log('Пароль не совпадает');
                return res.status(401).json({
                    success: false,
                    error: 'Неверный email или пароль'
                });
            }

            if (!process.env.ACCESS_TOKEN_SECRET) {
                throw new Error('ACCESS_TOKEN_SECRET не настроен');
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            console.log('Успешный вход, отправка токена');
            return res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email
                }
            });

        } finally {
            connection.release();
            console.log('Подключение к MySQL закрыто');
        }

    } catch (error) {
        console.error('Серверная ошибка:', error);
        return res.status(500).json({
            success: false,
            error: 'Внутренняя ошибка сервера',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

pool.getConnection()
    .then(async (connection) => {
        console.log('Успешное подключение к MySQL!');
        
        const [tables] = await connection.query("SHOW TABLES LIKE 'books'");
        if (tables.length === 0) {
            console.error('Таблица books не существует!');
        } else {
            console.log('Таблица books существует');
            
            const [books] = await connection.query('SELECT COUNT(*) as count FROM books');
            console.log(`В таблице books ${books[0].count} записей`);
        }
        
        connection.release();
    })
    .catch(err => {
        console.error('Ошибка подключения к MySQL:', err);
    });

app.get('/api/books', async (req, res) => {
        try {
            const connection = await pool.getConnection();
            
            try {
                const [books] = await connection.query(
                    `SELECT 
                        id, 
                        small_image, 
                        large_image, 
                        title, 
                        price, 
                        category, 
                        direction,
                        description, 
                        rating,
                        file 
                    FROM books`
                );
                
                console.log(`Total books in database: ${books.length}`);
                
                const processedBooks = books.map(book => ({
                    ...book,
                    small_image: book.small_image 
                        ? book.small_image.startsWith('http') 
                            ? book.small_image 
                            : `${API_URL}/uploads/${book.small_image}`
                        : null,
                    large_image: book.large_image 
                        ? book.large_image.startsWith('http') 
                            ? book.large_image 
                            : `${API_URL}/uploads/${book.large_image}`
                        : null
                }));
                
                res.json(processedBooks);
                
            } finally {
                connection.release();
            }
        } catch (err) {
            console.error('Database error:', err);
            res.status(500).json({ 
                error: 'Database error',
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
});

app.get('/api/books/:id', async (req, res) => {
    console.log(`GET /api/books/${req.params.id}`, req.params);
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            console.error('Invalid book ID:', id);
            return res.status(400).json({
                success: false,
                error: 'Неверный ID книги'
            });
        }

        const connection = await pool.getConnection();
        try {
            const [books] = await connection.query(
                `SELECT * FROM books WHERE id = ?`,
                [id]
            );
            
            if (books.length === 0) {
                console.error('Book not found with ID:', id);
                return res.status(404).json({ 
                    success: false,
                    error: 'Книга не найдена' 
                });
            }
            
            const book = books[0];
            console.log('Book found:', book);
            
            res.json({
                success: true,
                book: {
                    ...book,
                    small_image: book.small_image 
                        ? `${API_URL}/uploads/${book.small_image}`
                        : null,
                    large_image: book.large_image 
                        ? `${API_URL}/uploads/${book.large_image}`
                        : null
                }
            });
            
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Внутренняя ошибка сервера'
        });
    }
});

app.get('/api/mybooks', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        try {
            const [books] = await connection.query(`
                SELECT b.* FROM books b
                JOIN purchased_books pb ON b.id = pb.book_id
                WHERE pb.user_id = ?
                ORDER BY pb.purchase_date DESC
            `, [req.user.id]);
            
            const processedBooks = books.map(book => ({
                ...book,
                small_image: book.small_image 
                    ? book.small_image.startsWith('http') 
                        ? book.small_image 
                        : `${API_URL}/uploads/${book.small_image}`
                    : null,
                large_image: book.large_image 
                    ? book.large_image.startsWith('http') 
                        ? book.large_image 
                        : `${API_URL}/uploads/${book.large_image}`
                    : null
            }));
            
            res.json({ success: true, books: processedBooks });
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.post('/api/purchase', authenticateToken, async (req, res) => {
    const { book_id } = req.body;
    
    try {
        const connection = await pool.getConnection();
        
        try {
            const [exists] = await connection.query(
                'SELECT 1 FROM purchased_books WHERE user_id = ? AND book_id = ?',
                [req.user.id, book_id]
            );
            
            if (exists.length > 0) {
                return res.json({ success: true, message: 'Book already purchased' });
            }
            
            await connection.query(
                'INSERT INTO purchased_books (user_id, book_id) VALUES (?, ?)',
                [req.user.id, book_id]
            );
            
            res.json({ success: true });
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Purchase failed' });
    }
});

app.get('/api/books/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Неверный ID книги'
            });
        }

        const connection = await pool.getConnection();
        try {
            const [comments] = await connection.query(
                `SELECT 
                    id,
                    book_id as bookId,
                    author,
                    text,
                    rating,
                    date,
                    created_at as createdAt
                FROM comments 
                WHERE book_id = ? 
                ORDER BY created_at DESC`,
                [id]
            );
            
            res.json({
                success: true,
                comments: comments.map(comment => ({
                    ...comment,
                    date: comment.date.toISOString(),
                    createdAt: comment.createdAt.toISOString()
                }))
            });
            
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Ошибка при получении комментариев:', error);
        res.status(500).json({ 
            success: false,
            error: 'Внутренняя ошибка сервера',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

app.post('/api/books/:id/comments', async (req, res) => {
    console.log('Начало обработки комментария');
    
    try {
        const { id } = req.params;
        const { author = 'Читатель', text, rating } = req.body;

    if (!id || isNaN(Number(id))) {
        console.error('Неверный ID книги:', id);
        return res.status(400).json({ 
            success: false, 
            error: 'Неверный ID книги' 
        });
    }

    if (!text || !rating || rating < 1 || rating > 5) {
        console.error('Неверные данные комментария:', { text, rating });
        return res.status(400).json({ 
            success: false, 
            error: 'Текст и оценка (1-5) обязательны' 
        });
    }

        const connection = await pool.getConnection();
        console.log('Получено подключение к БД');

    try {
        const [books] = await connection.query(
            'SELECT id FROM books WHERE id = ?', 
            [id]
        );
        
        if (books.length === 0) {
            console.error('Книга не найдена:', id);
            return res.status(404).json({ 
                success: false, 
                error: 'Книга не найдена' 
            });
        }
        const commentId = uuidv4();
        const now = new Date();
        
        console.log('Добавление комментария в БД:', {
            id: commentId,
            book_id: id,
            author,
            text,
            rating
        });

        await connection.query(
            `INSERT INTO comments 
            (id, book_id, author, text, rating, date, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [commentId, id, author, text, rating, now, now]
        );

        console.log('Комментарий успешно добавлен');
        
        return res.status(201).json({
            success: true,
            comment: {
                id: commentId,
                bookId: id,
                author,
                text,
                rating,
                date: now.toISOString(),
                createdAt: now.toISOString()
            }
        });
    
        } catch (error) {
            return;
        } finally {
            connection.release();
            console.log('Подключение к БД освобождено');
        }
    } catch (error) {
        console.error('Неожиданная ошибка:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Внутренняя ошибка сервера' 
        });
    }
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

console.log('JWT Secret:', process.env.ACCESS_TOKEN_SECRET || 'Not found!');

app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, email, name, photo FROM users WHERE id = ?',
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        const user = users[0];
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            photo: user.photo 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/api/restore-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        if (!email || !newPassword) {
            return res.status(400).json({ error: "Email и пароль обязательны" });
        }

        const [user] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
        if (!user.length) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

        res.json({ success: true, message: "Пароль обновлен!" });
    } catch (err) {
        console.error("Ошибка восстановления пароля:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.patch('/api/profile', authenticateToken, upload.single('photo'), async (req, res) => {
    try {
        const { name } = req.body;
        let photoUrl = null;
        
        if (req.file) {
            photoUrl = `${API_URL}/uploads/${req.file.filename}`;
        }
        
        const updateData = {};
        if (name) updateData.name = name;
        if (photoUrl) updateData.photo = photoUrl;
        
        if (Object.keys(updateData).length > 0) {
            await pool.query(
                'UPDATE users SET ? WHERE id = ?',
                [updateData, req.user.id]
            );
        }
        
        const [users] = await pool.query(
            'SELECT id, email, name, photo FROM users WHERE id = ?',
            [req.user.id]
        );
        
        res.json({
            success: true,
            user: users[0]
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            error: 'Ошибка сервера' 
        });
    }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3001, '192.168.0.200', () => {
    console.log(`Сервер запущен на ${API_URL}`);
});
API_URL2 = "192.168.0.200"
app.listen(PORT, API_URL2, () => {
    console.log(`Сервер запущен на http://${API_URL2}:${PORT}`);
});
