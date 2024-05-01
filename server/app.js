const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const bodyParser = require('body-parser');
const cors = require('cors');

// Остальной код сервера...

const app = express();

const port = 3000;

// Используем cors для всех маршрутов
app.use(cors());
app.use((req, res, next) => {
    console.log('CORS Headers:', res.getHeaders());
    next();
});
// Тело запросов в формате JSON
app.use(bodyParser.json());

// Путь к файлу с настройками компонента
const componentSettingsPath = './component-settings.yml';

// API ручка шаблона и стилей
app.route('/api/component-settings')
    .get((req, res) => {
        // Возвращаем настройки компонента
        try {
            const settings = yaml.load(fs.readFileSync(componentSettingsPath, 'utf8'));
            res.json(settings);
        } catch (e) {
            res.status(500).send('Ошибка при чтении файла настроек компонента.');
        }
    })
    .post((req, res) => {
        // Сохраняем настройки компонента
        try {
            const yamlStr = yaml.dump(req.body);
            fs.writeFileSync(componentSettingsPath, yamlStr, 'utf8');
            res.send('Настройки компонента обновлены.');
        } catch (e) {
            res.status(500).send('Ошибка при сохранении файла настроек компонента.');
        }
    });

// API ручка данных
app.get('/api/component-data', (req, res) => {
    // Пример данных компонента
    res.json({
        title: 'Card From Back',
        imageUrl: 'https://i.ibb.co/tYWPjWt/image-2024-05-01-13-35-10.png',
        text: 'Content BACK.'
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
