const express = require('express');
const router = express.Router();

const { createQuestion, getSpecificQuestion, getRandomQuestion,  updateQuestion, deleteQuestion, getAllQuestions, voteOnQuestion, showVotingResults, markAsWeird, addCommentToQuestion, getComments, updateComment, deleteComment } = require('../controllers/questionController');
const verifyToken = require("../middlewares/verifyToken");

router.post('/create', verifyToken, createQuestion);
router.get('/random', getRandomQuestion);
router.get('/:id', getSpecificQuestion);
router.post('/:id/vote', voteOnQuestion);
router.get("/:id/results", showVotingResults);
router.post("/:id/weird", markAsWeird);
router.put('/:id/edit', verifyToken, updateQuestion);
router.delete('/:id/delete', verifyToken, deleteQuestion);
router.get('/', getAllQuestions);
router.post('/:id/comments', verifyToken, addCommentToQuestion);
router.get('/:id/comments', getComments);
router.put('/:id/comments', verifyToken, updateComment);
router.delete('/:id/comments', verifyToken, deleteComment);







module.exports = router;