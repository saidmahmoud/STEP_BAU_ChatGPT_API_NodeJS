var express = require('express')
var app = express();
app.use(express.json());
app.use(router);


const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'dbuser',
    password: 's3kreee7',
    database: 'my_db'
})

async function getUserByUsername(username) {
    const connection = await connection.connect();

    try {
        const [rows, fields] = await connection.execute('CALL get_user_by_username(?)', [username]);
        return rows[0][0];
    } finally {
        connection.release();
    }
}



router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id }, 'secret');
    res.json({ token });
});


app.get('/user/:id', function (req, res) {
    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
        if (err) throw err

        console.log('The solution is: ', rows[0].solution)
    });

    connection.end()
    res.send('user ' + req.params.id)
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));