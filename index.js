import express from 'express'
import dotenv from 'dotenv'
import Razorpay from 'razorpay';


const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
  });
  