import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

import { body, validationResult } from "express-validator";

const router = express.Router();


let sucess=false;

//addProduct
router.post(
  "/addProduct",
  [
    body("name", "Name Should be minimm 3 Charecters").isLength({ min: 3 }),
    body("desc", "description Should be minimm 3 Charecters").isLength({ min: 5 }),
    // body("price", "please enter price").isEmpty(),
  ],
  async (req, res) => {
    sucess = false;
    const results = validationResult(req);
    if (!results.isEmpty()) {
      return res.status(404).json({ sucess, error: results.array() });
    }
    
    let product = await Product.create({
      name: req.body.name,
      desc:req.body.desc,
      price:req.body.price
    });
    sucess = true;
    res.json({ sucess, msg:"Product added successfully", data:product });
  }
);



// delete existing products
router.post("/deleteProduct",async(req,res)=>{
    sucess=false;
    try {
        const id = await Product.findByIdAndDelete(req.body.id);
        if(!id){
            res.json({sucess,message:"you are trying to delete product which is already deleted / or that doesnot exist"})
        }
        sucess=true;
        res.json({sucess,message:"Product Removed sucessfully"})
    } catch (error) {
        console.log(error);
        res.json({sucess,message:error.message})
    }
    

})




//fetch all existing products (fetchAllProducts)
router.get("/fetchAllProducts",async(req,res)=>{
        sucess=false;
    try {
        const products = await Product.find({});
        sucess=true;
        res.json({sucess,products})
    } catch (error) {
        console.log(error);
        res.json({sucess,message:error.message})
    }
    

})

 

export default router;