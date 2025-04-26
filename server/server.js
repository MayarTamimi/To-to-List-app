const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const pool = require('./DB');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/todos/:userEmail', async (req, res) => {
  const { userEmail } = req.params;
  try {
    const todos = await pool.query('SELECT * FROM todo WHERE user_email = $1', [
      userEmail,
    ]);
    res.json(todos.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/todos', async (req, res) => {
  const { userEmail, title, progress, date } = req.body;
  console.log(userEmail);
  const id = uuidv4();
  try {
    const newTodo = await pool.query(
      'INSERT INTO todo (id, user_email, title, progress, date) VALUES ($1, $2, $3, $4, $5)',
      [id, userEmail, title, progress, date]
    );
    res.status(200).json(newTodo.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Edit a new todo
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const [userEmail, title, progress, date] = req.body;
  try {
    const editTodo = await pool.query(
      'UPDATE todo SET user_email = $1 , title = $2 , progress = $3 , date = $4 WHERE id = $5;',
      [userEmail, title, progress, date, id]
    );
    res.json(editTodo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTodo = await pool.query('DELETE FROM todo WHERE id = $1;', [id]);
    res.json(deleteTodo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// sign up
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const signUp = await pool.query(`INSERT INTO todo_user(email, password) VALUES ($1, $2)`,
      [email, hashedPassword]
    );

    const token = jwt.sign({ email }, 'secret', { expiresIn: '24h' });
    res.json({ email, token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ details: error.detail });
  }
});

//login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', req.body);
  try {
    const user = await pool.query('SELECT * FROM todo_user WHERE email = $1', [
      email,
    ]);

    if (!user.rows.length) {
      return res.status(400).json({ details: 'Invalid credentials' });
    }
    const success = await bcrypt.compare(password, user.rows[0].password);
    if (!success) {
      return res.status(400).json({ details: 'Invalid credentials' });
    }
    const token = jwt.sign({ email }, 'secret', { expiresIn: '24h' });
    res.json({ email: user.rows[0].email, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
