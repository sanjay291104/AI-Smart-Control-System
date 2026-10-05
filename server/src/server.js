import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/auth.js";
import historyRoutes from "./routes/history.js";
import analysisRoutes from "./routes/analysis.js";

const app=express();
app.use(cors({origin:process.env.CLIENT_URL||"http://localhost:5173"}));
app.use(express.json());
app.get("/api/health",(req,res)=>res.json({ok:true,service:"traffic-backend"}));
app.use("/api/auth",authRoutes);
app.use("/api/history",historyRoutes);
app.use("/api/analysis",analysisRoutes);

const port=process.env.PORT||5000;
connectDB().then(()=>app.listen(port,()=>console.log(`Server running on http://localhost:${port}`)))
.catch(e=>{console.error(e);process.exit(1)});
