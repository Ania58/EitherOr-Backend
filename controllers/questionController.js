const mongoose = require('mongoose');
const Question = require("../models/Question");


const createQuestion = async (req, res) => {
    try {
        const newQuestion = await Question.create({
            optionOne: req.body.optionOne,
            optionTwo: req.body.optionTwo,
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

const getAllQuestions = async (req, res) => {
    try {
        const allQuestions = await Question.find();
        res.status(200).json(allQuestions);
    } catch (error) {
        console.error("Error getting all questions:", error.message);
        res.status(500).send("Could not retrieve all questions");
    }
};

const voteOnQuestion = async (req, res) => {
    try {
        const { option, voterId  } = req.body;
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
            const percentOptionOne = ((question.votesOptionOne.length / totalVotes) * 100).toFixed(1);
            const percentOptionTwo = ((question.votesOptionTwo.length / totalVotes) * 100).toFixed(1);

            //res.status(200).json({ message: "Vote counted!", question });

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





module.exports = { createQuestion, getSpecificQuestion, getRandomQuestion, getAllQuestions, voteOnQuestion }