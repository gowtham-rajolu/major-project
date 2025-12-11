from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="Pancreatic Surgery Risk Prediction API")

# Load saved models
pre_model = joblib.load("pre_operative_model.joblib")
intra_model = joblib.load("intra_operative_model.joblib")
post_model = joblib.load("post_operative_model.joblib")


# ----------------------- Pre-Operative Input Schema -----------------------
class PreOpInput(BaseModel):
    Age: int
    BMI: float
    Diabetes: str
    Hypertension: str
    Heart_Disease: str
    Chronic_Kidney_Disease: str
    COPD: str
    Tumor_Size_cm: float
    Tumor_Stage: str
    Metastasis: str
    ASA_Score: int
    ECOG_Score: int
    Preop_Hb: float
    Preop_WBC: float
    Platelets: int
    Bilirubin: float
    Creatinine: float
    INR: float
    Albumin: float
    CRP: float
    Glucose: float


# ----------------------- Intra-Operative Schema -----------------------
class IntraOpInput(BaseModel):
    PreOp_Risk_Score: float
    Surgery_Type: str
    Surgery_Approach: str
    Surgery_Duration_Min: int
    Anesthesia_Duration_Min: int
    Blood_Loss_ml: int
    Transfusion_Units: int
    IntraOp_Hypotension: str
    IntraOp_Tachycardia: str
    Vasopressor_Use: str
    IntraOp_Lactate: float


# ----------------------- Post-Operative Schema -----------------------
class PostOpInput(BaseModel):
    IntraOp_Complication_Risk_Percent: float
    Complication_Severity_Score: float
    ICU_LOS_Days: float
    Ventilation_Hours: float
    Postop_Hb: float
    Postop_WBC: float
    Postop_CRP: float
    Postop_Glucose: float
    Drain_Amylase: float
    POPF: str
    Reoperation: str
    LOS_Hospital_Days: float
    PostOp_Risk_Score: float


# ----------------------- API ROUTES -----------------------

@app.get("/")
def home():
    return {"message": "Pancreatic Surgery Prediction API is Running 🚀"}


@app.post("/predict/pre-operative")
def predict_pre_op(data: PreOpInput):
    df = pd.DataFrame([data.dict()])
    prediction = pre_model.predict(df)[0]
    return {"Surgery_Success_Probability": float(prediction)}


@app.post("/predict/intra-operative")
def predict_intra_op(data: IntraOpInput):
    df = pd.DataFrame([data.dict()])
    prediction = intra_model.predict(df)[0]
    return {"IntraOp_Complication_Risk_Percent": float(prediction)}


@app.post("/predict/post-operative")
def predict_post_op(data: PostOpInput):
    df = pd.DataFrame([data.dict()])
    prediction = post_model.predict(df)[0]
    return {"Recovery_Duration_Days": float(prediction)}
