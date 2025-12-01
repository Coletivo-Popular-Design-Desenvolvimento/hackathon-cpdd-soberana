from sqlalchemy import Column, Float, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Luta(Base):
    __tablename__ = 'lutas'

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    titulo = Column(String(200), nullable=False)
    descricao = Column(Text, nullable=True)
    localizacao = Column(String(100)) # Depois adicionar coordenadas, por enquanto só o nome do lugar para base
    tipo = Column(String(50))  # Ex: Greve, Protesto, Ocupação, etc.
    necessidades = Column(Text, nullable=True)  # Recursos ou apoios necessários
    contato = Column(String(100))  # Informações de contato ou link para mais detalhes

    latitude = Column(Float, nullable=True)  # Pode ser null inicialmente
    longitude = Column(Float, nullable=True)

    def __repr__(self):
        return f"<Luta(titulo='{self.titulo}', tipo='{self.tipo}', localizacao='{self.localizacao}')>"