import express from "express";
import db from '../db.mjs'
const router = express.Router()

router.get('/', async (req, res) => {
    // res.render('index.ejs', { name : "Kyle"}) 
    let conn;
    try{
        conn = await db.getConnection();
        const result = await conn.query("SELECT id, name FROM lobby");
        // console.log(result)
        res.send(result)
    }
    catch (err) {
        console.error('Error while getting lobbies', err);
    }
    finally {
        if (conn) {
          conn.release(); // Release the connection back to the pool
        }
    }
})

router.get('/:lobbyid', async (req, res) => {
    // An array containing all the message from the lobby
    req.params.lobbyid
    // res.send(`${req.params.lobbyid}`)
    let conn
    try{
        conn = await db.getConnection();
        // const result = await conn.query(`SELECT text FROM message where lobby_id = ${req.params.lobbyid} order by id asc`);
        const result = await conn.query(`select name, text from message inner join users on user_id = users.id where lobby_id = ${req.params.lobbyid}`);
        const lobbyName = await conn.query(`SELECT name FROM lobby where id = ${req.params.lobbyid}`)
        // res.send(result)
        res.render('tchat.ejs', {name : lobbyName[0].name, messages : result, numLobby : req.params.lobbyid} )
    }
    catch (err) {
        console.error(`Error while getting messages of lobby ${req.params.lobbyid}`, err);
    }
    finally {
        if (conn) {
          conn.release(); // Release the connection back to the pool
        }
    }
})

router.get('/:lobbyid/:messageid', (req, res) => {
    // A single message object from the lobby
    req.params.messageid
    res.send(`${req.params.lobbyid}/${req.params.messageid}`)
})

router.post('/:lobbyid', async (req, res) => {
    //A message stating the message has been posted (or the approriate error, if any)
    req.params.lobbyid
    const data = {
        message: req.body.message,
        userId: req.body.userId,
    };
    let conn;
    try {
        conn = await db.getConnection();
        const result = await conn.query(`insert into message (user_id, lobby_id, text) VALUES (${data.userId}, ${req.params.lobbyid}, ${data.message})`)
        res.redirect('/')
    }
    catch (err) {
        console.error('Error while sending message:', err);
      } finally {
        if (conn) {
          conn.release(); // Release the connection back to the pool
        }
      }
})

router.post('/:lobby-id/add-user', (req, res) => {
    //Add an user to a lobby
})

router.post('/:lobby-id/remove-user', (req, res) => {
    //remove an user to a lobby
})

router.patch('/:message-id', (req, res) => {
    // Edit a message. Users can only edit their own messages, unless they are admins.
})



export default router