import express from "express";
import validateLogin from "../middleware/validateLogin.js";
import User from "../models/User.js";

const router = express.Router();


let sucess=false;


// add items to cart
router.post("/addToCart",validateLogin,async (req , res)=> {
    sucess=false;
    try {
        const { itemId } = req.body;
        const userId = req.user._id; 

        const userData = await User.findById(userId);
        let cartData = userData.cartData;
        console.log(userData);
        
       const newItem={itemId,quantity:1};

        let flag=true;
       cartData.map((cartItem)=>{
        if(cartItem.itemId==itemId){
            cartItem.quantity+=1;
            flag=false;
        }
       })
       if(flag){
            cartData.push(newItem);
       }

        await User.findByIdAndUpdate(userId, {cartData} );
        sucess=true;
        res.json({ sucess, message: "Added To Cart" });

    } catch (error) {
        console.log(error);
        res.json({ sucess, message: error.message });
    }
})



 
// update items in cart
router.post("/updateCart",validateLogin,async (req , res)=> {
    sucess=false;
    try {
        const { itemId , quantity } = req.body;
        const  userId=req.user._id;
        const userData = await User.findById(userId);
        let cartData = userData.cartData;

        const newItem={itemId,quantity};

        let flag=true;
        cartData.map((cartItem)=>{
        if(cartItem.itemId==itemId){
            cartItem.quantity=quantity;
            flag=false;
            }
        })
        if(flag){
            cartData.push(newItem);
        } 




        await User.findByIdAndUpdate(userId, { cartData });
        sucess=true;
        res.json({ sucess, message: "Cart Updated" });

    } catch (error) {
        console.log(error);
        res.json({ sucess, message: error.message });
    }
}
)



//get user cart

router.get("/getUserCart",validateLogin,async (req , res)=> {
    sucess=false;
    try {
        const userId = req.user._id;
        const userData = await User.findById(userId);
        let cartData = userData.cartData;
        sucess=true;
        res.json({ sucess, cartData });

    } catch (error) {
        console.log(error);
        res.json({ sucess, message: error.message });
    }
})
 


export default router;