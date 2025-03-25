const express = require('express');
const router = express.Router();

const { createQuestion, getSpecificQuestion, getRandomQuestion } = require('../controllers/questionController');


router.post('/create', createQuestion);
router.get('/random', getRandomQuestion);
router.get('/:id', getSpecificQuestion);






module.exports = router;