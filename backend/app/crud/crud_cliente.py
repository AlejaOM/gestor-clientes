from sqlalchemy.orm import Session
from sqlalchemy import update as sqlalchemy_update
from app.db import models  
from app.schema import cliente as schemas
from decimal import Decimal 

def get_cliente(db: Session, documento: str) -> models.Cliente | None:
    return db.query(models.Cliente).filter(models.Cliente.documento == documento).first()

def get_clientes(db: Session, skip: int = 0, limit: int = 100) -> list[models.Cliente]:
    return db.query(models.Cliente).offset(skip).limit(limit).all()

def create_cliente(db: Session, cliente: schemas.ClienteCreate) -> models.Cliente:
    db_cliente = models.Cliente(**cliente.model_dump()) 
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

def update_cliente(db: Session, documento: str, cliente_update: schemas.ClienteUpdate) -> models.Cliente | None:
    db_cliente = get_cliente(db, documento)
    if not db_cliente:
        return None
    
    update_data = cliente_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_cliente, key, value)

    db.commit()
    db.refresh(db_cliente)
    return db_cliente

def update_cliente_estado(db: Session, documento: str, estado: bool) -> models.Cliente | None:
    cliente_estado_update = schemas.ClienteUpdate(estado=estado)
    return update_cliente(db=db, documento=documento, cliente_update=cliente_estado_update)

def get_cliente_by_email(db: Session, correo: str) -> models.Cliente | None:
    return db.query(models.Cliente).filter(models.Cliente.correo_electronico == correo).first()
