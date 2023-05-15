const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question");

//findAll
//router.route("/all").get(activityController.findAll);

//save

router.route("/save").post(questionController.save);
router.route("/all").get(questionController.getAll);
router.route("/ask_openai").post(questionController.getQuestions);
router.route("/toJson").post(questionController.saveToJson);

module.exports = router;
