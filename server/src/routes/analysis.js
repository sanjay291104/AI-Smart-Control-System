import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import TrafficHistory from "../models/TrafficHistory.js";
import {protect} from "../middleware/auth.js";
import {sendToAI} from "../services/aiService.js";

const router=express.Router();
router.use(protect);

const upload=multer({
  dest:path.resolve("uploads"),
  limits:{fileSize:80*1024*1024},
  fileFilter:(req,file,cb)=>{
    const ok=req.path==="/image" ? /^image\/(jpeg|png|jpg)$/.test(file.mimetype) : /^video\/(mp4|quicktime|x-msvideo)$/.test(file.mimetype);
    cb(ok?null:new Error("Unsupported file type"),ok);
  }
});

async function process(req,res,next,kind){
  if(!req.file)return res.status(400).json({message:`${kind} file is required`});
  try{
    const ai=await sendToAI(req.file.path,kind);
    const result=ai.result;
    const saved=await TrafficHistory.create({...result,type:kind,user:req.user.id});
    res.json({result,historyId:saved._id});
  }catch(e){
    const status=e.response?.status===503?503:502;
    res.status(status).json({message:"AI service unavailable. Start the ai-service and try again.",detail:e.response?.data?.detail||e.message});
  }finally{fs.unlink(req.file.path,()=>{});}
}

router.post("/image",upload.single("image"),(req,res,next)=>process(req,res,next,"image"));
router.post("/video",upload.single("video"),(req,res,next)=>process(req,res,next,"video"));
export default router;
