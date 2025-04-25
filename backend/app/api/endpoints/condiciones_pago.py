from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schema import condicion_pago as condicion_pago_schema
from app.crud import crud_condicion_pago 

router = APIRouter()

@router.get("/", response_model=List[condicion_pago_schema.CondicionPagoRead])
def read_condiciones_pago_endpoint(db: Session = Depends(get_db)):
  
    condiciones = crud_condicion_pago.get_condiciones_pago(db=db)
    if not condiciones:
        raise HTTPException(status_code=404, detail="No se encontraron condiciones de pago")
    return condiciones