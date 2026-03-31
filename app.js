const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

const { pool, createUser, findUserByUsername } = require('./user');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // 提供前端檔案

const PORT = process.env.PORT || 3000;

require('dotenv').config();

async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log("成功連接到資料庫！現在時間:", res.rows[0]);
    } catch (err) {
        console.error("資料庫連線失敗:", err);
    }
}

testConnection();//sql test

// 註冊 API
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.json({ success: false, message: "請輸入帳號與密碼" });

    try {
        // 1️⃣ 密碼加密
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2️⃣ 新增使用者到資料庫
        const user = await createUser(username, hashedPassword);

        res.json({ success: true, message: "註冊成功", user });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "帳號已存在或資料庫錯誤" });
    }
});

// 登入 API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) return res.json({ success: false, message: "請輸入帳號與密碼" });

    try {
    // 正確：await 找使用者
    const user = await findUserByUsername(username);

    if(!user) return res.json({ success: false, message: "帳號或密碼錯誤" });

    // 比對密碼
    const match = await bcrypt.compare(password, user.password_hash);
    if(!match) return res.json({ success: false, message: "帳號或密碼錯誤" });

    // 產生 JWT
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, message: "登入成功", token });

  } catch(err) {
    console.error(err);
    res.json({ success: false, message: "資料庫錯誤" });
  }
});

// 受保護 API 範例
app.get('/api/profile', (req, res) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.json({ success: false, message: "沒有 token" });

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ success: true, user: decoded });
    } catch(err) {
        res.json({ success: false, message: "token 無效" });
    }
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));