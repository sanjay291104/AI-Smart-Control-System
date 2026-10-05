# Conversion mapping

The uploaded source contains a Streamlit app with:
- YOLO model loading
- vehicle-only counting
- emergency detection
- dynamic traffic logic
- image based detection
- manual count
- live simulation
- video analysis
- emergency history

The MERN conversion maps them as follows:

| Original | MERN version |
|---|---|
| Streamlit UI | React/Vite |
| session_state emergency history | MongoDB TrafficHistory |
| file_uploader image | React upload + Express/Multer |
| YOLO image inference | FastAPI/Ultralytics AI service |
| manual number_input | React range + number input |
| random simulation loop | React interval |
| Streamlit line chart | Recharts |
| video upload/OpenCV | Express upload -> FastAPI/OpenCV |
| emergency timeline | History page |
| app state | React state |
| no authentication | JWT authentication added for a real multi-user application |

The traffic thresholds remain:
- emergency => 90 seconds, 100% load
- below 15 => 15 seconds, 15%
- below 30 => 30 seconds, 50%
- below 50 => 50 seconds, 80%
- otherwise => 70 seconds, 100%
