import mongoose, { mongo } from "mongoose";
import Form from "../models/form.js";
import Answer from "../models/answer.js";
import answer from "../models/answer.js";

class ResponseController {
  async lists(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const form = await Form.findOne({
        _id: req.params.formId,
        userId: req.jwt.id,
      }).populate("answers");
      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "ANSWER_FOUND",
        form,
        total: form.answers.length,
        answers: form.answers,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  }

  async summaries(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const form = await Form.findOne({
        _id: req.params.formId,
        userId: req.jwt.id,
      }).populate("answers");
      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }

      const summaries = form.question.map((question) => {
        const summary = {
          type: question.type,
          questionId: question.id,
          question: question.question,
          answers: form.answers.map((answer) => answer[question.id]),
        };
        return summary;
      });

      return res.status(200).json({
        status: true,
        message: "ANSWER_FOUND",
        summaries,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  }
}

export default new ResponseController();
