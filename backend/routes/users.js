import express from "express";
import User from "../models/User.js"

const router = express.Router()

router.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

export default router