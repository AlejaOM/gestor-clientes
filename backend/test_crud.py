from app.db.database import SessionLocal, engine
from app.crud import crud_condicion_pago, crud_medio_pago

db = SessionLocal()
try:
    print("Probando get_condiciones_pago...")
    condiciones = crud_medio_pago.get_medios_pago(db)
    if condiciones:
        print(f"Condiciones encontradas ({len(condiciones)}):")
        for cond in condiciones:
            print(f"  ID: {cond.id}, Nombre: {cond.nombre}")
    else:
        print("No se encontraron condiciones de pago.")
except Exception as e:
    print(f"Error probando CRUD: {e}")
finally:
    db.close()
