from pydantic import BaseModel

#Create simples
class LutaCreateSchema(BaseModel):
    titulo: str
    descricao: str | None = None
    localizacao: str
    tipo: str
    necessidades: str = ""
    contato: str = ""

class LutaResponseSchema(BaseModel):
    id: int
    titulo: str
    descricao: str
    localizacao: str
    tipo: str
    necessidades: str
    contato: str

    class Config:
        from_attributes = True