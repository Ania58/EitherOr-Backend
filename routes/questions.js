const express = require('express');
const router = express.Router();

const { createQuestion, getSpecificQuestion, getRandomQuestion, getAllQuestions } = require('../controllers/questionController');


router.post('/create', createQuestion);
router.get('/random', getRandomQuestion);
router.get('/:id', getSpecificQuestion);
router.get('/', getAllQuestions);






module.exports = router;