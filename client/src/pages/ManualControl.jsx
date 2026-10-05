import { useMemo, useState } from "react";
import { AlertTriangle, Gauge, RotateCcw, Timer, TrafficCone } from "lucide-react";
import AnalysisResult from "../components/AnalysisResult";
import api from "../services/api";

function calculate(vehicleCount, emergency) {
  if (emergency) return { level:"🚨 EMERGENCY", greenSeconds:90, load:100, confidence:95, isEmergency:true, vehicleCount, emergencyVehicles:["Manual Emergency"] };
  if (vehicleCount < 15) return { level:"🟢 LOW", greenSeconds:15, load:15, confidence:85, isEmergency:false, vehicleCount };
  if (vehicleCount < 30) return { level:"🟡 MEDIUM", greenSeconds:30, load:50, confidence:80, isEmergency:false, vehicleCount };
  if (vehicleCount < 50) return { level:"🟠 HIGH", greenSeconds:50, load:80, confidence:75, isEmergency:false, vehicleCount };
  return { level:"🔴 CRITICAL", greenSeconds:70, load:100, confidence:70, isEmergency:false, vehicleCount };
}

export default function ManualControl() {
  const [vehicles,setVehicles] = useState(30);
  const [emergency,setEmergency] = useState(false);
  const result = useMemo(() => calculate(Number(vehicles), emergency), [vehicles,emergency]);

  async function save() {
    await api.post("/history", { type:"manual", ...result });
  }

  return (
    <>
      <div className="page-title"><div><span className="eyebrow">✏️ MANUAL CONTROL</span><h1>Adaptive Traffic Control</h1><p>Test the same signal logic without uploading media.</p></div></div>
      <div className="control-layout">
        <div className="glass-panel control-panel">
          <div className="panel-title"><span><TrafficCone/> Traffic Input</span></div>
          <label className="range-label">Total vehicles <b>{vehicles}</b></label>
          <input className="range" type="range" min="0" max="500" value={vehicles} onChange={e=>setVehicles(e.target.value)}/>
          <div className="range-endpoints"><span>0</span><span>250</span><span>500</span></div>
          <div className="number-input"><Gauge/><input type="number" min="0" max="500" value={vehicles} onChange={e=>setVehicles(Math.max(0,Math.min(500,e.target.value)))}/><span>vehicles</span></div>
          <label className={`emergency-toggle ${emergency ? "active":""}`}>
            <input type="checkbox" checked={emergency} onChange={e=>setEmergency(e.target.checked)}/>
            <AlertTriangle/><span><b>Emergency Priority</b><small>Override signal timing for priority vehicles</small></span>
          </label>
          <div className="control-actions"><button className="ghost-btn" onClick={()=>{setVehicles(30);setEmergency(false)}}><RotateCcw/> Reset</button><button className="primary-btn" onClick={save}><Timer/> Save Analysis</button></div>
        </div>
        <AnalysisResult result={result}/>
      </div>
    </>
  );
}
