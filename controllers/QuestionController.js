import mongoose from "mongoose";
import Form from "../models/form.js";

class QuestionController {
  async store(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const newQuestion = {
        id: new mongoose.Types.ObjectId(),
        question: null,
        type: "Text",
        required: false,
        options: [],
      };

      const form = await Form.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.jwt.id,
        },
        {
          $push: { question: newQuestion },
        },
        { new: true }
      );
      if (!form) {
        throw { code: 404, message: "FORM_UPDATE_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "SUCCESS_ADD_QUESTION",
        form: form,
        question: newQuestion,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  //   Update Question
  async update(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!req.params.questionId) {
        throw { code: 400, message: "REQUIRED_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "ID_INVALID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "ID_INVALID" };
      }

      let field = {};
      if (req.body.hasOwnProperty("question")) {
        field["question.$[indexQuestion].question"] = req.body.question;
      } else if (req.body.hasOwnProperty("required")) {
        field["question.$[indexQuestion].required"] = req.body.required;
      } else if (req.body.hasOwnProperty("type")) {
        field["question.$[indexQuestion].type"] = req.body.type;
      }

      const question = await Form.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.jwt.id,
        },
        {
          $set: field,
        },

        {
          arrayFilters: [
            {
              "indexQuestion.id": new mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
          ],
          new: true,
        }
      );

      if (!question) {
        throw { code: 404, message: "QUESTION_UPDATE_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_QUESTION",
        question,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new QuestionController();
