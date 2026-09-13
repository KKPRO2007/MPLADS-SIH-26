from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.auth import create_access_token, hash_password, verify_password
from app.core.config import get_settings
from app.data_service import model_status, risks, summary
from app.ml_service import predict_project, warm_models

settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def load_ml_models() -> None:
    warm_models()

_demo_password_hash = hash_password("change-me")


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=1, max_length=128)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "environment": settings.environment}


@app.get("/api/summary")
def get_summary(state: str | None = None, risk: str | None = None) -> dict[str, int]:
    return summary(state=state, risk=risk)


@app.get("/api/states")
def get_states() -> list[dict]:
    from app.data_service import _state_rows

    return _state_rows()


@app.get("/api/risks")
def get_risks(limit: int = 12, state: str | None = None, risk: str | None = None) -> list[dict]:
    return risks(max(1, min(limit, 600)), state=state, risk=risk)


@app.get("/api/ml/status")
def get_model_status() -> dict:
    return model_status()


@app.get("/predict/{project_id}")
@app.get("/projects/{project_id}/risk")
def predict(project_id: str) -> dict:
    try:
        return predict_project(project_id)
    except KeyError as error:
        raise HTTPException(status_code=404, detail=f"Project {project_id} was not found") from error


@app.post("/auth/login")
def login(payload: LoginRequest) -> dict[str, str]:
    if payload.username != "admin" or not verify_password(payload.password, _demo_password_hash):
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return {"access_token": create_access_token(payload.username), "token_type": "bearer"}
