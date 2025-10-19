import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

import { body, validationResult } from "express-validator";
import syncProductsFromERP from "../middleware/syncProductsFromERP.js";
import Error from "../models/Error.js";

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
      // weight:req.body.weight,
      price:req.body.price,
      avl_peices:req.body.avl_peices,
      productId:req.body.productId
    });
    sucess = true;
    res.json({ sucess, msg:"Product added successfully", data:product });
  }
);

//update product
router.post(
  "/updateproduct",
  [
    body("name", "Name Should be minimm 3 Charecters").isLength({ min: 3 }),
    body("desc", "description Should be minimm 3 Charecters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    sucess = false;
    const results = validationResult(req);
    if (!results.isEmpty()) {
      return res.status(404).json({ sucess, error: results.array() });
    }

    const isIdExists=await Product.findById(req.body.id);
    if(!isIdExists){
      return res.status(404).json({ sucess, message: "product you are trying to update does not exist " });

    }
    
    let product = await Product.findByIdAndUpdate(req.body.id,{
      name: req.body.name,
      desc:req.body.desc,
      // weight:req.body.weight,
      price:req.body.price,
      avl_peices:req.body.avl_peices,
    });
    sucess = true;
    res.json({ sucess, msg:"Product updated successfully", data:product });
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
      await syncProductsFromERP()
        const products = await Product.find({});
        sucess=true;
        res.json({sucess,products})
    } catch (error) {
        console.log(error);
        res.json({sucess,message:error.message})
    }
    

})


// get specific product by id
router.post("/fetchProductById",async(req,res)=>{
        sucess=false;
    try {
        const products = await Product.findById(req.body.itemId);
        sucess=true;
        res.json({sucess,products})
    } catch (error) {
        console.log(error);
        res.json({sucess,message:error.message})
    }
    

})

/// get all errors
router.get("/fetchallerrors",async(req,res)=>{
        sucess=false;
    try {
        const Errors = await Error.find({});
        sucess=true;
        res.json({sucess,Errors})
    } catch (error) {
        console.log(error);
        res.json({sucess,message:error.message})
    }
    

})
 

export default router;