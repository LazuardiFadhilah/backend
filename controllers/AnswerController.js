import mongoose from "mongoose";
import Answer from "../models/answer.js";
import AnswerDuplicate from "../libraries/answerDuplicate.js";

class AnswerController {
  async store(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "FORM_ID_INVALID" };
      }

      const isDuplicate = await AnswerDuplicate(req.body.answers);
      if (isDuplicate) {
        throw { code: 400, message: "DUPLICATE_ANSWER" };
      }

      let fields = {};
      req.body.answers.forEach((answer) => {
        fields[answer.questionId] = answer.value;
      });
      const answer = await Answer.create({
        userId: req.jwt.id,
        formId: req.params.formId,
        ...fields,
      });
      if (!answer) {
        throw { code: 400, message: "ANSWER_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "ANSWER_SUCCESS",
        answer,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}
export default new AnswerController();
