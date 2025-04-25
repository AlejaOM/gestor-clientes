import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

print("Cargando variables de entorno...")
load_dotenv()
URL_DATABASE = os.getenv("DATABASE_URL")

if not URL_DATABASE:
    print("Error: DATABASE_URL no encontrada en .env")
else:
    print(f"Intentando conectar a: {URL_DATABASE.split('@')[-1]}")
    try:
        engine = create_engine(URL_DATABASE)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("¡Conexión exitosa! Resultado de SELECT 1:", result.scalar())

            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            db = SessionLocal()
            print("Sesión de base de datos obtenida exitosamente.")
            db_result = db.execute(text("SELECT COUNT(*) FROM CLIENTES")).scalar()
            print(f"Número de clientes encontrados: {db_result}")
            db.close()
            print("Sesión cerrada.")

    except Exception as e:
        print(f"Error al conectar o consultar la base de datos: {e}")