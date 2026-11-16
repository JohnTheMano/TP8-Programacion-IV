	Crear producto
PUT	/productos/{id}	Actualizar producto
DELETE	/productos/{id}	Eliminar producto
GET	/ingredientes/	Listar ingredientes
POST	/ingredientes/	Crear ingrediente
PUT	/ingredientes/{id}	Actualizar ingrediente
DELETE	/ingredientes/{id}	Eliminar ingrediente
GET	/pedidos	Listar pedidos
GET	/pedidos/{id}	Obtener pedido con detalles
POST	/pedidos	Crear pedido
PUT	/pedidos/{id}	Actualizar estado
DELETE	/pedidos/{id}	Borrado lógico
Requisitos previos
Python instalado.
PostgreSQL instalado y funcionando.
Base de datos configurada.
REST Client instalado en Visual Studio Code para ejecutar las pruebas HTTP.
Instalación y ejecución
Ubicarse en la carpeta del backend.

Crear el entorno virtual:


powershell
python -m venv .venv
Activar el entorno virtual:


powershell
.venv\Scripts\activate
Instalar las dependencias:


powershell
pip install -r requirements.txt
Iniciar el servidor:


powershell
python -m fastapi dev app/main.py
Documentación de la API
Con el servidor iniciado, acceder a Swagger:

http://localhost:8000/docs

Pruebas con REST Client
Las operaciones del módulo de pedidos se verifican mediante el archivo:

pedidos.http

Se incluyen pruebas de creación, consulta, actualización, eliminación lógica y validaciones de errores HTTP 404 y 422.

CORS
Se encuentra habilitado CORS para permitir la comunicación entre el backend y el frontend desarrollado con React y Vite.

Objetivo académico
Aplicar los conceptos de desarrollo de APIs REST, persistencia con PostgreSQL, validación con Pydantic y arquitectura por capas.

Se implementa especialmente el patrón Unit of Work para garantizar que la creación de un pedido y sus detalles se realice de manera atómica.

Trabajo Práctico – Unidad 8
Programación IV
Tecnicatura Universitaria en Programación a Distancia.