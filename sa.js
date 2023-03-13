const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Define configuration for your SQL Server connection
// //const config = {
//   user: 'LAPTOP-SE6BPEVT\SAI VAMSI',
//   password: '',
//   server: 'LAPTOP-SE6BPEVT\SQLEXPRESS',
//   database: 'live',
// };//
var config = {
  server: 'LAPTOP-SE6BPEVT\SQLEXPRESS',
  authentication: {
    type: 'default',
    options: {
      userName: 'test',
      password: 'Sai vamsi'
    }
  },
  options: {
    port: 1433 // <-- add your custom port here
  }
};
// Define an endpoint to get data from the database
app.get('/api/data', async (req, res) => {
  try {
    // Create a connection pool to your SQL Server database
    const pool = await sql.connect(config);

    // Execute a SELECT query to retrieve data from your table
    const result = await pool.request().query('SELECT * FROM liveprd');

    // Return the retrieved data as a JSON response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Define an endpoint to insert data into the database
app.post('/api/data', async (req, res) => {
  try {
    // Create a connection pool to your SQL Server database
    const pool = await sql.connect(config);

    // Get the new data from the request body
    const newData = req.body;

    // Execute an INSERT query to add the new data to your table
    const result = await pool
      .request()
      .input('name', sql.VarChar, newData.column1)
      .input('age', sql.VarChar, newData.column2)
      .query('INSERT INTO liveprd( name, age) VALUES (?, ?)');

    // Return the inserted data as a JSON response
    res.status(201).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
