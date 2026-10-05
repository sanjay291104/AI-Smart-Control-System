@echo off
echo Starting Smart Traffic MERN project...
start "Traffic Backend" cmd /k "cd server && npm run dev"
start "Traffic Frontend" cmd /k "cd client && npm run dev"
echo.
echo Start the AI service separately:
echo cd ai-service
echo .venv\Scripts\activate
echo uvicorn main:app --reload --port 8000
