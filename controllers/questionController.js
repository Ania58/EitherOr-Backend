const mongoose = require('mongoose');
const Question = require("../models/Question");


const createQuestion = async (req, res) => {
    try {
        const newQuestion = await Question.create({
            optionOne: req.body.optionOne,
            optionTwo: req.body.optionTwo,
            creator: req.user.uid,
        });
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error("Error creating question" , error.message);
        res.status(500).send("Error creating a question");
    };
};

const getSpecificQuestion = async (req,res) => {
    try {
        const id = req.params.id;
        const specificQuestion = await Question.findById(id);

        res.status(200).json(specificQuestion);
    } catch (error) {
        console.error("Error finding requested question", error.message);
        res.status(404).send("Question not found")
    };
};


const getRandomQuestion = async (req, res) => {
    try {
        const count = await Question.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomQuestion = await Question.findOne().skip(randomIndex);

        res.status(200).json(randomQuestion);
    } catch (error) {
        console.error("Error getting random question:", error.message);
        res.status(500).send("Could not retrieve random question");
    }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).send("Question not found.");
    }

    if (question.creator !== req.user.uid) {
      return res.status(403).send("Not authorized to edit this question.");
    }

    question.optionOne = req.body.optionOne;
    question.optionTwo = req.body.optionTwo;
    await question.save();

    res.status(200).json(question);
  } catch (error) {
    console.error("Error updating question:", error.message);
    res.status(500).send("Could not update question");
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).send("Question not found.");
    }

    if (question.creator !== req.user.uid) {
      return res.status(403).send("Not authorized to delete this question.");
    }

    await question.deleteOne();

    res.status(200).json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error("Error deleting question:", error.message);
    res.status(500).send("Could not delete question");
  }
};


const getAllQuestions = async (req, res) => {
    const sortBy = req.query.sortBy;
    const noPagination = req.query.noPagination === "true";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    let questions;
  
    try {
      if (sortBy === "newest") {
        questions = await Question.find().sort({ createdAt: -1 }).skip(noPagination ? 0 :skip).limit(noPagination ? 0 :limit);
      } else if (sortBy === "weird") {
        questions = await Question.find().sort({ weirdVotes: -1 }).skip(noPagination ? 0 :skip).limit(noPagination ? 0 :limit);
      } else if (sortBy === "popular") {
        const all = await Question.find();
        const sorted = all.sort((a, b) => {
          const votesA = a.votesOptionOne.length + a.votesOptionTwo.length;
          const votesB = b.votesOptionOne.length + b.votesOptionTwo.length;
          return votesB - votesA; 
        });
        questions = noPagination ? sorted : sorted.slice(skip, skip + limit);
      } else {
        questions = await Question.find().skip(noPagination ? 0 :skip).limit(noPagination ? 0 :limit);
      }
      res.status(200).json(questions);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      res.status(500).json({ message: "Something went wrong." });
    }
  };
  

const voteOnQuestion = async (req, res) => {
    try {
        const { option } = req.body;
        const voterId = req.user?.uid || req.body.voterId;
        const { id } = req.params;

        if (!voterId || !["optionOne", "optionTwo"].includes(option)) {
            return res.status(400).send("Invalid option selected.");
          };

        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).send("Question not found.");
          };

          const allVoters = [...question.votesOptionOne, ...question.votesOptionTwo];
            if (allVoters.includes(voterId)) {
            return res.status(403).send("You have already voted on this question.");
    }

          const voteKey = option === "optionOne" ? "votesOptionOne" : "votesOptionTwo";
          question[voteKey].push(voterId);

            await question.save();

            const totalVotes = question.votesOptionOne.length + question.votesOptionTwo.length;
            const percentOptionOne =  totalVotes === 0 ? 0 : ((question.votesOptionOne.length / totalVotes) * 100).toFixed(1);
            const percentOptionTwo =  totalVotes === 0 ? 0 : ((question.votesOptionTwo.length / totalVotes) * 100).toFixed(1);

            res.status(200).json({
                message: "Vote counted!",
                results: {
                  optionOne: {
                    text: question.optionOne,
                    votes: question.votesOptionOne.length,
                    percentage: percentOptionOne
                  },
                  optionTwo: {
                    text: question.optionTwo,
                    votes: question.votesOptionTwo.length,
                    percentage: percentOptionTwo
                  }
                }
              });
        
    } catch (error) {
        console.error("Error voting on question:", error.message);
        res.status(500).send("Error voting on question.");
    }
};

