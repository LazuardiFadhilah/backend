import express from "express";
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

export default router;
