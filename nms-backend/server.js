const express = require('express')
const morgan = require('morgan')
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const ip = require('./ip')
const pool = require('./db')
const pdf = require('./pdf')

ip() // Main function for IP Invoke

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

// app.get('/api/data', (req, res) => {
//   const filePath = path.join(__dirname, 'data.json');
//   const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//   res.json(data);
// });

app.get('/api/percentage', (req, res) => {

})

app.get('/api/ddata', async (req, res) => {
  let { id, start, end } = req.query;
  console.log(id, start, end);

  try {
    const sqlQuery_month = `
    SELECT *, sum(duration) AS hours
    FROM status 
    WHERE ($1 = 'all' OR device_id = $1::integer)
    AND TO_CHAR(downtime_started, 'YYYY-MM-DD') LIKE $2
    GROUP BY status.id
`;

const sqlquery = `
    SELECT *, sum(duration) AS hours
    FROM status 
    WHERE ($1 = 'all' OR device_id = $1::integer) 
    AND TO_CHAR(downtime_started, 'YYYY-DD-MM') BETWEEN $2 AND $3
    GROUP BY status.id
`;

    // Query the database
    let rows;
    if(start != end ){
      ({ rows } = await pool.query(sqlquery, [`${id}`, `${start}`, `${end}`]));
    }else{
      ({ rows } = await pool.query(sqlQuery_month, [`${id}`, `%${start}%`]));
    }

    res.status(200).json(rows);
    // Return the query results as a JSON response
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/data', async (req, res) => {
  const { query } = req.query;
  const table = query || 'devices'; // Default to 'devices' if no query parameter is provided

  try {
    // Construct the SQL query string dynamically
    const sqlQuery = `SELECT * FROM ${table} ORDER BY id ASC`;

    // Query the database
    const { rows } = await pool.query(sqlQuery);

    // Return the query results as a JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const ITEMS_PER_PAGE = 10;

app.get('/api/status', async (req, res) => {
  const { query, currentPage } = req.query;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Prepare the SQL query with parameters
    const sqlQuery = `
      SELECT * FROM status 
      WHERE device_name ILIKE $1 
      ORDER BY downtime_started ASC 
      LIMIT $2 OFFSET $3`;

    // Execute the query with parameters
    const { rows } = await pool.query(sqlQuery, [`%${query || ''}%`, ITEMS_PER_PAGE, offset]);

    // Return the device list as a JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))


/* -- Step 1: Create a UDF for percentage
CREATE OR REPLACE FUNCTION calculate_total_hours(duration TEXT) RETURNS INTEGER AS $$
DECLARE
    total_hours INTEGER;
BEGIN
    total_hours := 0;
    
    IF SPLIT_PART(duration, ' ', 1) <> '' THEN
        total_hours := total_hours + COALESCE(CAST(SPLIT_PART(duration, ' ', 1) AS INTEGER), 0) * 24 * 7;
    END IF;

    IF SPLIT_PART(duration, ' ', 3) <> '' THEN
        total_hours := total_hours + COALESCE(CAST(SPLIT_PART(duration, ' ', 3) AS INTEGER), 0) * 24;
    END IF;

    IF SPLIT_PART(duration, ' ', 5) <> '' THEN
        total_hours := total_hours + COALESCE(CAST(SPLIT_PART(duration, ' ', 5) AS INTEGER), 0);
    END IF;

    IF SPLIT_PART(duration, ' ', 7) <> '' THEN
        total_hours := total_hours + COALESCE(CAST(SPLIT_PART(duration, ' ', 7) AS INTEGER), 0) / 60;
    END IF;

    RETURN total_hours;
END;
$$ LANGUAGE plpgsql;
*/

