const { json } = require('express');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'stepchatgptdbmysql.mysql.database.azure.com',
    user: 'stepadmin',
    password: 'AD@devdb2023',
    database: 'chatgptdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/api/chat/:message', async function (req, res) {
    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
        apiKey: "sk-KyYzLfnCbbbbbbKdmEhPDOZimiT3BlbkFJ2Ym1Oa8esLYxWYQivT6k",
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.params.message,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    const message = response.data.choices[0].text.trim();
    console.log('ChatGPT response:', message);
    res.send(message);

});


app.post('/api/login', (req, res) => {
    const { u_USERNAME, u_PASSWORD } = req.body;

    pool.query('CALL Login(?,?, @u_ID)', [u_USERNAME, u_PASSWORD], function (error, results, fields) {
        if (error) {
            res.json({ message: error.sqlMessage });
        } else {

            // fetch the output parameter value from the connection
            pool.query('SELECT @u_ID', function (error, results, fields) {
                if (error) throw error;
                id = results[0]['@u_ID'];
                console.log('id:', id);
                const token = jwt.sign({ userId: id }, 'secret');
                res.json({ token });
                //res.json(id);
            });
        }
    });
});

app.get('/users', function (req, res) {
    pool.query('SELECT * from users', (err, rows, fields) => {
        if (err) throw err

        console.log(rows);
        res.json({ rows });
    });
});

app.get('/users/:id', function (req, res) {
    pool.query('SELECT * from users where user_id=' + req.params.id, (err, rows, fields) => {
        if (err) throw err

        res.json({ rows });
    });
});

app.post('/api/register', (req, res) => {

    const { USER_NAME, LOGIN_USERNAME, LOGIN_PASSWORD } = req.body;

    pool.query('CALL Registration(?, ?, ?, @USER_ID)', [USER_NAME, LOGIN_USERNAME, LOGIN_PASSWORD], function (error, results, fields) {
        if (error) {
            res.json({ message: error.sqlMessage });
        } else {

            // fetch the output parameter value from the connection
            pool.query('SELECT @USER_ID', function (error, results, fields) {
                if (error) throw error;
                id = results[0]['@USER_ID'];
                res.json({ id: id });
                //res.json(id);
            });
        }
    });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));