
from datetime import datetime

from sqlmodel import SQLModel, Field


class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"

    id: int | None = Field(default=None, primary_key=True)

    usuario_id: int | None = Field(
        default=None,
        foreign_key="usuarios.id",
        index=True,
    )

    fecha: datetime = Field(default_factory=datetime.now)

    estado: str = Field(default="PENDIENTE", max_length=20)

    total: float = Field(default=0, ge=0)

    deleted_at: datetime | None = Field(default=None)


class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalle_pedido"

    pedido_id: int = Field(
        foreign_key="pedidos.id",
        primary_key=True,
    )

    producto_id: int = Field(
        foreign_key="productos.id",
        primary_key=True,
    )

    cantidad: int = Field(ge=1)

    precio_unitario: float = Field(ge=0)
