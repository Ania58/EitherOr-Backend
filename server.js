const express = require('express');
const app = express();
const cors = require('cors');

const PORT = 3000;

require('dotenv').config();

app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
    res.send('Would You Rather backend is running!');
  });


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})