import express from "express";
import validateLogin from "../middleware/validateLogin.js";
import User from "../models/User.js";
import Order from "../models/Order.js";


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
        // console.log(userData);
        
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












// delete item from cart
router.post("/deleteFromCart",validateLogin,async (req , res)=> {
    sucess=false;
    try {
        const { itemId } = req.body;
        const userId = req.user._id; 

        const userData = await User.findById(userId);
        let cartData = userData.cartData;
        // console.log(userData);
        

        let flag=true;

        
       cartData.map((cartItem)=>{
        if(cartItem.itemId==itemId){
            if(cartItem.quantity>0){
            cartItem.quantity-=1;
            flag=false;
            }
        }
       })
       
       cartData=cartData.filter(cartItem =>{
         return cartItem.quantity!=0});
       if(flag){
        res.json({ sucess, message: "Either Product not exist or Quantity in cart is already Zero" });
       } 

        await User.findByIdAndUpdate(userId, {cartData} );
        sucess=true;
        res.json({ sucess, message: "deleted from Cart" });  

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








// Create an order
router.post("/order",validateLogin,async (req , res)=> {
    sucess=false;
    try {
        const { 
            userId,
            name,
            email,
            address,
            total_price,
            order_status ,
            products
        } = req.body;
        const id = req.user._id; 

        const userData = await User.findById(id);
        if(!userData){
            res.status(400).json({sucess,message:"User Not found"})
        }
        
        const orderedData = await Order.create({
            userId,
            name,
            email,
            address,
            total_price,
            order_status,
            products

        });
        const orderHistory = userData.orderHistory
        orderHistory.push(orderedData._id);
        await User.findByIdAndUpdate(userId, { orderHistory });
        // console.log(orderedData._id);
        
        sucess=true;
        res.json({ sucess, message: "Order succesfull", data:orderedData});
    } catch (error) {
        console.log(error);
        res.json({ sucess, message: error.message });
    }
})


// get user order list
router.get("/getallorders",validateLogin,async (req , res)=> {
    sucess=false;
    try {
        const userId = req.user._id;
        const userData = await User.findById(userId);
        let orderHistory = userData.orderHistory;
        sucess=true;
        res.json({ sucess, orderHistory });
    } catch (error) {
        console.log(error);
        res.json({ sucess, message: error.message });
    }
})



// get single order details
router.get("/getsingleorder",validateLogin,async (req , res)=> {
    sucess=false;
    try {
        const orderId = req.body.orderId;
        const orderDetails = await Order.findById(orderId);
        sucess=true;
        res.json({ sucess, orderDetails });
    } catch (error) {
        console.log(error);
        res.json({ sucess, message: error.message });
    }
})

 


export default router;