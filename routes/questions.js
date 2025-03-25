const express = require('express');
const router = express.Router();

const { createQuestion, getSpecificQuestion, getRandomQuestion, getAllQuestions, voteOnQuestion } = require('../controllers/questionController');


router.post('/create', createQuestion);
router.get('/random', getRandomQuestion);
router.get('/:id', getSpecificQuestion);
router.post('/:id/vote', voteOnQuestion);
router.get('/', getAllQuestions);






module.exports = router;