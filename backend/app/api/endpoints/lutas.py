from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.luta import Luta
from app.schemas.luta import LutaCreateSchema, LutaResponseSchema

router = APIRouter()

# GET /api/lutas - Listar todas as lutas
@router.get("/lutas", response_model=list[LutaResponseSchema])
def listar_lutas(db: Session = Depends(get_db)):
    lutas = db.query(Luta).all()
    return lutas

# POST /api/lutas - Criar uma nova luta
@router.post("/lutas", response_model=LutaResponseSchema)
def criar_luta(luta: LutaCreateSchema, db: Session = Depends(get_db)):
    try:
        print("🎯 INICIANDO CRIAÇÃO DE LUTA")  # DEBUG
        print(f"📝 Dados recebidos: {luta.model_dump()}")  # DEBUG
        nova_luta = Luta(
            titulo=luta.titulo,
            descricao=luta.descricao,
            localizacao=luta.localizacao,
            tipo=luta.tipo,
            necessidades=luta.necessidades,
            contato=luta.contato
        )
        print("✅ Objeto Luta criado")  # DEBUG
        # Adiciona ao banco
        db.add(nova_luta)
        db.commit()
        db.refresh(nova_luta)
        print("🎉 Luta salva no banco com sucesso!")  # DEBUG
        return nova_luta

    except Exception as e:
        db.rollback()
        print(f"🚨 ERRO DETALHADO: {str(e)}")  # DEBUG
        print(f"🚨 TIPO DO ERRO: {type(e)}")  # DEBUG
        raise HTTPException(status_code=500, detail="Erro ao criar a luta") from e
    
# GET /api/lutas/{luta_id} - Obter detalhes de uma luta específica
@router.get("/lutas/{luta_id}", response_model=LutaResponseSchema)
def buscar_luta(luta_id: int, db: Session = Depends(get_db)):
    luta = db.query(Luta).filter(Luta.id == luta_id).first()
    
    if not luta:
        raise HTTPException(status_code=404, detail="Luta não encontrada")

    return luta