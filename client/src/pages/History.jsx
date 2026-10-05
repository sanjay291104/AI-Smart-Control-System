import { useEffect, useState } from "react";
import { Clock3, Siren, Camera, Radio, TrafficCone, Film, Trash2 } from "lucide-react";
import api from "../services/api";

const icons={image:<Camera/>,manual:<TrafficCone/>,simulation:<Radio/>,video:<Film/>};

export default function History(){
  const [items,setItems]=useState([]); const [loading,setLoading]=useState(true);

  const fetchHistory = async () => {
    const { data } = await api.get("/history");
    setItems(data);
  };

  useEffect(()=>{
    const load = async () => {
      try {
        await fetchHistory();
      } finally {
        setLoading(false);
      }
    };
    load();
  },[]);

  const deleteItem = async (id) => {
    await api.delete(`/history/${id}`);
    setItems(prev => prev.filter(item => item._id !== id));
  };

  const clearAll = async () => {
    await api.delete("/history");
    setItems([]);
  };

  return <>
    <div className="page-title"><div><span className="eyebrow">ACTIVITY LOG</span><h1>Traffic History</h1><p>Saved analysis and emergency events for this operator.</p></div>{items.length > 0 && <button className="ghost-btn" onClick={clearAll}><Trash2 size={14}/> Clear all</button>}</div>
    <div className="glass-panel history-panel">
      {loading?<div className="empty">Loading history...</div>:items.length===0?<div className="empty"><Clock3/><h3>No activity yet</h3><p>Run an analysis or simulation and save it to see it here.</p></div>:
      <div className="history-list">{items.map(x=><div className="history-row" key={x._id}><div className="history-icon">{icons[x.type]||<Clock3/>}</div><div className="history-main"><b>{x.type.toUpperCase()} · {x.level}</b><span>{x.vehicleCount} vehicles · {x.greenSeconds}s green · {new Date(x.createdAt).toLocaleString()}</span></div><div className="history-actions">{x.isEmergency&&<span className="danger-chip"><Siren size={14}/> Emergency</span>}<button className="icon-btn" onClick={() => deleteItem(x._id)} aria-label={`Delete ${x.type} history item`}><Trash2 size={14}/></button></div></div>)}</div>}
    </div>
  </>;
}
