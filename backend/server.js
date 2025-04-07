const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

// Cho phép React gọi API
app.use(cors());
app.use(express.json());
app.use('images', express.static('public/images'));

// Kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'web'
});

db.connect((err) => {
    if (err) {
        console.log("Lỗi kết nối:", err);
    } else {
        console.log("Đã kết nối MySQL!");
    }
});

// API: Lấy danh sách users
app.get('/users', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// API: Lấy danh sách anime
app.get('/api/movies', (req, res) => {
    const query = `
        SELECT 
            movie_id as id,
            title,
            image_url,
            status
        FROM movies
        WHERE status = 'approved'`; // Chỉ lấy phim đã được duyệt
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});
