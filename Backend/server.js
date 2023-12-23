const express = require('express')
const morgan = require('morgan')
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const ip = require('./ip')

ip.ipInvoke() // Main function for IP Invoke

const app = express();
const db = require('./db')
const PORT = process.env.PORT || 3001

app.use(morgan('dev'))
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/api/downloadFile', (req, res) => {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).send('File name is missing in the request body');
  }
  const filePath = path.join(__dirname, 'files', `${fileName}.csv`);

  try {
    if (fs.existsSync(filePath)) {
      res.download(filePath); 
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
});


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