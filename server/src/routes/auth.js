import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router=express.Router();
const tokenFor=u=>jwt.sign({id:u._id,email:u.email,name:u.name},process.env.JWT_SECRET,{expiresIn:"7d"});
const publicUser=u=>({id:u._id,name:u.name,email:u.email});

router.post("/register",async(req,res)=>{
  try{
    const {name,email,password}=req.body;
    if(!name||!email||!password)return res.status(400).json({message:"Name, email and password are required"});
    if(password.length<6)return res.status(400).json({message:"Password must be at least 6 characters"});
    if(await User.findOne({email}))return res.status(409).json({message:"Email already registered"});
    const hash=await bcrypt.hash(password,10);
    const u=await User.create({name,email,password:hash});
    res.status(201).json({token:tokenFor(u),user:publicUser(u)});
  }catch(e){res.status(500).json({message:"Registration failed"})}
});

router.post("/login",async(req,res)=>{
  try{
    const {email,password}=req.body; const u=await User.findOne({email});
    if(!u||!(await bcrypt.compare(password,u.password)))return res.status(401).json({message:"Invalid email or password"});
    res.json({token:tokenFor(u),user:publicUser(u)});
  }catch{res.status(500).json({message:"Login failed"})}
});
export default router;
