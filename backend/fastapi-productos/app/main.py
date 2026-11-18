from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlmodel import SQLModel

from app.core.database import engine
from app.categoria.router import router as categoria_router
from app.categoria import model as categoria_model
from app.producto.router import router as producto_router
from app.producto import model as producto_model
from app.ingrediente.router import router as ingrediente_router
from app.ingrediente import model as ingrediente_model
from app.pedidos.router import router as pedido_router
from app.pedidos import model as pedido_model
from app.modules.usuarios import model as usuarios_model
from app.modules.usuarios.auth_router import router as auth_router
from app.modules.usuarios.admin_router import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    if engine.dialect.name == "postgresql":
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE pedidos "
                    "ADD COLUMN IF NOT EXISTS usuario_id INTEGER "
                    "REFERENCES usuarios(id)"
                )
            )
            connection.execute(
                text("CREATE INDEX IF NOT EXISTS ix_pedidos_usuario_id ON pedidos (usuario_id)")
            )
    yield


app = FastAPI(
    title="API de Productos",
    description="API para gestionar categorías y productos",
    version="1.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(categoria_router)
app.include_router(producto_router)
app.include_router(ingrediente_router)
app.include_router(pedido_router)
app.include_router(auth_router)
app.include_router(admin_router)

@app.get("/")
def inicio():
    return {"mensaje": "API de Productos funcionando"}
