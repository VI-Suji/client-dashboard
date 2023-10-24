const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { spawn } = require('child_process');

const pythonProcess = spawn('python3', ['ip.py']);

pythonProcess.stdout.on('data', (data) => {
  console.log(`Python script output: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`Python script error: ${data}`);
});

pythonProcess.on('close', (code) => {
  console.log(`Python script exited with code ${code}`);
});

const app = express();

const db = require('./db')

const PORT = process.env.PORT || 3001

app.use(morgan('dev'))
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const users = await db.select().from('users').where('username','=',username).where('password','=',password)
  res.json(users)
})

app.get('/api/data', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json(data);
});


app.post('/auth/all', async (req, res) => {
  const users = await db.select().from('users')
  res.json(users)
})

app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;

  const user = await db('users').insert({ username: username, password : password }).returning('*')
  res.json(user)
})

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))