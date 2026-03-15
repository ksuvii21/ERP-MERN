from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
# import joblib # In a real scenario, you would load trained models here

app = FastAPI(title="ERP AI Engine 🧠")

# Allow frontend to communicate with AI service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class SalesInput(BaseModel):
    history: List[float]
    months_to_predict: int = 1

class AttritionInput(BaseModel):
    satisfaction_level: float
    last_evaluation: float
    number_project: int
    average_monthly_hours: int
    time_spend_company: int
    work_accident: int
    promotion_last_5years: int
    salary_level: int # 0: low, 1: medium, 2: high

class Transaction(BaseModel):
    id: str
    amount: float
    category: str
    date: str

class CashflowInput(BaseModel):
    history: List[float]
    months_to_predict: int = 1

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "AI Service Online", "version": "1.0.0"}

@app.post("/predict/sales")
def predict_sales(data: SalesInput):
    # Simulation: Simple Linear Trend / Moving Average
    history = np.array(data.history)
    if len(history) < 2:
        return {"prediction": history[-1] if len(history) > 0 else 0, "confidence": 0.5}
    
    trend = np.mean(np.diff(history))
    next_value = history[-1] + trend
    
    return {
        "prediction": round(next_value, 2),
        "trend": "Up" if trend > 0 else "Down",
        "confidence": 0.85
    }

@app.post("/predict/attrition")
def predict_attrition(data: AttritionInput):
    # Simulation: Rule-based Logic (Proxy for Random Forest)
    risk_score = 0
    if data.satisfaction_level < 0.5: risk_score += 40
    if data.average_monthly_hours > 250: risk_score += 30
    if data.time_spend_company > 4 and data.promotion_last_5years == 0: risk_score += 20
    
    return {
        "risk_score": min(risk_score, 100),
        "risk_level": "High" if risk_score > 70 else "Medium" if risk_score > 30 else "Low"
    }

@app.post("/predict/attrition/batch")
def predict_attrition_batch(data: List[AttritionInput]):
    results = []
    for employee in data:
        risk_score = 0
        if employee.satisfaction_level < 0.5: risk_score += 40
        if employee.average_monthly_hours > 250: risk_score += 30
        if employee.time_spend_company > 4 and employee.promotion_last_5years == 0: risk_score += 20
        
        results.append({
            "risk_score": min(risk_score, 100),
            "risk_level": "High" if risk_score > 70 else "Medium" if risk_score > 30 else "Low"
        })
    return results

@app.post("/analyze/anomalies")
def detect_anomalies(transactions: List[Transaction]):
    # Simulation: Z-Score Anomaly Detection
    if not transactions:
        return {"anomalies": []}
        
    df = pd.DataFrame([t.dict() for t in transactions])
    mean = df['amount'].mean()
    std = df['amount'].std()
    
    # Flag transactions > 2 standard deviations from mean
    df['z_score'] = (df['amount'] - mean) / std
    anomalies = df[df['z_score'].abs() > 2].to_dict(orient='records')
    
    return {
        "anomalies": anomalies,
        "count": len(anomalies),
        "threshold_used": f"Mean: {mean:.2f}, Std: {std:.2f}"
    }

@app.post("/predict/cashflow")
def predict_cashflow(data: CashflowInput):
    # Simulation: Linear Trend Projection
    history = np.array(data.history)
    if len(history) < 2:
        return {"prediction": history[-1] if len(history) > 0 else 0}
    
    x = np.arange(len(history))
    z = np.polyfit(x, history, 1)
    p = np.poly1d(z)
    
    next_val = p(len(history))
    return {
        "prediction": round(next_val, 2),
        "trend": "Positive" if z[0] > 0 else "Negative",
        "confidence": 0.80
    }