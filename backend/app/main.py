from fastapi import FastAPI,HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Annotated
from app import models
from app.database import Base, engine
from app.routers import auth,chat,user

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Indian Law Explainer API",
    description="An API to explain Indian laws and provide legal information.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(user.router)

app.get("/")
def root():
    return {"message": "Welcome to the Indian Law Explainer API"}