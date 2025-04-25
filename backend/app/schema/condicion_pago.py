from pydantic import BaseModel, Field
from enum import Enum
from typing import List 

class CondicionPagoEnum(str, Enum):
    contado = "Contado"
    credito = "Crédito"

class CondicionPagoBase(BaseModel):
    id: int = Field(...)
    nombre: CondicionPagoEnum = Field(...)

    class Config:
        use_enum_values = True
        
class CondicionPagoRead(CondicionPagoBase):
    class Config:
        orm_mode = True
        use_enum_values = True
