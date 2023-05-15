const Question = require("../models/Question");
const mongoose = require("mongoose");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

//-----save
const save = async (req, res) => {
  console.log(req);
  try {
    //test if question existe
    const main_question = await Question.findOne({
      main_question: req.body.main_question,
    });
    if (main_question) {
      res.json({ saved: false, message: "question already existe" });
      return;
    }
    //save
    const question = new Question(req.body);
    console.log(question);
    const questionSave = await question.save();
    res.status(201).json({ saved: true, object: questionSave });
  } catch (err) {
    if (err.question === "ValidationError") {
      // handle validation errors
      const errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      res.status(400).json({ saved: false, errors });
    } else {
      // handle other errors
      res.status(500).json({ saved: false, message: err });
    }
  }
};

//-----get all
const getAll = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ questions });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//use axios to post to an fast api endpoint

const getQuestions = async (req, res) => {
  main_question = req.body.main_question;
  const openai = new OpenAIApi(config);

  const prompt = `
       generate 30 questions that have the same context and meaning as the provided question. The purpose of this is to train a TensorFlow model to identify the context of questions without numbering. in the following parsable List format:
          [
              "Q1",
              "Q2",
              ...
          ]
      `;

  // const response = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: prompt + main_question,
  //   max_tokens: 2048,
  //   temperature: 1,
  // });

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt + main_question }],
  });

  //const parsableJSONresponse = response.data.choices[0].text;
  const parsableJSONresponse = response.data.choices[0].message.content;
  console.log(parsableJSONresponse);

  res.send(parsableJSONresponse);
};

const file_content = {
  tag: "farewell",
  patterns: ["Bye", "Goodbye", "See you later"],
  responses: ["Goodbye!", "See you later!", "Have a nice day!"],
  context_set: "farewell",
};
const saveToJson = async (req, res) => {
  const file_content = req.body;
  console.log(file_content);
  fs.readFile("./intents.json", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const parsedData = JSON.parse(data);
    parsedData.intents.push(file_content);
    const updatedData = JSON.stringify(parsedData, null, 2);
    fs.writeFile("./intents.json", updatedData, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Data appended to file");
    });
  });
  res.send("Data appended to file");
};

module.exports = {
  save,
  getAll,
  getQuestions,
  saveToJson,
};
