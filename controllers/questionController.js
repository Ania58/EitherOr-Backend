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
        const { option } = req.body;
        const { id } = req.params;

        if (!["optionOne", "optionTwo"].includes(option)) {
            return res.status(400).send("Invalid option selected.");
          };

        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).send("Question not found.");
          };

          const voteKey = option === "optionOne" ? "votesOptionOne" : "votesOptionTwo";
          question[voteKey].push("anonymous");

            await question.save();
            res.status(200).json({ message: "Vote counted!", question });
        
    } catch (error) {
        console.error("Error voting on question:", error.message);
        res.status(500).send("Error voting on question.");
    }
};





module.exports = { createQuestion, getSpecificQuestion, getRandomQuestion, getAllQuestions, voteOnQuestion }