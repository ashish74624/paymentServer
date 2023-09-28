import express from 'express'
import dotenv from 'dotenv'
import Razorpay from 'razorpay';
import cors from 'cors'
import bodyParser from 'body-parser';
import crypto from 'crypto'
import {Payment} from './models/paymentModel.js'
import mongoose from 'mongoose';

const app = express();

app.use(cors())
app.use(express())
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("Connected to MongoDb")
}).catch(()=>{
  console.log("Not connected to MongoDb")
})

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET ,
});

// app.get('/getKey',(req,res)=>{
//     try{
            // res.json({key:"rzp_test_XpNRA8Qw0nU8TX"}) // WE DID IT IN FRONTEND
//     }catch{

//     }
// })

app.post('/checkout', async (req,res)=>{
    try{
        const options = {
            amount: Number(req.body.amount * 100 *83),
            currency: "INR",
          };
          const order = await instance.orders.create(options);
    
          res.status(200).json({order:order,done:true})  
    }catch{
        res.status(400).json({done:false})  
    }
})

app.post('/paymentVerification/:id',async(req,res)=>{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      productId:req.params.id,
      razorpay_order_id:razorpay_order_id,
      razorpay_payment_id:razorpay_payment_id,
      razorpay_signature:razorpay_signature,
    });

    res.redirect(
      `${process.env.FRONTEND}/payment?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      done: false,
    });
  }
})
  
app.listen(process.env.PORT, () =>
    console.log(`Server started on port ${process.env.PORT}`)
);  