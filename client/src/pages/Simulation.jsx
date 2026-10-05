import { useEffect, useRef, useState } from "react";
import { Play, Square, Siren, Radio, Gauge, Clock3 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import api from "../services/api";
import AnalysisResult from "../components/AnalysisResult";

function calculate(v,e) {
  if(e)return {level:"🚨 EMERGENCY",greenSeconds:90,load:100,confidence:95,isEmergency:true,vehicleCount:v,emergencyVehicles:["Simulation emergency"]};
  if(v<15)return {level:"🟢 LOW",greenSeconds:15,load:15,confidence:85,isEmergency:false,vehicleCount:v};
  if(v<30)return {level:"🟡 MEDIUM",greenSeconds:30,load:50,confidence:80,isEmergency:false,vehicleCount:v};
  if(v<50)return {level:"🟠 HIGH",greenSeconds:50,load:80,confidence:75,isEmergency:false,vehicleCount:v};
  return {level:"🔴 CRITICAL",greenSeconds:70,load:100,confidence:70,isEmergency:false,vehicleCount:v};
}

export default function Simulation() {
  const [running,setRunning]=useState(false), [chance,setChance]=useState(10), [data,setData]=useState([]), [current,setCurrent]=useState(null);
  const [emergencies,setEmergencies]=useState(0); const frame=useRef(0); const timer=useRef(null);

  useEffect(()=>()=>clearInterval(timer.current),[]);
  useEffect(()=>{
    if(!running)return;
    timer.current=setInterval(()=>{
      frame.current+=1; const vehicles=Math.floor(Math.random()*86)+10; const emergency=Math.random()*100<=chance;
      const result=calculate(vehicles,emergency);
      setCurrent(result); setData(prev=>[...prev.slice(-59),{frame:frame.current,vehicles}]);
      if(emergency)setEmergencies(x=>x+1);
      if(frame.current>=300){clearInterval(timer.current);setRunning(false);}
    },500);
    return()=>clearInterval(timer.current);
  },[running,chance]);

  function start(){clearInterval(timer.current);frame.current=0;setData([]);setEmergencies(0);setCurrent(null);setRunning(true);}
  function stop(){clearInterval(timer.current);setRunning(false);}
  async function save(){if(current)await api.post("/history",{type:"simulation",...current,frames:frame.current,emergencyCount:emergencies});}

  const avg=data.length?Math.round(data.reduce((a,b)=>a+b.vehicles,0)/data.length):0;

  return (
    <>
      <div className="page-title"><div><span className="eyebrow">🎥 LIVE SIMULATION</span><h1>Traffic Scenario Lab</h1><p>Generate changing traffic conditions with random emergency events.</p></div><div className="live-pill big"><i/> {running?"SIMULATION RUNNING":"READY"}</div></div>
      <div className="sim-controls glass-panel"><button className="primary-btn" onClick={start}><Play/> Start</button><button className="ghost-btn" onClick={stop}><Square/> Stop</button><label>Emergency probability <b>{chance}%</b><input type="range" min="0" max="30" value={chance} onChange={e=>setChance(e.target.value)}/></label></div>
      <div className="metrics-grid three">
        <div className="metric-card"><div className="metric-icon"><Radio/></div><div><span>Frames</span><strong>{frame.current}</strong></div></div>
        <div className="metric-card"><div className="metric-icon red"><Siren/></div><div><span>Emergencies</span><strong>{emergencies}</strong></div></div>
        <div className="metric-card"><div className="metric-icon"><Gauge/></div><div><span>Average vehicles</span><strong>{avg}</strong></div></div>
      </div>
      <div className="chart-panel glass-panel"><div className="panel-title"><span>Vehicle count trend</span><small>{data.length ? "LIVE DATA" : "WAITING"}</small></div><div className="chart"><ResponsiveContainer width="100%" height={280}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={0.12}/><XAxis dataKey="frame"/><YAxis domain={[0,100]}/><Tooltip/><Line type="monotone" dataKey="vehicles" stroke="#8b5cf6" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer></div></div>
      {current && <AnalysisResult result={current}/>}
      {current && !running && <button className="primary-btn" onClick={save}><Clock3/> Save Simulation Summary</button>}
    </>
  );
}
