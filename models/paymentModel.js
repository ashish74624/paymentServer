import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  productId:{
    type:Number,
    required: true,
  },
  image:{
    type:String,
    required: true,
  },
  title:{
    type:String,
    required: true,
  },
  quantity:{
    type:Number,
    default:1,
    validate:{
      validator: function(value){
        return value>=1
      },
      message:"Quantity can't be less than 1"
    }
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);