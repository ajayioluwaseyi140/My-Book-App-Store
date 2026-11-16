const express = require("express");
const router = express.Router();
const prisma = require("../helper/prisma");


router.post("/create", async (req, res, next) => {
    const {name, discription} = req.body

    try {
      const newCategory = await prisma.category.create({
        data: {
            name: name,
            discription: discription
        }
      })
      
      if (newCategory) {
            res.status(201).json({message: "Category Created Successfully", newCategory})
      } else{
            return res.status(400).json({message: "category not created"})
      }
      
    } catch (error) {
        next(error);
    }

    // console.log(name, email, password);
    // return res.status(201).json({ message: "Category created successfully" });
});


router.get("/allCategories", async (req, res, next) => {
    try {
       const allCategory = await prisma.category.findMany();
        return res.status(200).json({message: "All categories fetched successfully", allCategory})
    } catch (error) {
        next(error);
    }
});


router.get("/single/:id", async (req, res, next) => {
   try {
      //get oneUser
      const { id } = req.params;
      console.log(id);

      //get info from user database
      const category = await prisma.category.findUnique({
         where:{id: Number(id)}
      })

      if (category) {
         return res.status(200).json({message: "category fetched successfully",category});
      } else{
         return res.status(404).json({message: "category not found"});
      }
   } catch (error) {
      console.log(error);
   }
 } )


router.put("/update", async (req, res) => { 
   try {
      const {name, description} = req.body;
      //get oneUser
      const { id } = req.params;
      const updateCategory = await prisma.category.update({
         where: {id: Number(id)},
         data: {
            name: name,
            description: description
         }
      })

      return res.status(203).json({message: "category updated successfully", updateCategory})
   } catch (error) {
      next(error)
   }
 })



module.exports = router;