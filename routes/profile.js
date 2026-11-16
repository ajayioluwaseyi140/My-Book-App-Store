const express = require("express");
const router = express.Router();
const prisma = require("../helper/prisma");
const authProtect = require("../middleware/auth");
const multer = require("multer");
const path = require("path");


//Multer storage config
const storage = multer.diskStorage({
 destination: function (req, file, cb) {
 cb(null, "public/avatar"); // Destination folder for uploaded files
 },
 filename: function (req, file, cb) {
 // Use a unique filename for the uploaded file
 const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() *
1e9);
 const ext = path.extname(file.originalname); // Get file extension
 cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Append extension
 },
});
const upload = multer({ storage: storage });
// Endpoint for handling file uploads



router.post(
 "/upload",[authProtect],
 upload.single("image"), // Specify the field name for the uploaded file and it should be same as key in postman
 async (req, res, next) => {
 console.log("running");
 console.log(req.file);

 try {
 const { destination, filename } = req.file;
 const profile = await prisma.profile.update({
 where: {
 userId: Number(req.user.sub),
 },
 data: {
 avatar: `${destination}/${filename}`,
 },
 });
 // Access uploaded file information through req.file
 return res.json({ message: "File uploaded successfully" });
 } catch (error) {
  next(error);
 }
 }
);




// router.get("/allProfile", async (req, res, next) => {
//     try {
//        const allProfile = await prisma.profile.findMany();
//         return res.status(200).json(allProfile)
//     } catch (error) {
//         next(error);
//     }
//     return res.status(200).json({ message: "Profiles fetched successfully" });
// });


// updating user profile with authentication(auth)
router.put("/update",authProtect, async (req, res, next) => {
    try {
        const {fullName, bio, phoneNumber} = req.body
        const {sub, isAdmin} = req.user

        if(fullName === "") {
            return res.status(400).json({message: "fullName is required"})
        }
        //update full name on database
        const profile = await prisma.profile.update({
            where: { userId: Number(sub) },
            data: { fullName, bio, phoneNumber }
        })
        return res.status(201).json({message: "profile updated successfully", profile: profile})
    } catch (error) {
        next(error)
    }
});


router.get("/single", authProtect, async (req, res, next) => {
  try {
    //get oneUser
    const { sub, isAdmin} = req.user;

    //get info from user database
    const profile = await prisma.profile.findUnique({
      where: {
        userId: Number(sub),
      },
    });


    //store full URL intead of local path
    const profileImage = `${req.protocol}://${req.get("host")}/${profile.avatar}`;

    if (profile) {
      return res.status(200).json({ message: "profile fetched successfully", profile: {fullName: profile.fullName,avatar: profileImage} });
    } else {
      return res.status(404).json({ message: "profile not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;