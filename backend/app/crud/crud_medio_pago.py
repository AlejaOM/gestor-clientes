from sqlalchemy.orm import Session
from app.db import models
from typing import List

def get_medios_pago(db: Session) -> List[models.MedioPago]:
    return db.query(models.MedioPago).all()

def get_medio(db: Session, id_medio: int) -> models.MedioPago | None:
    return db.query(models.MedioPago).filter(models.MedioPago.id == id_medio).first()
