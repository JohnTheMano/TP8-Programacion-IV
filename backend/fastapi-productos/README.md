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
Ejecutar el seed idempotente:


powershell
python seed.py
Iniciar el servidor:


powershell
python -m fastapi dev app/main.py
Documentación de la API
Con el servidor iniciado, acceder a Swagger:

http://localhost:8000/docs

Autenticación y permisos

- `POST /api/v1/auth/register` es público y asigna los roles `user` y `CLIENTE`.
- Las lecturas de categorías, productos e ingredientes requieren una sesión activa.
- Las escrituras de categorías, productos e ingredientes requieren el rol `admin`.
- `CLIENTE` puede crear pedidos y consultar únicamente los propios; `admin` puede consultar todos y actualizar o eliminar cualquiera.
- Los pedidos creados antes de agregar `usuario_id` quedan sin propietario y solo son visibles para `admin`.

Datos iniciales

Ejecutar `python seed.py` desde esta carpeta. El seed crea los roles `admin`, `user` y `CLIENTE`, asigna `CLIENTE` a usuarios existentes con rol `user` y carga categorías, productos e ingredientes de ejemplo de forma idempotente. No crea cuentas con contraseñas predeterminadas.

Pruebas con REST Client
Los archivos `pedidos.http` y `productos.http` requieren credenciales. Reemplazar sus variables `COMPLETAR_*` por cuentas existentes antes de ejecutar las pruebas. Las cookies de sesión permiten probar las rutas protegidas.

El archivo `pedidos.http` prueba el aislamiento de pedidos por cliente y las operaciones administrativas.

Se incluyen pruebas de creación, consulta, actualización, eliminación lógica y validaciones de errores HTTP 404 y 422.

CORS
Se encuentra habilitado CORS para permitir la comunicación entre el backend y el frontend desarrollado con React y Vite.

Objetivo académico
Aplicar los conceptos de desarrollo de APIs REST, persistencia con PostgreSQL, validación con Pydantic y arquitectura por capas.

Se implementa especialmente el patrón Unit of Work para garantizar que la creación de un pedido y sus detalles se realice de manera atómica.

Trabajo Práctico – Unidad 9
Programación IV
Tecnicatura Universitaria en Programación a Distancia.