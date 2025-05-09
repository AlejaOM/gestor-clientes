from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router 

app = FastAPI(title="Gestión de Clientes")


origins = [
    "http://localhost",         
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Gestión de Clientes funcionando"}