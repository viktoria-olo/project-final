import express, { response } from "express";
import BookWish from "../models/BookWish";

const router = express.Router();

router.get("/wishlist", async (req, res) => {
  try {
    const fullWishlist = await BookWish.find().sort({ createdAt: -1 }).exec();
    if (fullWishlist.length > 0) {
      res.json(fullWishlist);
    } else {
      res.status(404).send("No books found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post("/wishlist", async (req, res) => {
  try {
    const bookWish = new BookWish({
      title: req.body.title,
      author: req.body.author,
      message: req.body.message,
    });
    await bookWish.save();
    res.status(201).json({
      success: true,
      response: bookWish,
      message: "Book posted to wishlist",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Could not post to wishlist",
    });
  }
});

export default router;
