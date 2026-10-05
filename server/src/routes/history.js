import express from "express";
import TrafficHistory from "../models/TrafficHistory.js";
import {protect} from "../middleware/auth.js";

const router=express.Router();
router.use(protect);

router.post("/",async(req,res)=>{
  try{const item=await TrafficHistory.create({...req.body,user:req.user.id});res.status(201).json(item);}
  catch{res.status(400).json({message:"Could not save history"})}
});
router.get("/",async(req,res)=>{
  const items=await TrafficHistory.find({user:req.user.id}).sort({createdAt:-1}).limit(100);
  res.json(items);
});
router.delete("/",async(req,res)=>{
  try{
    await TrafficHistory.deleteMany({user:req.user.id});
    res.json({message:"History cleared"});
  } catch {
    res.status(400).json({message:"Could not clear history"});
  }
});
router.delete("/:id",async(req,res)=>{
  try{
    const result = await TrafficHistory.deleteOne({_id:req.params.id,user:req.user.id});
    if (!result.deletedCount) return res.status(404).json({message:"History item not found"});
    res.json({message:"History item deleted"});
  } catch {
    res.status(400).json({message:"Could not delete history item"});
  }
});
router.get("/stats",async(req,res)=>{
  const [analyses,emergencies,simulations]=await Promise.all([
    TrafficHistory.countDocuments({user:req.user.id}),
    TrafficHistory.countDocuments({user:req.user.id,isEmergency:true}),
    TrafficHistory.countDocuments({user:req.user.id,type:"simulation"})
  ]);
  res.json({analyses,emergencies,simulations});
});
export default router;
