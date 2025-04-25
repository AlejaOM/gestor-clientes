from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Annotated
from app.db.database import get_db
from app.db import models
from app.schema import cliente as cliente_schema
from app.schema import condicion_pago as condicion_pago_schema
from app.crud import crud_cliente
from app.crud import crud_condicion_pago

router = APIRouter()

@router.post("/", response_model=cliente_schema.ClienteRead, status_code=201)
def create_cliente_endpoint(
    cliente: cliente_schema.ClienteCreate,
    db: Session = Depends(get_db)
):
    db_cliente_doc = crud_cliente.get_cliente(db, documento=cliente.documento)
    if db_cliente_doc:
        raise HTTPException(status_code=400, detail=f"Cliente con documento {cliente.documento} ya existe.")

    db_cliente_email = crud_cliente.get_cliente_by_email(db, correo=cliente.correo_electronico)
    if db_cliente_email:
        raise HTTPException(status_code=400, detail=f"Cliente con correo {cliente.correo_electronico} ya existe.")

    condicion = crud_condicion_pago.get_condicion(db, id_condicion=cliente.id_condicion_pago)
    if not condicion:
         raise HTTPException(status_code=404, detail=f"Condición de pago con ID {cliente.id_condicion_pago} no encontrada.")

    if condicion.nombre == condicion_pago_schema.CondicionPagoEnum.contado.value:
        if cliente.id_medio_pago is None:
             raise HTTPException(status_code=400, detail="Para condición 'Contado', se requiere un medio de pago.")
        cliente.valor_cupo = Decimal('0.00')

    elif condicion.nombre == condicion_pago_schema.CondicionPagoEnum.credito.value:
        if cliente.valor_cupo is None or cliente.valor_cupo <= 0:
             raise HTTPException(status_code=400, detail="Para condición 'Crédito', se requiere un valor de cupo mayor a 0.")
        cliente.id_medio_pago = None
    try:
        new_cliente = crud_cliente.create_cliente(db=db, cliente=cliente)
        return new_cliente
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno al crear el cliente.")

@router.get("/", response_model=List[cliente_schema.ClienteRead])
def read_clientes_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    clientes = crud_cliente.get_clientes(db, skip=skip, limit=limit)
    return clientes

@router.get("/{documento}", response_model=cliente_schema.ClienteRead)
def read_cliente_endpoint(
    documento: str,
    db: Session = Depends(get_db)
):
    db_cliente = crud_cliente.get_cliente(db, documento=documento)
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no existe")
    return db_cliente

@router.put("/{documento}", response_model=cliente_schema.ClienteRead)
def update_cliente_endpoint(
    documento: str,
    cliente_update: cliente_schema.ClienteUpdate,
    db: Session = Depends(get_db)
):
    db_cliente = crud_cliente.get_cliente(db, documento=documento)
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no existe")

    if cliente_update.correo_electronico and cliente_update.correo_electronico != db_cliente.correo_electronico:
        cliente_email_existe = crud_cliente.get_cliente_by_email(db, correo=cliente_update.correo_electronico)
        if cliente_email_existe and cliente_email_existe.documento != documento:
            raise HTTPException(status_code=400, detail=f"El correo {cliente_update.correo_electronico} ya está en uso por otro cliente.")

    final_condicion_id = cliente_update.id_condicion_pago if cliente_update.id_condicion_pago is not None else db_cliente.id_condicion_pago
    condicion = crud_condicion_pago.get_condicion(db, id_condicion=final_condicion_id)
    if not condicion:
         raise HTTPException(status_code=404, detail=f"Condición de pago con ID {final_condicion_id} no encontrada.")

    final_valor_cupo = cliente_update.valor_cupo if cliente_update.valor_cupo is not None else db_cliente.valor_cupo
    final_id_medio_pago = cliente_update.id_medio_pago if cliente_update.id_medio_pago is not None else db_cliente.id_medio_pago

    if condicion.nombre == condicion_pago_schema.CondicionPagoEnum.contado.value:
        if final_id_medio_pago is None and cliente_update.id_medio_pago is None :
             raise HTTPException(status_code=400, detail="Inconsistencia: Condición 'Contado' requiere un medio de pago.")

        if final_valor_cupo != Decimal('0.00'):
             cliente_update.valor_cupo = Decimal('0.00')
        if cliente_update.id_medio_pago is None and cliente_update.id_condicion_pago is not None:
             current_medio_pago = db_cliente.id_medio_pago
             if current_medio_pago is None:
                 raise HTTPException(status_code=400, detail="Debe especificar un medio de pago al cambiar a condición 'Contado'.")

    elif condicion.nombre == condicion_pago_schema.CondicionPagoEnum.credito.value:
        if final_valor_cupo is None or final_valor_cupo <= 0:
             raise HTTPException(status_code=400, detail="Inconsistencia: Condición 'Crédito' requiere un valor de cupo mayor a 0.")
        if final_id_medio_pago is not None:
            cliente_update.id_medio_pago = None

    updated_cliente = crud_cliente.update_cliente(db=db, documento=documento, cliente_update=cliente_update)
    return updated_cliente

class EstadoUpdate(BaseModel):
    estado: bool

@router.patch("/{documento}/estado", response_model=cliente_schema.ClienteRead)
def update_estado_cliente_endpoint(
    documento: str,
    estado_update: Annotated[EstadoUpdate, Body(...)],
    db: Session = Depends(get_db)
):
    updated_cliente = crud_cliente.update_cliente_estado(db=db, documento=documento, estado=estado_update.estado)

    if updated_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return updated_cliente