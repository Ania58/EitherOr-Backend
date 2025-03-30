const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const admin = require('firebase-admin');

const questionRoutes = require("./routes/questions");
const authRoutes = require('./routes/auth');

require('dotenv').config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();


app.get('/', (req, res) => {
    res.send('Would You Rather backend is running!');
  });


app.use('/questions', questionRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})