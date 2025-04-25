from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schema import medio_pago as medio_pago_schema
from app.crud import crud_medio_pago

router = APIRouter()

@router.get("/", response_model=List[medio_pago_schema.MedioPagoRead])
def read_medios_pago_endpoint(db: Session = Depends(get_db)):
    medios_pago = crud_medio_pago.get_medios_pago(db=db)
    if not medios_pago:
        raise HTTPException(status_code=404, detail="No se encontraron medios de pago")
    return medios_pago