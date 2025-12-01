from typing import Union
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import lutas
from app.database import criar_tabelas

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🏗️  Iniciando criação de tabelas...")
    criar_tabelas()
    print("✅ Tabelas criadas com sucesso!")
    
    yield
    
    print("🔌 Liberando recursos...")

app = FastAPI(
    title="Internacional API",
    description="Sistema de mapeamento de lutas da classe trabalhadora",
    lifespan=lifespan
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lutas.router, prefix="/api", tags=["lutas"])

@app.get("/")
def read_root():
    return {"mensagem": "API do INTERNACIONAL - Pela soberania digital da classe trabalhadora!"}


@app.get("/saude")
def checar_saude():
    return {"status": "saudável", "revolucionario": True}