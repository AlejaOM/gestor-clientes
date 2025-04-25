from sqlalchemy import (Column, Integer, String, DECIMAL, TIMESTAMP, ForeignKey,
                        text, Boolean, SmallInteger, Enum as SQLAlchemyEnum, CHAR)
from sqlalchemy.orm import relationship
from .database import Base
from app.schema.cliente import Ciudad as CiudadEnum

class MedioPago(Base):
    __tablename__ ="MEDIO_PAGO"
    id = Column(SmallInteger, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(30), unique=True, nullable=False)

class CondicionPago(Base):
    __tablename__ ="CONDICION_PAGO"
    id = Column(SmallInteger, primary_key=True, index=True)
    nombre = Column(String(30), unique=True, nullable=False)
    
class Cliente(Base):
    __tablename__ = "CLIENTES"
    documento = Column(String(12), primary_key=True, index=True) 
    nombre = Column(String(50), nullable=False)
    apellido_1 = Column(String(50), nullable=False) 
    apellido_2 = Column(String(50), nullable=True)  
    direccion = Column(String(100), nullable=True)
    telefono = Column(CHAR(10), nullable=True)   
    correo_electronico = Column(String(100), nullable=False, unique=True) 
    ciudad = Column(
        SQLAlchemyEnum(
            CiudadEnum,
            name="ciudad_enum_db",
            values_callable=lambda obj: [e.value for e in obj] 
        ),
        nullable=False
    ) 
    id_condicion_pago = Column(SmallInteger, ForeignKey("CONDICION_PAGO.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    valor_cupo = Column(DECIMAL(11, 2), nullable=True, default=0.00)
    id_medio_pago = Column(SmallInteger, ForeignKey("MEDIO_PAGO.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=True)
    estado = Column(Boolean, nullable=False) 
    fecha_hora_auditoria = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))

    condicion_pago = relationship("CondicionPago")
    medio_pago = relationship("MedioPago")
