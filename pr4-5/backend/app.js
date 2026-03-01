const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Настройка CORS
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

// Начальные данные (10 книг)
let books = [
  { id: nanoid(6), name: 'Мастер и Маргарита', category: 'Классика', description: 'Великий роман Михаила Булгакова', price: 450, stock: 15 },
  { id: nanoid(6), name: '1984', category: 'Антиутопия', description: 'Роман-предупреждение Джорджа Оруэлла', price: 550, stock: 20 },
  { id: nanoid(6), name: 'Преступление и наказание', category: 'Классика', description: 'Роман Ф.М. Достоевского', price: 600, stock: 8 },
  { id: nanoid(6), name: 'Гарри Поттер и философский камень', category: 'Фэнтези', description: 'Первая книга о юном волшебнике', price: 750, stock: 25 },
  { id: nanoid(6), name: 'Война и мир', category: 'Классика', description: 'Эпопея Л.Н. Толстого', price: 900, stock: 5 },
  { id: nanoid(6), name: 'Маленький принц', category: 'Сказка', description: 'Философская сказка Антуана де Сент-Экзюпери', price: 350, stock: 30 },
  { id: nanoid(6), name: 'Портрет Дориана Грея', category: 'Роман', description: 'Единственный роман Оскара Уайльда', price: 480, stock: 12 },
  { id: nanoid(6), name: 'Три товарища', category: 'Роман', description: 'Произведение Эриха Марии Ремарка', price: 520, stock: 10 },
  { id: nanoid(6), name: 'Анна Каренина', category: 'Классика', description: 'Роман Л.Н. Толстого', price: 650, stock: 7 },
  { id: nanoid(6), name: 'Метро 2033', category: 'Фантастика', description: 'Постапокалиптический роман Дмитрия Глуховского', price: 420, stock: 18 }
];

console.log('✅ Создано книг при старте:', books.length);

// Функция-помощник для получения книги из списка
function findBookOr404(id, res) {
  const book = books.find(b => b.id == id);
  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return null;
  }
  return book;
}

// ========== SWAGGER КОНФИГУРАЦИЯ ==========

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID книги
 *         name:
 *           type: string
 *           description: Название книги
 *         category:
 *           type: string
 *           description: Категория/жанр книги
 *         description:
 *           type: string
 *           description: Краткое описание книги
 *         price:
 *           type: integer
 *           description: Цена книги в рублях
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *       example:
 *         id: abc123
 *         name: Мастер и Маргарита
 *         category: Классика
 *         description: Великий роман Михаила Булгакова
 *         price: 450
 *         stock: 15
 * 
 *   parameters:
 *     BookId:
 *       in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: ID книги
 * 
 *   responses:
 *     404Error:
 *       description: Книга не найдена
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Book not found
 *     400Error:
 *       description: Ошибка валидации
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Nothing to update
 */

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BookShop API - Интернет-магазин книг',
      version: '1.0.0',
      description: 'Полноценное REST API для управления каталогом книг',
      contact: {
        name: 'Разработчик',
        email: 'developer@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный сервер разработки',
      },
      {
        url: 'https://api.bookshop.example.com',
        description: 'Продакшн сервер',
      }
    ],
    tags: [
      {
        name: 'Books',
        description: 'Управление каталогом книг'
      }
    ]
  },
  // Путь к файлам с JSDoc-комментариями
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключаем Swagger UI по адресу /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'BookShop API Documentation'
}));

// Добавляем эндпоинт для получения спецификации в формате JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ========== МАРШРУТЫ API ==========

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Создает новую книгу
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название книги
 *                 example: Война и мир
 *               category:
 *                 type: string
 *                 description: Категория книги
 *                 example: Классика
 *               description:
 *                 type: string
 *                 description: Описание книги
 *                 example: Роман Л.Н. Толстого
 *               price:
 *                 type: integer
 *                 description: Цена в рублях
 *                 example: 900
 *               stock:
 *                 type: integer
 *                 description: Количество на складе
 *                 example: 5
 *     responses:
 *       201:
 *         description: Книга успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/400Error'
 */
app.post("/api/books", (req, res) => {
  const { name, category, description, price, stock } = req.body;
  
  if (!name || !category || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  const newBook = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock)
  };
  
  books.push(newBook);
  console.log('📝 Создана новая книга:', newBook.name);
  res.status(201).json(newBook);
});

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Возвращает список всех книг
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Список книг
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
app.get("/api/books", (req, res) => {
  console.log('📚 Запрос списка книг, всего:', books.length);
  res.json(books);
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Получает книгу по ID
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/BookId'
 *     responses:
 *       200:
 *         description: Данные книги
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         $ref: '#/components/responses/404Error'
 */
app.get("/api/books/:id", (req, res) => {
  const id = req.params.id;
  const book = findBookOr404(id, res);
  if (!book) return;
  res.json(book);
});

/**
 * @swagger
 * /api/books/{id}:
 *   patch:
 *     summary: Обновляет данные книги
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/BookId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Новое название книги
 *                 example: Война и мир (том 1)
 *               category:
 *                 type: string
 *                 description: Новая категория
 *                 example: Классика/Роман
 *               description:
 *                 type: string
 *                 description: Новое описание
 *                 example: Обновленное описание книги
 *               price:
 *                 type: integer
 *                 description: Новая цена
 *                 example: 950
 *               stock:
 *                 type: integer
 *                 description: Новое количество на складе
 *                 example: 10
 *     responses:
 *       200:
 *         description: Обновленная книга
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         $ref: '#/components/responses/400Error'
 *       404:
 *         $ref: '#/components/responses/404Error'
 */
app.patch("/api/books/:id", (req, res) => {
  const id = req.params.id;
  const book = findBookOr404(id, res);
  if (!book) return;
  
  if (req.body?.name === undefined && req.body?.category === undefined && 
      req.body?.description === undefined && req.body?.price === undefined && 
      req.body?.stock === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  
  const { name, category, description, price, stock } = req.body;
  
  if (name !== undefined) book.name = name.trim();
  if (category !== undefined) book.category = category.trim();
  if (description !== undefined) book.description = description.trim();
  if (price !== undefined) book.price = Number(price);
  if (stock !== undefined) book.stock = Number(stock);
  
  console.log('✏️ Обновлена книга:', book.name);
  res.json(book);
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Удаляет книгу
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/BookId'
 *     responses:
 *       204:
 *         description: Книга успешно удалена (нет тела ответа)
 *       404:
 *         $ref: '#/components/responses/404Error'
 */
app.delete("/api/books/:id", (req, res) => {
  const id = req.params.id;
  const exists = books.some((b) => b.id === id);
  if (!exists) return res.status(404).json({ error: "Book not found" });
  
  const deletedBook = books.find(b => b.id === id);
  books = books.filter((b) => b.id !== id);
  console.log('🗑️ Удалена книга:', deletedBook?.name);
  res.status(204).send();
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${port}`);
  console.log(`📚 API: http://localhost:${port}/api/books`);
  console.log(`📖 Swagger документация: http://localhost:${port}/api-docs`);
  console.log(`📊 JSON спецификация: http://localhost:${port}/api-docs.json`);
  console.log(`📚 Количество книг при старте: ${books.length}`);
});