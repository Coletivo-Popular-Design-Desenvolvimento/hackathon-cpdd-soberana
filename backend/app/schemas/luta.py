from pydantic import BaseModel

#Create simples
class LutaCreateSchema(BaseModel):
    titulo: str
    descricao: str | None = None
    localizacao: str
    tipo: str
    necessidades: str = ""
    contato: str = ""
    latitude: float | None = None
    longitude: float | None = None

class LutaResponseSchema(BaseModel):
    id: int
    titulo: str
    descricao: str
    localizacao: str
    tipo: str
    necessidades: str
    contato: str
    latitude: float | None = None
    longitude: float | None = None

    class Config:
        from_attributes = True