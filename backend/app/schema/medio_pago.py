from pydantic import BaseModel, Field
from enum import Enum
from typing import List 

class MedioPagoEnum(str, Enum):
    efectivo = "Efectivo"
    tarjeta = "Tarjeta"
    transferencia = "Transferencia"

class MedioPagoBase(BaseModel):
    id: int = Field(...)
    nombre: MedioPagoEnum = Field(...)

    class Config:
        use_enum_values = True
        
class MedioPagoRead(MedioPagoBase):
    class Config:
        orm_mode = True
        use_enum_values = True
