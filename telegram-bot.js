require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'libracoder',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const UPLOADS_DIR = path.join(__dirname, 'uploads');

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

async function getDbConnection() {
    return await mysql.createPool(DB_CONFIG);
}

async function sendBookNotification(chatId, book) {
    const message = `📚 <b>Новая книга!</b>\n\n` +
        `<b>Название:</b> ${book.title}\n` +
        `<b>Категория:</b> ${book.category}\n` +
        `<b>Направление:</b> ${book.direction}\n` +
        `<b>Цена:</b> ${book.price} руб.\n\n` +
        `<i>${book.description || ''}</i>`;

    try {
        if (book.small_image) {
            const imagePath = path.join(UPLOADS_DIR, book.small_image);
            
            if (fs.existsSync(imagePath)) {
                const photoStream = fs.createReadStream(imagePath);
                await bot.sendPhoto(chatId, photoStream, {
                    caption: message,
                    parse_mode: 'HTML'
                });
            } else {
                console.log(`Файл изображения не найден: ${imagePath}`);
                await bot.sendMessage(chatId, message, {parse_mode: 'HTML'});
            }
        } else {
            await bot.sendMessage(chatId, message, {parse_mode: 'HTML'});
        }
    } catch (error) {
        console.error(`Ошибка отправки уведомления для ${chatId}:`, error);
        try {
            await bot.sendMessage(chatId, message, {parse_mode: 'HTML'});
        } catch (err) {
            console.error(`Не удалось отправить сообщение для ${chatId}:`, err);
        }
    }
}

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;
    
    try {
        const pool = await getDbConnection();
        await pool.query(
            `INSERT INTO telegram_subscribers 
            (chat_id, username, first_name, last_name, is_active) 
            VALUES (?, ?, ?, ?, TRUE)
            ON DUPLICATE KEY UPDATE 
            username = VALUES(username),
            first_name = VALUES(first_name),
            last_name = VALUES(last_name),
            is_active = TRUE`,
            [chatId, user.username, user.first_name, user.last_name]
        );
        
        await bot.sendMessage(
            chatId, 
            '🎉 Вы подписались на уведомления о новых книгах!\n\n' +
            'Я буду присылать вам информацию о новых поступлениях в магазин.'
        );
    } catch (error) {
        console.error('Ошибка при подписке:', error);
        await bot.sendMessage(chatId, 'Произошла ошибка при подписке. Пожалуйста, попробуйте позже.');
    }
});

bot.onText(/\/stop/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        const pool = await getDbConnection();
        await pool.query(
            'UPDATE telegram_subscribers SET is_active = FALSE WHERE chat_id = ?',
            [chatId]
        );
        
        await bot.sendMessage(chatId, 'Вы отписались от уведомлений. Чтобы снова подписаться, отправьте /start');
    } catch (error) {
        console.error('Ошибка при отписке:', error);
        await bot.sendMessage(chatId, 'Произошла ошибка при отписке. Пожалуйста, попробуйте позже.');
    }
});

async function checkNewBooks() {
    let pool;
    try {
        pool = await getDbConnection();
        
        const [state] = await pool.query('SELECT last_checked_book_id FROM telegram_bot_state WHERE id = 1');
        const lastCheckedId = state[0]?.last_checked_book_id || 0;
        
        const [newBooks] = await pool.query(
            `SELECT 
                id, 
                title, 
                price, 
                category, 
                direction,
                small_image,
                description
            FROM books 
            WHERE id > ? 
            ORDER BY id ASC`,
            [lastCheckedId]
        );
        
        if (newBooks.length > 0) {
            console.log(`Найдено новых книг: ${newBooks.length}`);
            
            const [subscribers] = await pool.query(
                'SELECT chat_id FROM telegram_subscribers WHERE is_active = TRUE'
            );
            
            console.log(`Активных подписчиков: ${subscribers.length}`);
            
            for (const book of newBooks) {
                for (const subscriber of subscribers) {
                    try {
                        await sendBookNotification(subscriber.chat_id, book);
                        console.log(`Уведомление отправлено для ${subscriber.chat_id}`);
                    } catch (error) {
                        console.error(`Ошибка отправки для ${subscriber.chat_id}:`, error.message);
                        
                        if (error.response && error.response.statusCode === 403) {
                            await pool.query(
                                'UPDATE telegram_subscribers SET is_active = FALSE WHERE chat_id = ?',
                                [subscriber.chat_id]
                            );
                            console.log(`Подписчик ${subscriber.chat_id} деактивирован`);
                        }
                    }
                }
            }
            
            const newLastId = newBooks[newBooks.length - 1].id;
            await pool.query(
                'UPDATE telegram_bot_state SET last_checked_book_id = ? WHERE id = 1',
                [newLastId]
            );
            
            console.log(`Обновлён last_checked_book_id: ${newLastId}`);
        }
    } catch (error) {
        console.error('Критическая ошибка в checkNewBooks:', error);
    } finally {
        if (pool) await pool.end();
    }
}

const CHECK_INTERVAL = 30 * 1000;
setInterval(checkNewBooks, CHECK_INTERVAL);

checkNewBooks().then(() => {
    console.log('Бот запущен и начал проверку новых книг');
}).catch(err => {
    console.error('Ошибка при стартовой проверке книг:', err);
});

console.log('Telegram бот запущен...');