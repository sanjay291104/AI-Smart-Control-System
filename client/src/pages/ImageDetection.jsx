import { useState } from "react";
import { Camera, CheckCircle2, UploadCloud } from "lucide-react";
import AnalysisResult from "../components/AnalysisResult";
import api from "../services/api";

export default function ImageDetection() {
  const [file,setFile]=useState(null); const [preview,setPreview]=useState(""); const [result,setResult]=useState(null); const [busy,setBusy]=useState(false); const [error,setError]=useState("");

  function choose(e) {
    const f=e.target.files?.[0]; if(!f)return;
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setError("");
  }

  async function analyze() {
    if(!file)return; setBusy(true); setError("");
    try {
      const fd=new FormData(); fd.append("image",file);
      const {data}=await api.post("/analysis/image",fd,{headers:{"Content-Type":"multipart/form-data"}});
      setResult(data.result);
    } catch(e) { setError(e.response?.data?.message || "AI service unavailable. Start the ai-service for YOLO detection."); }
    finally { setBusy(false); }
  }

  return (
    <>
      <div className="page-title"><div><span className="eyebrow">📸 AI VISION</span><h1>Image Based Detection</h1><p>YOLO-powered vehicle detection with emergency priority.</p></div></div>
      <div className="upload-layout">
        <div className="glass-panel upload-card">
          <div className="upload-zone">
            {preview ? <img src={preview} alt="Traffic preview"/> : <><div className="upload-icon"><UploadCloud/></div><h3>Drop traffic image here</h3><p>JPG, PNG or JPEG · AI will analyse vehicle density</p></>}
            <input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={choose}/>
            <button className="primary-btn">{preview ? "Choose another image" : "Browse image"}</button>
          </div>
          {file && <div className="selected-file"><CheckCircle2/><span>{file.name}</span><small>{(file.size/1024/1024).toFixed(2)} MB</small></div>}
          {error && <div className="form-error">{error}</div>}
          <button className="primary-btn wide" disabled={!file||busy} onClick={analyze}>{busy ? "Analysing with YOLO..." : <><Camera/> Analyse Traffic Image</>}</button>
        </div>
        <div className="glass-panel explainer">
          <span className="eyebrow">AI PIPELINE</span><h2>From pixels to signal</h2>
          <div className="pipeline"><span>01<small>IMAGE</small></span><b>→</b><span>02<small>YOLO</small></span><b>→</b><span>03<small>COUNT</small></span><b>→</b><span>04<small>SIGNAL</small></span></div>
          <p>Only configured vehicle classes are included in the traffic count. The result is then passed through the adaptive timing engine.</p>
        </div>
      </div>
      <AnalysisResult result={result}/>
    </>
  );
}
