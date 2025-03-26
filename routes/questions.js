const express = require('express');
const router = express.Router();

const { createQuestion, getSpecificQuestion, getRandomQuestion,  updateQuestion, deleteQuestion, getAllQuestions, voteOnQuestion, showVotingResults, addCommentToQuestion } = require('../controllers/questionController');


router.post('/create', createQuestion);
router.get('/random', getRandomQuestion);
router.get('/:id', getSpecificQuestion);
router.post('/:id/vote', voteOnQuestion);
router.get("/:id/results", showVotingResults);
router.put('/:id/edit', updateQuestion);
router.delete('/:id/delete', deleteQuestion);
router.get('/', getAllQuestions);
router.post('/:id/comments', addCommentToQuestion);







module.exports = router;