import { CarFront, ShieldCheck, Zap, BrainCircuit } from "lucide-react";

export default function AuthShell({ children, title, subtitle }) {
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-glow" />
        <div className="auth-brand"><div className="brand-mark"><CarFront /></div><b>SMART<span>TRAFFIC</span></b></div>
        <div className="auth-hero">
          <span className="eyebrow">AI TRAFFIC INTELLIGENCE</span>
          <h1>Smarter signals.<br /><span>Safer streets.</span></h1>
          <p>Real-time traffic analysis, adaptive signal control and emergency prioritisation in one command center.</p>
          <div className="auth-features">
            <span><BrainCircuit /> AI vehicle detection</span>
            <span><Zap /> Dynamic signal timing</span>
            <span><ShieldCheck /> Emergency priority</span>
          </div>
        </div>
      </div>
      <div className="auth-form-area">
        <div className="auth-form-card">
          <div className="mobile-auth-brand"><CarFront /></div>
          <span className="eyebrow">{title}</span>
          <h2>{subtitle}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
