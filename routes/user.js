const express = require("express");
const router = express.Router();

//importing prisma, joischema and argon2
const prisma = require("../helper/prisma");
const userSchema = require("../joischema/userSchema");
const argon = require("argon2");

// importing the authentication protect (adim and auth)
const adminProtect = require("../middleware/authAdmin");
const authProtect = require("../middleware/auth");

router.get("/allUsers", [authProtect, adminProtect], async (req, res, next) => {
  try {
    //getting info of users from database
    const users = await prisma.user.findMany({
      select: {
        isAdmin: true,
        email: true,
        profile: {
          select: {
            fullName: true,
            bio: true,
            phoneNumber: true,
          },
        },
        books: {
          select: {
            title: true,
            price: true,
            description: true,
            author: true,
            id: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }); //get all users
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }

  return res.status(200).json({ message: "user fetched successfully" });
});

router.get("/:id", async (req, res, next) => {
  try {
    //get oneUser
    const { id } = req.params;
    console.log(id);

    //get info from user database
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //using validation of inputs using joi
    const valResult = userSchema.userVal.validate(req.body, {
      abortEarly: false,
    });

    const pwdResult = userSchema.pwdVal.validate(req.body.password);

    if (valResult.error) {
      return res.status(400).send(valResult.error.details);
    }

    if (pwdResult.error) {
      return res.status(400).send(pwdResult.error.details);
    }

    const { email, password } = req.body;

    //check if the user already exist on the database
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    //hash password
    const hashedPassword = await argon.hash(password);

    const newUser = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      },
    });

    if (!newUser) {
      return res.status(400).json({ message: "user not created" });
    }

    //create a profile for the new user
    const newProfile = await prisma.profile.create({
      data: {
        userId: newUser.id,
      },
    });

    if (!newProfile) {
      return res.status(400).json({ message: "profile not created" });
    }

    return res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    next(error);
  }
});

// router.put("/update", (req, res) => {
//   return res.status(203).json({ message: "user updated successfully" });
// });

// router.delete("/delete", (req, res) => {
//   return res.status(200).json({ message: "user deleted successfully" });
// });

router.put("/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    //update the user database password
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: password,
      },
    });

    res.status(203).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const deleteuser = await prisma.user.delete({
      where: {
        email: user.email,
      },
    });
    return res.status(200).json(deleteuser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
