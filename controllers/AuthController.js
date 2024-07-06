import User from "../models/user.js";
import emailExist from "../libraries/emailExist.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      if (req.body.password.lenght < 6) {
        throw {
          code: 400,
          message: "PASSWORD_MINIMUM_6_CHARACTERS",
        };
      }

      const isEmailExist = await emailExist(req.body.email);
      if (isEmailExist) {
        throw {
          code: 400,
          message: "EMAIL_ALREADY_EXISTS",
        };
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hash,
      });
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

  async login(req, res) {
    try {
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw {
          code: 404,
          message: "USER_NOT_FOUND",
        };
      }

      const isPasswordMatch = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isPasswordMatch) {
        throw {
          code: 400,
          message: "PASSWORD_NOT_MATCH",
        };
      }

      const accessToken = await jwt.sign({ id: user._id }, "123123u123i1o23o", {
        expiresIn: "15m",
      });

      const refreshToken = await jwt.sign(
        { id: user._id },
        "123kjaskdjasdlkaj12",
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        status: true,
        message: "USER_LOGIN_SUCCESS",
        fullname: user.fullname,
        accessToken,
        refreshToken,
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
