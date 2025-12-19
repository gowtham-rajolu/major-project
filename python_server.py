# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="Pancreatic Surgery ML API")

# --------------------------
# Load models (ensure files exist in same folder)
# --------------------------
pre_op_model = joblib.load("pre_operative_model.joblib")
intra_op_model = joblib.load("intra_operative_model.joblib")
post_op_model = joblib.load("post_operative_model.joblib")

# New pre-op classifier (predicts intra-op complication type BEFORE surgery)
intra_comp_class_model = joblib.load("intraop_complication_classifier.joblib")
intra_comp_encoders = joblib.load("intraop_encoders.joblib")  # dict of LabelEncoders


# --------------------------
# Pydantic request schemas
# --------------------------
class PreOpInput(BaseModel):
    Age: float
    BMI: float
    Diabetes: str
    Hypertension: str
    Heart_Disease: str
    Chronic_Kidney_Disease: str
    COPD: str
    Tumor_Size_cm: float
    Tumor_Stage: str
    Metastasis: str
    ASA_Score: float
    ECOG_Score: float
    Preop_Hb: float
    Preop_WBC: float
    Platelets: float
    Bilirubin: float
    Creatinine: float
    INR: float
    Albumin: float
    CRP: float
    Glucose: float


class IntraOpRegressionInput(BaseModel):
    PreOp_Risk_Score: float
    Surgery_Type: str
    Surgery_Approach: str
    Surgery_Duration_Min: float
    Anesthesia_Duration_Min: float
    Blood_Loss_ml: float
    Transfusion_Units: float
    IntraOp_Hypotension: str
    IntraOp_Tachycardia: str
    Vasopressor_Use: str
    IntraOp_Lactate: float


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
    # PostOp_Risk_Score was manual — keep if you still accept it
    PostOp_Risk_Score: float = 0.0


# --------------------------
# Endpoints
# --------------------------
@app.get("/")
def root():
    return {"message": "Pancreatic Surgery ML API running"}


@app.post("/predict/pre-operative")
def predict_pre_op(data: PreOpInput):
    df = pd.DataFrame([data.dict()])
    pred = pre_op_model.predict(df)[0]
    return {"Surgery_Success_Probability": float(pred)}


@app.post("/predict/intra-operative")
def predict_intra_op(data: IntraOpRegressionInput):
    df = pd.DataFrame([data.dict()])
    pred = intra_op_model.predict(df)[0]
    return {"IntraOp_Complication_Risk_Percent": float(pred)}


@app.post("/predict/post-operative")
def predict_post_op(data: PostOpInput):
    df = pd.DataFrame([data.dict()])
    pred = post_op_model.predict(df)[0]
    return {"Recovery_Duration_Days": float(pred)}


# --------------------------
# NEW: Pre-op classifier endpoint (predict complication TYPE before surgery)
# --------------------------
@app.post("/predict/intra-operative-complication-type")
def predict_intra_complication_type(data: PreOpInput):
    df = pd.DataFrame([data.dict()])

    # apply encoders (label encoders saved earlier). Only those columns present in encoders
    for col, enc in intra_comp_encoders.items():
        if col in df.columns:
            # enc expects array-like strings — handle unseen values gracefully
            try:
                df[col] = enc.transform(df[col])
            except Exception:
                # if unseen category, fill with -1 (classifier may handle via pipeline or fail)
                df[col] = -1

    encoded = intra_comp_class_model.predict(df)[0]

    # decode label: encoders saved included target encoder under key of target name or 'IntraOp_Complication_Type'
    target_key = "IntraOp_Complication_Type"
    if target_key in intra_comp_encoders:
        try:
            decoded = intra_comp_encoders[target_key].inverse_transform([encoded])[0]
        except Exception:
            decoded = str(int(encoded))
    else:
        decoded = str(int(encoded))

    return {
        "Predicted_Complication_Type": decoded,
        "Encoded_Output": int(encoded)
    }
