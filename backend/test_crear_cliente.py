import requests
import json
from decimal import Decimal 

BASE_URL = "http://127.0.0.1:8000"
ENDPOINT = "/api/clientes/"

cliente_contado_payload = {
    "documento": "1098065432",
    "nombre": "Luis",
    "apellido_1": "Suarez",
    "apellido_2": "Gomez", 
    "direccion": "Crr 17A #121-12", 
    "telefono": "3009876543",
    "correo_electronico": "luids@gmail.com", 
    "ciudad": "Bucaramanga", 
    "id_condicion_pago": 1,
    "valor_cupo": "0.00", 
    "id_medio_pago": 1,   
    "estado": True        
}

cliente_credito_payload = {
    "documento": "1006545302",
    "nombre": "Ana",
    "apellido_1": "Lopez",
    "apellido_2": None,
    "direccion": "Avenida Siempre Viva 742",
    "telefono": "3101112233",
    "correo_electronico": "ana.lopez@email.com", 
    "ciudad": "Floridablanca",
    "id_condicion_pago": 2, 
    "valor_cupo": "500000.00", 
    "id_medio_pago": 1, 
    "estado": True
}

def enviar_request_crear_cliente(payload):
    """Función para enviar la solicitud POST y mostrar la respuesta."""
    url_completa = f"{BASE_URL}{ENDPOINT}"
    print(f"--- Enviando Payload a {url_completa} ---")
    print(json.dumps(payload, indent=2)) 

    try:
        response = requests.post(url_completa, json=payload)

        print(f"\n--- Respuesta Recibida ---")
        print(f"Status Code: {response.status_code}")

        try:
            response_json = response.json()
            print("Respuesta JSON:")
            print(json.dumps(response_json, indent=2))
        except json.JSONDecodeError:
            print("Respuesta no es JSON válido:")
            print(response.text)

    except requests.exceptions.RequestException as e:
        print(f"\n--- Error de Conexión ---")
        print(f"No se pudo conectar a {url_completa}. ¿Está corriendo el servidor FastAPI?")
        print(f"Error: {e}")
    print("-" * 40 + "\n")

print("Prueba 1: Creando cliente 'Contado'")
enviar_request_crear_cliente(cliente_contado_payload)

print("Prueba 2: Creando cliente 'Crédito'")
enviar_request_crear_cliente(cliente_credito_payload)