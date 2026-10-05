import { useEffect, useState } from "react";
import { BrainCircuit, Clock3, Gauge, Siren, CarFront, X } from "lucide-react";
import TrafficLight from "./TrafficLight";
import MetricCard from "./MetricCard";

const signalFor = (level) => {
  if (level.includes("EMERGENCY")) return "red";
  if (level.includes("LOW")) return "green";
  if (level.includes("MEDIUM") || level.includes("HIGH")) return "yellow";
  return "red";
};

export default function AnalysisResult({ result }) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!result?.isEmergency) {
      setShowPopup(false);
      return;
    }

    setShowPopup(true);
    const timer = window.setTimeout(() => setShowPopup(false), 5000);
    return () => window.clearTimeout(timer);
  }, [result?.isEmergency, result?.emergencyVehicles, result?.vehicleCount]);

  if (!result) return null;

  const signal = signalFor(result.level);
  const confidenceLevel =
    result.confidence >= 80 ? "HIGH" : result.confidence >= 70 ? "MEDIUM" : "LOW";

  return (
    <section className="result-stack">
      {showPopup && (
        <div className="emergency-popup-backdrop" aria-live="assertive">
          <div className="emergency-popup">
            <div className="emergency-popup-icon"><Siren size={24} /></div>
            <div>
              <b>EMERGENCY VEHICLE DETECTED</b>
              <span>{result.emergencyVehicles?.join(", ") || "Emergency priority triggered"}</span>
            </div>
            <button type="button" className="emergency-close" onClick={() => setShowPopup(false)} aria-label="Close emergency alert">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {result.isEmergency && (
        <div className="emergency-alert">
          <Siren size={22} />
          <div><b>EMERGENCY VEHICLE DETECTED</b><span>{result.emergencyVehicles?.join(", ")}</span></div>
        </div>
      )}

      <div className="metrics-grid three">
        <MetricCard icon={<CarFront />} label="Vehicles" value={result.vehicleCount} hint="AI vehicle count" />
        <MetricCard icon={<Gauge />} label="Traffic Status" value={result.level.replace(/[^\w\s]/g, "").trim()} hint={`${result.load}% traffic load`} />
        <MetricCard icon={<Clock3 />} label="Green Signal" value={`${result.greenSeconds}s`} hint="recommended duration" />
      </div>

      <div className="result-grid">
        <div className="glass-panel signal-panel">
          <div className="panel-title"><span><TrafficLight /> Signal State</span><em>{result.level}</em></div>
          <TrafficLight signal={signal} />
          <div className="signal-time"><b>{result.greenSeconds}s</b><span>recommended green phase</span></div>

          <div className="signal-recommendation">
            <div className="recommendation-head">
              <span>AI Robo Suggestion</span>
              <b>{result.greenSeconds}s</b>
            </div>
            <div className="suggestion-track">
              <div className="suggestion-fill" style={{ width: `${Math.min((result.greenSeconds / 90) * 100, 100)}%` }} />
              <div className="ai-robot" style={{ left: `${Math.min((result.greenSeconds / 90) * 100, 100)}%` }}>
                🤖
              </div>
            </div>
            <small>Adaptive signal timing recommendation</small>
          </div>
        </div>

        <div className="glass-panel">
          <div className="panel-title"><span><BrainCircuit /> AI Decision</span><em>{confidenceLevel}</em></div>
          <div className="ai-flow">
            <span>Detecting</span><b>→</b><span>Processing</span><b>→</b><span>Decision</span><b>→</b><span>Applied</span>
          </div>
          <div className="confidence">
            <div><span>AI Confidence</span><b>{result.confidence}%</b></div>
            <div className="confidence-track"><i style={{ width: `${result.confidence}%` }} /></div>
          </div>
          <div className="density">
            <div className="density-track"><i style={{ width: `${Math.min(result.load, 100)}%` }} /></div>
            <span>Traffic density · {result.load}%</span>
          </div>
        </div>
      </div>

      {result.detectedVehicles?.length > 0 && (
        <div className="glass-panel">
          <div className="panel-title"><span>Vehicle Type Breakdown</span></div>
          <div className="vehicle-tags">
            {Object.entries(result.detectedVehicles.reduce((a, v) => {
              a[v] = (a[v] || 0) + 1; return a;
            }, {})).map(([type, count]) => (
              <div className="vehicle-tag" key={type}><CarFront size={16} /> {type} <b>{count}</b></div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
