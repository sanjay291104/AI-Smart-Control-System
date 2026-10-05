import os
import math
import tempfile
from typing import Dict, List

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from ultralytics import YOLO

app = FastAPI(title="Smart Traffic AI Service", version="1.0.0")

MODEL_NAME = os.getenv("YOLO_MODEL", "yolov8n.pt")
model = YOLO(MODEL_NAME)

VEHICLE_CLASSES = {
    "car", "bus", "truck", "motorcycle", "bicycle",
    "scooter", "van", "pickup"
}
EMERGENCY_CLASSES = {"ambulance", "fire truck", "police car", "police"}

def traffic_logic(vehicle_count: int, is_emergency: bool = False) -> Dict:
    # Same thresholds as the uploaded Streamlit application.
    if is_emergency:
        return {"level":"🚨 EMERGENCY","greenSeconds":90,"load":100,"confidence":95}
    if vehicle_count < 15:
        return {"level":"🟢 LOW","greenSeconds":15,"load":15,"confidence":85}
    if vehicle_count < 30:
        return {"level":"🟡 MEDIUM","greenSeconds":30,"load":50,"confidence":80}
    if vehicle_count < 50:
        return {"level":"🟠 HIGH","greenSeconds":50,"load":80,"confidence":75}
    return {"level":"🔴 CRITICAL","greenSeconds":70,"load":100,"confidence":70}

def inspect(result):
    vehicles: List[str] = []
    emergencies: List[str] = []
    names = result.names if hasattr(result, "names") else model.names
    if result.boxes is not None:
        for cls in result.boxes.cls:
            label = str(names[int(cls)]).lower()
            if label in VEHICLE_CLASSES:
                vehicles.append(label)
            if any(e in label for e in EMERGENCY_CLASSES):
                emergencies.append(label)
    is_emergency = len(emergencies) > 0
    logic = traffic_logic(len(vehicles), is_emergency)
    return {
        "vehicleCount": len(vehicles),
        "detectedVehicles": vehicles,
        "emergencyVehicles": emergencies,
        "isEmergency": is_emergency,
        **logic
    }

@app.get("/health")
def health():
    return {"ok": True, "model": MODEL_NAME}

@app.post("/analyze/image")
async def analyze_image(image: UploadFile = File(...)):
    suffix = os.path.splitext(image.filename or "")[1] or ".jpg"
    data = await image.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as f:
        f.write(data)
        temp_path = f.name
    try:
        result = model(temp_path, verbose=False)[0]
        return {"result": inspect(result)}
    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)

@app.post("/analyze/video")
async def analyze_video(video: UploadFile = File(...)):
    suffix = os.path.splitext(video.filename or "")[1] or ".mp4"
    data = await video.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as f:
        f.write(data)
        temp_path = f.name

    counts = []
    emergencies = []
    frame_num = 0
    max_frames = 30

    try:
        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            raise HTTPException(400, "Unable to open video file")

        while frame_num < max_frames:
            ok, frame = cap.read()
            if not ok:
                break
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = model(rgb, verbose=False)
            info = inspect(results[0])
            counts.append(info["vehicleCount"])
            emergencies.append(info["isEmergency"])
            frame_num += 1
        cap.release()

        if not counts:
            raise HTTPException(400, "No readable frames found")

        avg = int(np.mean(counts))
        minimum = int(min(counts))
        maximum = int(max(counts))
        std = float(np.std(counts))
        variance = float(np.var(counts))
        emergency_count = int(sum(emergencies))
        logic = traffic_logic(avg, emergency_count > 0)

        result = {
            **logic,
            "vehicleCount": avg,
            "detectedVehicles": [],
            "emergencyVehicles": [],
            "isEmergency": emergency_count > 0,
            "videoStats": {
                "minVehicles": minimum,
                "maxVehicles": maximum,
                "avgVehicles": avg,
                "stdDev": round(std, 2),
                "variance": round(variance, 2)
            },
            "frames": frame_num,
            "emergencyCount": emergency_count,
            "frameCounts": counts
        }
        return {"result": result}
    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)
