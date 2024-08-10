import express from "express";
import jwtAuth from "../middlewares/jwtAuth.js";
import AuthController from "../controllers/AuthController.js";
import FormController from "../controllers/FormController.js";
import QuestionController from "../controllers/QuestionController.js";
import OptionController from "../controllers/OptionController.js";
import AnswerController from "../controllers/AnswerController.js";
import inviteController from "../controllers/inviteController.js";
import ResponseController from "../controllers/ResponseController.js";
const router = express.Router();

// auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", jwtAuth(), AuthController.refreshToken);

// Form
router.get("/forms", jwtAuth(), FormController.index);
router.post("/forms", jwtAuth(), FormController.store);
router.get("/forms/:id", jwtAuth(), FormController.show);
router.put("/forms/:id", jwtAuth(), FormController.update);
router.delete("/forms/:id", jwtAuth(), FormController.destroy);
router.get("/forms/:id/users", jwtAuth(), FormController.showToUser);

// Question
router.get("/forms/:id/questions", jwtAuth(), QuestionController.index);
router.post("/forms/:id/questions", jwtAuth(), QuestionController.store);
router.put(
  "/forms/:id/question/:questionId",
  jwtAuth(),
  QuestionController.update
);
router.delete(
  "/forms/:id/question/:questionId",
  jwtAuth(),
  QuestionController.destroy
);

// Options
router.post(
  "/forms/:id/questions/:questionId/options",
  jwtAuth(),
  OptionController.store
);
router.put(
  "/forms/:id/questions/:questionId/options/:optionId",
  jwtAuth(),
  OptionController.update
);
router.delete(
  "/forms/:id/questions/:questionId/options/:optionId",
  jwtAuth(),
  OptionController.destroy
);

// Invites
router.get("/forms/:id/invites", jwtAuth(), inviteController.index);
router.post("/forms/:id/invites", jwtAuth(), inviteController.store);
router.delete("/forms/:id/invites", jwtAuth(), inviteController.destroy);

// Answer
router.post("/answers/:formId", jwtAuth(), AnswerController.store);

// Response
router.get("/responses/:formId/lists", jwtAuth(), ResponseController.lists);
export default router;
