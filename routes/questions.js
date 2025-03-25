const express = require('express');
const router = express.Router();

const { createQuestion, getSpecificQuestion, getRandomQuestion } = require('../controllers/questionController');


router.post('/create', createQuestion);






module.exports = router;