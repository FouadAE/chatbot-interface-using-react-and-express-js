const mongoose = require("mongoose");

const QuestionSchema = mongoose.Schema(
  {
    main_question: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
