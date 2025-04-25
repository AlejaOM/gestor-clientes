from fastapi import APIRouter
from .endpoints import clientes, medios_pago, condiciones_pago

api_router = APIRouter()
api_router.include_router(clientes.router, prefix="/clientes", tags=["Clientes"])
api_router.include_router(condiciones_pago.router, prefix="/condiciones", tags=["Condiciones de Pago"])
api_router.include_router(medios_pago.router, prefix="/medios-pago", tags=["Medios de Pago"])
