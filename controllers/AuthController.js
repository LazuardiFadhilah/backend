import User from "../models/user.js";
import emailExist from "../libraries/emailExist.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  });
};

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

      const accessToken = generateAccessToken({ id: user._id });
      const refreshToken = generateRefreshToken({ id: user._id });

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

  async refreshToken(req, res) {
    try {
      if (!req.body.refreshToken) {
        throw { code: 400, message: "REFRESH_TOKEN_IS_REQUIRED" };
      }
      const verify = await jwt.verify(
        req.body.refreshToken,
        env.JWT_REFRESH_TOKEN_SECRET
      );
      let payload = { id: verify.id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "REFRESH_TOKEN_SUCCESS",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error.message == "jwt expired") {
        error.message = "REFRESH_TOKEN_EXPIRED";
      } else if (
        error.message == "invalid signature" ||
        error.message == "jwt malformed" ||
        error.message == "jwt must be provided" ||
        error.message == "invalid token"
      ) {
        error.message = "REFRESH_TOKEN_INVALID";
      }
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
