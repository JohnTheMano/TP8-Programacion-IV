from datetime import datetime

from sqlmodel import SQLModel, Field
from sqlalchemy import String, ARRAY, Column, DateTime


class Producto(SQLModel, table=True):
    __tablename__ = "productos"

    id: int | None = Field(default=None, primary_key=True)

    nombre: str = Field(max_length=100, index=True)
    descripcion: str
    precio_base: float = Field(ge=0)

    imagenes_url: list[str] = Field(
        default_factory=list,
        sa_column=Column(ARRAY(String), nullable=False),
    )

    disponible: bool = Field(default=True)

    deleted_at: datetime | None = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )


class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"

    producto_id: int = Field(
        foreign_key="productos.id",
        primary_key=True,
    )

    categoria_id: int = Field(
        foreign_key="categorias.id",
        primary_key=True,
    )