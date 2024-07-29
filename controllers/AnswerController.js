import mongoose from "mongoose";
import Answer from "../models/answer.js";
import AnswerDuplicate from "../libraries/answerDuplicate.js";
import Form from "../models/form.js";
import questionRequiredButEmpty from "../libraries/questionRequiredButEmpty.js";
import optionValueNotExist from "../libraries/optionValueNotExist.js";
import questionIdNotValid from "../libraries/questionIdNotValid.js";

class AnswerController {
  async store(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "FORM_ID_INVALID" };
      }
      const form = await Form.findById(req.params.formId);
      const isDuplicate = await AnswerDuplicate(req.body.answers);
      if (isDuplicate) {
        throw { code: 400, message: "DUPLICATE_ANSWER" };
      }

      const questionRequiredEmpty = await questionRequiredButEmpty(
        form,
        req.body.answers
      );
      if (questionRequiredEmpty) {
        throw { code: 400, message: "QUESTION_REQUIRED_BUT_EMPTY" };
      }
      const optionNotExist = await optionValueNotExist(form, req.body.answers);
      if (optionNotExist.lenght > 0) {
        throw {
          code: 400,
          message: "OPTION_VALUE_IS_NOT_EXIST",
          question: optionNotExist[0].questions,
        };
      }

      const questionIdInValid = await questionIdNotValid(
        form,
        req.body.answers
      );
      if (questionIdInValid.length > 0) {
        throw {
          code: 400,
          message: "QUESTION_IS_NOT_EXIST",
          question: questionIdInValid[0].questionId,
        };
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
