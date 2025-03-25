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






module.exports = { createQuestion, getSpecificQuestion, getRandomQuestion, getAllQuestions }