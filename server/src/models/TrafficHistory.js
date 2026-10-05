import mongoose from "mongoose";
const schema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  type:{type:String,enum:["image","manual","simulation","video"],required:true},
  vehicleCount:{type:Number,default:0},
  level:{type:String,default:"UNKNOWN"},
  greenSeconds:{type:Number,default:0},
  load:{type:Number,default:0},
  confidence:{type:Number,default:0},
  isEmergency:{type:Boolean,default:false},
  emergencyVehicles:[String],
  detectedVehicles:[String],
  frames:{type:Number},
  emergencyCount:{type:Number},
  videoStats:{
    minVehicles:Number,maxVehicles:Number,avgVehicles:Number,stdDev:Number,variance:Number
  }
},{timestamps:true});
export default mongoose.model("TrafficHistory",schema);
