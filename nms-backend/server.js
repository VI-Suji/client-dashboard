const express = require('express')
const morgan = require('morgan')
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const ip = require('./ip')

ip.ipInvoke() // Main function for IP Invoke

const app = express();
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

app.get('/api/data', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json(data);
});

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))