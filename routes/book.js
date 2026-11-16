const express = require("express");
const router = express.Router();

const prisma = require("../helper/prisma");

const authProtect = require("../middleware/auth");

router.post("/create", authProtect, async (req, res, next) => {
  try {
    const { title, price, description, author, categoryId } = req.body;
    const { sub, isAdmin } = req.user;

    const book = await prisma.book.create({
      data: {
        title,
        price: String(price),
        description,
        author,
        categoryId: Number(categoryId),
        userId: Number(sub)
      },
    });

    return res.status(200).json({ message: "book create successfully" });
  } catch (error) {
    next(error);
  }
});

router.put("/update", authProtect, async (req, res, next) => {
  try {
    const { title, price, description, author, bookId } = req.body;
    const { sub, isAdmin } = req.user;

    const book = await prisma.book.update({
      where: { id: Number(bookId), userId: Number(sub) },
      data: {
        title,
        price: String(price),
        description,
        author,
      },
    });

    return res.status(200).json({ message: "book updated successfully" });
  } catch (error) {
    next(error);
  }
});



router.get("/allBooks", authProtect, async (req, res, next) => {
  try {
    const allBooks = await prisma.book.findMany({
      where: {
        userId: Number(req.user.sub),
      },
    });
    return res.status(200).json({message: "All books fetched successfully", allBooks});
  } catch (error) {
    next(error);
  }
});

router.get("/single/:id", authProtect, async (req, res, next) => {
  try {
    //get oneUser
    const { id } = req.params;
    const { sub } = req.user;

    //get info from user database
    const book = await prisma.book.findUnique({
      where: {
        id: Number(id),
        userId: Number(sub),
      },
      select:{
        title:true,
        price: true,
        description: true,
        author: true,
        category:{
          select:{
            name: true
          }
        }
      }
    });

    if (book) {
      return res.status(200).json({ message: "book fetched successfully", book });
    } else {
      return res.status(404).json({ message: "book not found" });
    }
  } catch (error) {
    next(error);
  }
});


router.delete("/delete/:id", authProtect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub } = req.user; 

    const book = await prisma.book.delete({
      where: {
        id: Number(id),
        userId: Number(sub)
      },
    });

    return res.status(200).json({message: `book title - ${book.title} deleted successfully` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
