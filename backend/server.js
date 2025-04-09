const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Thêm bcrypt

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));
app.use('/video', express.static('public/video'));

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

// API: Đăng ký người dùng
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    console.log('Dữ liệu nhận được:', { name, email, password });

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        // Kiểm tra email hoặc user_name đã tồn tại chưa
        db.query('SELECT * FROM users WHERE email = ? OR user_name = ?', [email, name], async (err, result) => {
            if (err) {
                console.log('Lỗi kiểm tra email/user_name:', err);
                return res.status(500).json({ error: err.message });
            }
            if (result.length > 0) {
                const existingUser = result[0];
                if (existingUser.email === email) {
                    return res.status(400).json({ error: 'Email đã được sử dụng' });
                }
                if (existingUser.user_name === name) {
                    return res.status(400).json({ error: 'Tên người dùng đã được sử dụng' });
                }
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Chèn dữ liệu vào bảng users, sử dụng user_name thay vì name
            db.query(
                'INSERT INTO users (user_name, email, password, role_id) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, 4], // role_id mặc định là 4
                (err, result) => {
                    if (err) {
                        console.log('Lỗi khi thêm user:', err);
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(201).json({ message: 'Đăng ký thành công!' });
                }
            );
        });
    } catch (err) {
        console.log('Lỗi server:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// API: Đăng nhập người dùng
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const user = result[0];

        // So sánh mật khẩu
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        // Trả về thông tin người dùng (trừ mật khẩu)
        res.json({
            message: 'Đăng nhập thành công!',
            user: { id: user.id, name: user.name, email: user.email }
        });
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
        WHERE status = 'approved'`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// API: Lấy chi tiết phim kèm danh sách tập
app.get('/api/movies/:id', (req, res) => {
    const movieId = req.params.id;

    const movieQuery = `
    SELECT 
        movie_id AS id,
        title,
        description,
        image_url,
        status
    FROM movies
    WHERE movie_id = ? AND status = 'approved'
    `;

    const episodeQuery = `
        SELECT 
            episode_id,
            movie_id,
            episode_number AS episode,
            title,
            video_url
        FROM episodes
        WHERE movie_id = ?
        ORDER BY episode ASC
    `;

    db.query(movieQuery, [movieId], (err, movieResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (movieResult.length === 0) return res.status(404).json({ error: "Không tìm thấy phim" });

        const movie = movieResult[0];

        db.query(episodeQuery, [movieId], (err, episodeResults) => {
            if (err) return res.status(500).json({ error: err.message });

            movie.episodes = Array.isArray(episodeResults) ? episodeResults : [];
            res.json(movie);
        });
    });
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});