// Import necessary modules
import express from 'express';
import database from 'db.mjs';

// Create an Express app
const app = express();
const PORT = 3000;

// Set the view engine and handle form data
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Function to fetch and log all users from the users table
async function fetchAndLogAllUsers() {
  let connection;
  try {
    connection = await database.getConnection();

    // Execute the SQL query to fetch all users from the table
    const users = await connection.query('SELECT * FROM users');

    // Log the users
    console.log(users);
  } catch (err) {
    console.error('Error while fetching users:', err);
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
}

// Call the function to fetch and log all users
// fetchAndLogAllUsers();

// Import and use lobbyRouter
import lobbyRouter from './routes/lobby.mjs';
app.use('/api/lobby', lobbyRouter);

// Import and use connexionRouter
import connexionRouter from './routes/api.mjs';
app.use('/api', connexionRouter);

// Start the server
app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}/`));