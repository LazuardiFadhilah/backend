import User from "../models/user.js";
import emailExist from "../libraries/emailExist.js";

class AuthController {
  async register(req, res) {
    try {
      if (!req.body.fullname) {
        throw { code: 400, message: "FULLNAME_IS_REQUIRED" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }

      const isEmailExist = await emailExist(req.body.email);
      if (isEmailExist) {
        throw {
          code: 400,
          message: "EMAIL_ALREADY_EXISTS",
        };
      }

      const user = await User.create(req.body);
      if (!user) {
        throw {
          code: 500,
          message: "USER_REGISTER_FAILED",
        };
      }

      return res.status(200).json({
        status: true,
        message: "USER_REGISTER_SUCCESS",
        user,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