const showVotingResults = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        const totalVotes = question.votesOptionOne.length + question.votesOptionTwo.length;
        const percentOptionOne =  totalVotes === 0 ? 0 : ((question.votesOptionOne.length / totalVotes) * 100).toFixed(1);
        const percentOptionTwo =  totalVotes === 0 ? 0 : ((question.votesOptionTwo.length / totalVotes) * 100).toFixed(1);

        res.status(200).json({
            message: "Vote counted!",
            results: {
              optionOne: {
                text: question.optionOne,
                votes: question.votesOptionOne.length,
                percentage: percentOptionOne
              },
              optionTwo: {
                text: question.optionTwo,
                votes: question.votesOptionTwo.length,
                percentage: percentOptionTwo
              }
            }
          });

    } catch (error) {
        console.error("Error showing the votes:", error.message);
        res.status(500).send("Error showing the votes.");
    }
};

const markAsWeird = async (req, res) => {
    try {
      const { id } = req.params;
      const voterId = req.user?.uid || req.body.voterId;


      if (!voterId) {
        return res.status(400).send("Voter ID is required.");
      }
  
      const question = await Question.findById(id);
      if (!question) return res.status(404).send("Question not found.");

      if (question.weirdVoters.includes(voterId)) {
        return res.status(403).send("You already marked this question as weird.");
      }
  
      question.weirdVotes += 1;
      question.weirdVoters.push(voterId);
      await question.save();
  
      res.status(200).json({
        message: "Marked as weird!",
        weirdVotes: question.weirdVotes
      });
  
    } catch (error) {
      console.error("Error marking as weird:", error.message);
      res.status(500).send("Error processing weird vote.");
    }
  };  


const addCommentToQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, user, name } = req.body;

        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).send("Question not found.");
        }

        question.comments.push({ user, text, name });
        await question.save();

        res.status(201).json(question.comments);
    } catch (error) {
        console.error("Error adding comment:", error.message);
        res.status(500).send("Could not add comment");
    }
};

const getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).send("Question not found.");
          }
      
          res.status(200).json(question.comments);
    } catch (error) {
        console.error("Error getting comments:", error.message);
        res.status(500).send("Could not retrieve comments.");
    }
};


const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { commentId, text, user } = req.body;
        const question = await Question.findById(id)

        if (!question) {
            return res.status(404).send("Question not found.");
          };

          const comment = question.comments.id(commentId); 
            if (!comment) {
                return res.status(404).send("Comment not found.");
            };

            if (comment.user !== user) {
                return res.status(403).send("You can only edit your own comment.");
              }

        comment.text = text; 
        await question.save(); 
    
        res.status(200).json({ message: "Comment updated.", comments: question.comments });
        
    } catch (error) {
        console.error("Error updating comment:", error.message);
        res.status(500).send("Could not update comment");
    }
};

const deleteComment = async (req,res) => {
    try {
        const { id } = req.params;
        const { commentId, user } = req.body;

        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).send("Question not found.");
        }

        const comment = question.comments.id(commentId);

        if (!comment) {
            return res.status(404).send("Comment not found");
        }

        if (comment.user !== user) {
            return res.status(403).send("You can only delete your own comment.");
          }

        question.comments.pull(commentId);
        await question.save();

        res.status(200).json({ message: "Comment deleted.", comments: question.comments });

    } catch (error) {
        console.error("Error deleting comment:", error.message);
        res.status(500).send("Could not delete comment");
    }
}

module.exports = { createQuestion, getSpecificQuestion, getRandomQuestion, updateQuestion, deleteQuestion, getAllQuestions, voteOnQuestion, showVotingResults, markAsWeird, addCommentToQuestion, getComments, updateComment, deleteComment }