import express from "express";
import AuthController from "../controllers/AuthController.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.body.umur);
  res.json({
    title: `Hello ${req.query.nama}, umur ${req.body.umur}`,
  });
});

router.post("/", (req, res) => {
  console.log(req.body.umur);
  res.json({
    title: `Hello ${req.body.nama}, umur ${req.body.umur}`,
  });
});

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", jwtAuth(), AuthController.refreshToken);

export default router;
