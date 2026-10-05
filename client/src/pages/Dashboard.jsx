import { Link } from "react-router-dom";
import { ArrowRight, Camera, CarFront, Clock3, Film, Radio, Siren, TrafficCone } from "lucide-react";
import MetricCard from "../components/MetricCard";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ analyses:0, emergencies:0, simulations:0 });
  useEffect(() => { api.get("/history/stats").then(r => setStats(r.data)).catch(()=>{}); }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-copy">
          <span className="eyebrow">INTELLIGENT URBAN MOBILITY</span>
          <h1>AI Smart Traffic<br/><span>Control Center</span></h1>
          <p>Monitor vehicle density, adapt signal timing and prioritise emergency routes using intelligent traffic analytics.</p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/image-detection">Start AI Detection <ArrowRight size={18}/></Link>
            <Link className="ghost-btn" to="/simulation">Open Simulation</Link>
          </div>
        </div>
        <div className="hero-orbit">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="hero-core"><TrafficCone size={48}/><b>AI</b><small>ONLINE</small></div>
        </div>
      </section>

      <div className="section-head"><div><span className="eyebrow">SYSTEM OVERVIEW</span><h2>Live command metrics</h2></div><span className="status-chip"><i/> Backend connected</span></div>
      <div className="metrics-grid three">
        <MetricCard icon={<Camera/>} label="AI Analyses" value={stats.analyses} hint="saved detections"/>
        <MetricCard icon={<Siren/>} label="Emergency Events" value={stats.emergencies} hint="priority events"/>
        <MetricCard icon={<Radio/>} label="Simulations" value={stats.simulations} hint="completed runs"/>
      </div>

      <div className="section-head"><div><span className="eyebrow">CONTROL MODULES</span><h2>Choose an operation</h2></div></div>
      <div className="module-grid">
        {[
          [Camera,"Image Detection","Upload a traffic image and let YOLO analyse vehicle density.","/image-detection"],
          [TrafficCone,"Manual Control","Set vehicle count manually and calculate the adaptive signal.","/manual-control"],
          [Radio,"Live Simulation","Generate changing traffic conditions and emergency events.","/simulation"],
          [Film,"Video Analysis","Analyse up to 30 video frames and get a signal recommendation.","/video-analysis"]
        ].map(([Icon,title,text,to]) => (
          <Link to={to} className="module-card" key={to}>
            <div className="module-icon"><Icon/></div><span>MODULE</span><h3>{title}</h3><p>{text}</p><b>Open module <ArrowRight size={16}/></b>
          </Link>
        ))}
      </div>

      <div className="info-strip"><Clock3/><div><b>Adaptive timing engine</b><span>Signal duration is calculated from vehicle density, with emergency override taking priority.</span></div><CarFront/></div>
    </>
  );
}
