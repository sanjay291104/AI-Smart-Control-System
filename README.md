# 🚦 AI Smart Traffic Control — MERN

A full-stack conversion of the uploaded Streamlit **AI Smart Traffic Control System** into a MERN application.

## Architecture

- **Frontend:** React + Vite + React Router + Axios + Recharts + Lucide
- **Backend:** Node.js + Express + MongoDB/Mongoose + JWT + Multer
- **AI layer:** Optional Python FastAPI service using the same YOLO/OpenCV approach as the original application
- **Persistence:** MongoDB stores users, analysis history, simulation summaries and emergency events

> The core application is MERN. The AI microservice is separate because the original project relies on Ultralytics YOLO/OpenCV; this avoids replacing real detection with a fake counter.

## Preserved traffic rules

| Vehicles | Status | Green time | Load |
|---:|---|---:|---:|
| `< 15` | LOW | 15s | 15% |
| `15–29` | MEDIUM | 30s | 50% |
| `30–49` | HIGH | 50s | 80% |
| `>= 50` | CRITICAL | 70s | 100% |
| Emergency | EMERGENCY | 90s | 100% |

These rules are based on the original uploaded application.

## Project structure

```text
ai-smart-traffic-mern/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── uploads/.gitkeep
│   ├── .env.example
│   └── package.json
├── ai-service/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## 1. MongoDB

Local MongoDB:
```bash
mongodb://127.0.0.1:27017/ai-smart-traffic
```

Or use MongoDB Atlas.

## 2. Backend

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Default backend:
`http://localhost:5000`

## 3. Frontend

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

Frontend:
`http://localhost:5173`

## 4. AI service (for actual YOLO image/video analysis)

Python 3.10+ recommended.

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --port 8000
```

The first YOLO request may download the model.

## Environment variables

### server/.env

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-smart-traffic
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

### client/.env

```env
VITE_API_URL=http://localhost:5000/api
```

### ai-service/.env

```env
AI_PORT=8000
```

## Demo flow

1. Register a user.
2. Login.
3. Open Dashboard.
4. Use Manual Control without the AI service.
5. Use Live Simulation without the AI service.
6. Start the AI service for Image Detection and Video Analysis.
7. Review saved activity in History.

## Important note about emergency detection

The original code defines emergency classes such as ambulance, fire truck and police vehicles. Standard YOLOv8n COCO weights do not contain all of those custom classes. The service therefore reports emergency classes only when the loaded model actually returns a matching label. For production, train/fine-tune a custom traffic/emergency YOLO model.

## Source mapping

The original application includes:
- YOLO model loading
- vehicle-only counting
- emergency detection
- dynamic signal timing
- image detection
- manual control
- random live simulation
- 30-frame video analysis
- emergency history

This project separates those responsibilities into reusable React/Express services.
