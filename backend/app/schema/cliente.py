from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal, Annotated
from decimal import Decimal
import datetime
from enum import Enum

class Ciudad(str, Enum):
    bucaramanga = "Bucaramanga"
    piedecuesta = "Piedecuesta"
    floridablanca = "Floridablanca"
    giron = "Girón" 

class ClienteBase(BaseModel):
    documento: str = Field(..., max_length=12)
    nombre: str = Field(..., max_length=50)
    apellido_1: str = Field(..., max_length=50)
    apellido_2: Optional[str] = Field(None, max_length=50)
    direccion: Optional[str] = Field(None, max_length=100)
    telefono: Optional[str] = Field(None, max_length=10, min_length=10)
    correo_electronico: EmailStr = Field(..., max_length=100)
    ciudad: Ciudad
    id_condicion_pago: int
    valor_cupo: Annotated[Optional[Decimal], Field(default=Decimal('0.00'), max_digits=11, decimal_places=2, ge=Decimal('0.00'))]
    id_medio_pago: Optional[int] = None
    estado: bool = Field(...)

    class Config:
        use_enum_values = True

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=50)
    apellido_1: Optional[str] = Field(None, max_length=50)
    apellido_2: Optional[str] = Field(None, max_length=50)
    direccion: Optional[str] = Field(None, max_length=100)
    telefono: Optional[str] = Field(None, max_length=10, min_length=10)
    correo_electronico: Optional[EmailStr] = Field(None, max_length=100)
    ciudad: Optional[Ciudad] = None
    id_condicion_pago: Optional[int] = None
    valor_cupo: Annotated[
    Optional[Decimal], 
    Field(
        default=None, 
        max_digits=11,
        decimal_places=2,
        ge=Decimal('0.00')
    )
] 
    id_medio_pago: Optional[int] = None
    estado: Optional[bool] = None

    class Config:
        use_enum_values = True

class ClienteRead(ClienteBase):
    fecha_hora_auditoria: datetime.datetime

    class Config:
        orm_mode = True 
        use_enum_values = True 