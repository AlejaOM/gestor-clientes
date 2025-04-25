from sqlalchemy.orm import Session
from app.db import models

def get_condiciones_pago(db: Session):
    return db.query(models.CondicionPago).all()

def get_condicion(db: Session, id_condicion: int) -> models.CondicionPago | None:
    return db.query(models.CondicionPago).filter(models.CondicionPago.id == id_condicion).first()
