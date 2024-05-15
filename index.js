const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'grocery_admin'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});


app.get('/products', (req, res) => {
    connection.query('SELECT * FROM product', (error, results, fields) => {
        if (error) {
            res.status(500).json({ message: error.message });
        } else {
            res.json(results);
        }
    });
});

app.post('/products', (req, res) => {
    const { name,
        image,
        price,
        details,
        stock_quantity } = req.body;
    connection.query('INSERT INTO product (name, image, price, details, stock_quantity) VALUES (?, ?, ?,?,?)', [name,
        image,
        price,
        details,
        stock_quantity], (error, results, fields) => {
            if (error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(201).json({ message: 'Product added successfully' });
            }
        });
});

app.put('/products/:id', (req, res) => {
    const productId = req.params.id;
    const { name, image, price, details, stock_quantity } = req.body;
    connection.query('UPDATE product SET name=?, image=?, price=?, details=?, stock_quantity=? WHERE id=?', [name, image, price, details, stock_quantity, productId], (error, results, fields) => {
        if (error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(200).json({ message: 'Product updated successfully' });
        }
    });
});

app.delete('/products/:id', (req, res) => {
    const productId = req.params.id;
    connection.query('DELETE FROM product WHERE id=?', [productId], (error, results, fields) => {
        if (error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(200).json({ message: 'Product deleted successfully' });
        }
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});