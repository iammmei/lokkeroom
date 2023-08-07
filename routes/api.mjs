import express from "express";
import db from 'db.mjs'
import bcrypt from 'bcrypt'
const router = express.Router()

// app.use(express.urlencoded({extended: false}))


router.get('/login', (req, res) => {
    res.render('login.ejs')
})

router.post('/login', (req, res) => {

})

router.get('/register', (req, res) => {
    res.render('register.ejs')
})

router.post('/register', async (req, res) => { // async is there so I can use the await keyword
    const user = {
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        name: req.body.name,
      };
    let conn;
    try {
        conn = await db.getConnection();
        const result = await conn.query("insert into users (name, email, password) values (?, ?, ?)", [user.name, user.email, user.password]);
        // res.send(result);
        // Execute the SQL query to fetch all users from the table
        const users = await conn.query('SELECT * FROM users');
        res.redirect('/login')
    }
    catch (err) {
        console.error('Error while fetching users:', err);
      } finally {
        if (conn) {
          conn.release(); // Release the connection back to the pool
        }
      }
    })

export default router