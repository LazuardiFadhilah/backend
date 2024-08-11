import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const jwtAuth = () => {
  return async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        throw {
          code: 401,
          message: "UNAUTHORIZED",
        };
      }
      const token = req.headers.authorization.split(" ")[1];
      const verify = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
      req.jwt = verify;
      next();
    } catch (error) {
      if (error.message == "jwt expired") {
        error.code = 401;
        error.message = "ACCESS_TOKEN_EXPIRED";
      } else if (
        error.message == "invalid signature" ||
        error.message == "jwt malformed" ||
        error.message == "jwt must be provided" ||
        error.message == "invalid token"
      ) {
        error.message = "ACCESS_TOKEN_INVALID";
      }
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  };
};

export default jwtAuth;
