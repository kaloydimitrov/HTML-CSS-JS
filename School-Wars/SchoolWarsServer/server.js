const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname));

app.get('/question.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'question.json'));
});

app.post('/save-question', (req, res) => {
    const question = req.body;

    fs.writeFile(path.join(__dirname, 'question.json'), JSON.stringify(question, null, 2), (err) => {
        if (err) {
            console.error("Грешка:", err);
            res.status(500).send("Не успя да запише.");
        } else {
            res.send("Записано успешно!");
        }
    });
});

app.listen(3000, () => {
    console.log("Сървърът работи на http://localhost:3000");
});
