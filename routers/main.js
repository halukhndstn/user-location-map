const client = require('./connection.js'); 
const express = require('express'); 
const app = express(); 
const cors = require('cors'); 
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); 
const { v4: uuidv4 } = require('uuid');

const saltRounds = 10; 

app.use(bodyParser.json()); 
app.use(cors()); 

app.listen(3300, () => {
    // console.log('The server from which the data will be retrieved is running at http://localhost:3300');
});

app.get('/users', (req, res) => {
    client.query(`SELECT * FROM users`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        } else {
            console.log(err.message);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;

    client.query('SELECT * FROM users WHERE id = $1', [userId], (err, result) => {
        if (!err) {
            if (result.rows.length > 0) {
                res.send(result.rows[0]);
            } else {
                res.status(404).send('User not found');
            }
        } else {
            console.log(err.message);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/users', async (req, res) => {
    const user = req.body;
    const userId = generateUniqueId(); 

    try {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds); 

        const insertQuery = `
            INSERT INTO users(id, firstname, lastname, email, password)
            VALUES($1, $2, $3, $4, $5)
        `; 

        const values = [userId, user.firstname, user.lastname, user.email, hashedPassword];

        client.query(insertQuery, values, (err, result) => {
            if (!err) {
                res.status(200).json({ message: 'Insertion was successful' });
            } else {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = req.body;

    const updateQuery = `
        UPDATE users
        SET firstname = $1,
            lastname = $2,
            email = $3
        WHERE id = $4
    `;

    const values = [user.firstname, user.lastname, user.email, userId];

    client.query(updateQuery, values, (err, result) => {
        if (!err) {
            res.send('Update was successful');
        } else {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;

    const deleteQuery = 'DELETE FROM users WHERE id = $1'; 

    client.query(deleteQuery, [userId], (err, result) => {
        if (!err) {
            res.send('Deletion was successful');
        } else {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE email = $1'; 

    try {
        const result = await client.query(checkUserQuery, [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            const passwordMatch = await bcrypt.compare(password, user.password); 

            if (passwordMatch) {
                res.status(200).json({ message: 'Login successful', redirect: 'index.html' });
            } else {
                res.status(401).json({ error: 'Invalid email or password' });
            }
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/adminlogin', async (req, res) => {
    const { email, password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE email = $1'; 

    try {
        const result = await client.query(checkUserQuery, [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch && user.isadmin === 1) {
                res.status(200).json({ message: 'Login successful', redirect: 'http://localhost:5173/' });
            } else {
                res.status(401).json({ error: 'Invalid email, password, or insufficient permissions' });
            }
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/locations', (req, res) => {
    client.query(`SELECT * FROM locations`, (err, result) => {
        if (!err) {
            res.send(result.rows); 
        } else {
            console.log(err.message);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/locations/:id', (req, res) => {
    const locationId = req.params.id;

    client.query('SELECT * FROM locations WHERE id = $1', [locationId], (err, result) => {
        if (!err) {
            if (result.rows.length > 0) {
                res.send(result.rows[0]);
            } else {
                res.status(404).send('location not found');
            }
        } else {
            console.log(err.message);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/locations', (req, res) => {
    const locations = req.body;
    let insertQuery = `INSERT INTO locations(id, location_name, location_lat, location_lon, location_desc)
                       VALUES(${locations.id}, '${locations.location_name}', '${locations.location_lat}', '${locations.location_lon}', '${locations.location_desc}')`;

    client.query(insertQuery, (err, result) => {
        if (!err) {
            res.send('Insertion was successful');
        } else {
            console.log(err.message);
        }
    });
});

app.put('/locations/:id', (req, res) => {
    let locations = req.body;
    let updateQuery = `UPDATE locations
                       SET location_name = '${locations.location_name}',
                       location_lat = '${locations.location_lat}',
                       location_lon = '${locations.location_lon}',
                       location_desc= '${locations.location_desc}'
                       WHERE id = ${locations.id}`;

    client.query(updateQuery, (err, result) => {
        if (!err) {
            res.send('Update was successful');
        } else {
            console.log(err.message);
        }
    });
});

app.delete('/locations/:id', (req, res) => {
    let deleteQuery = `DELETE FROM locations WHERE id=${req.params.id}`;

    client.query(deleteQuery, (err, result) => {
        if (!err) {
            res.send('Deletion was successful');
        } else {
            console.log(err.message);
        }
    });
});

client.connect();

function generateUniqueId() {
    return uuidv4();
}
