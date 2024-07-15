import mongoose from "mongoose";
import Form from "../models/form.js";

class OptionController {
  // store
  async store(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!req.params.questionId) {
        throw { code: 400, message: "REQUIRED_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!req.body.option) {
        throw { code: 400, message: "REQUIRED_OPTION" };
      }
      const option = {
        id: new mongoose.Types.ObjectId(),
        option: req.body.option,
      };

      const form = await Form.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.jwt.id,
        },
        { $push: { "question.$[indexQuestion].options": option } },
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
      if (!form) {
        throw { code: 400, message: "ADD_OPTION_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "ADD_OPTION_SUCCESS",
        option,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}
export default new OptionController();
