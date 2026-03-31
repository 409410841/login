const { Pool } = require('pg');

require('dotenv').config();

// 建立資料庫連線池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ,
  ssl: { rejectUnauthorized: false } // Render 必須
});

// ==== 新增使用者 ====
async function createUser(username, hashedPassword) {
  const query = 'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *';
  const values = [username, hashedPassword];
  console.log("create user");
  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch(err) {
    throw err;
  }
}

// ==== 搜尋使用者（依 username） ====
async function findUserByUsername(username) {
  const query = 'SELECT * FROM users WHERE username = $1';
  const values = [username];
  console.log("find user");
  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch(err) {
    throw err;
  }
}

// ==== 查所有使用者 ====
async function getAllUsers() {
  const query = 'SELECT id, username FROM users ORDER BY id ASC';
  console.log("search");
  try {
    const res = await pool.query(query);
    return res.rows;
  } catch(err) {
    throw err;
  }
}

// ==== 更新密碼 ====
async function updatePassword(username, hashedPassword) {
  const query = 'UPDATE users SET password_hash=$1 WHERE username=$2 RETURNING *';
  const values = [hashedPassword, username];
  console.log("updata");
  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch(err) {
    throw err;
  }
}

// ==== 刪除使用者 ====
async function deleteUser(username) {
  const query = 'DELETE FROM users WHERE username=$1 RETURNING *';
  const values = [username];
  console.log("delete user");
  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch(err) {
    throw err;
  }
}

module.exports = {
  pool,
  createUser,
  findUserByUsername,
  getAllUsers,
  updatePassword,
  deleteUser
};