import { useState } from "react";
import { Film, UploadCloud, BarChart3 } from "lucide-react";
import api from "../services/api";
import AnalysisResult from "../components/AnalysisResult";

export default function VideoAnalysis() {
  const [file,setFile]=useState(null),[preview,setPreview]=useState(""),[result,setResult]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState("");

  function choose(e){const f=e.target.files?.[0];if(!f)return;setFile(f);setPreview(URL.createObjectURL(f));setResult(null);setError("");}
  async function analyze(){
    if(!file)return;setBusy(true);setError("");
    try{const fd=new FormData();fd.append("video",file);const {data}=await api.post("/analysis/video",fd,{headers:{"Content-Type":"multipart/form-data"}});setResult(data.result);}
    catch(e){setError(e.response?.data?.message||"Video analysis failed. Start the AI service.");}
    finally{setBusy(false);}
  }

  return (
    <>
      <div className="page-title"><div><span className="eyebrow">📹 FRAME ANALYTICS</span><h1>Video Traffic Analysis</h1><p>Analyse up to 30 frames and calculate an optimal signal recommendation.</p></div></div>
      <div className="video-layout">
        <div className="glass-panel upload-card">
          <div className="upload-zone video-zone">
            {preview ? <video src={preview} controls/> : <><div className="upload-icon"><Film/></div><h3>Upload a traffic video</h3><p>MP4, AVI or MOV</p></>}
            <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo,.mp4,.avi,.mov" onChange={choose}/>
            <button className="primary-btn">Choose video</button>
          </div>
          {error&&<div className="form-error">{error}</div>}
          <button className="primary-btn wide" disabled={!file||busy} onClick={analyze}>{busy?"Processing 30 frames...":<><BarChart3/> Analyse Video</>}</button>
        </div>
        <div className="glass-panel explainer">
          <span className="eyebrow">PROCESSING MODEL</span><h2>Frame-by-frame analysis</h2>
          <ul className="feature-list"><li>Samples the first 30 readable frames</li><li>Counts configured vehicle classes</li><li>Tracks emergency detections</li><li>Calculates average, peak, minimum, standard deviation and variance</li><li>Recommends signal timing from the average load</li></ul>
        </div>
      </div>
      <AnalysisResult result={result}/>
      {result?.videoStats && <div className="metrics-grid three"><div className="metric-card"><span>Minimum</span><strong>{result.videoStats.minVehicles}</strong></div><div className="metric-card"><span>Peak</span><strong>{result.videoStats.maxVehicles}</strong></div><div className="metric-card"><span>Std Dev</span><strong>{result.videoStats.stdDev}</strong></div></div>}
    </>
  );
}
