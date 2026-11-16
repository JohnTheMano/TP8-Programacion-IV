
from datetime import datetime
from typing import Annotated, Literal

from sqlmodel import SQLModel, Field
from pydantic import ConfigDict, model_validator


class DetallePedidoCreate(SQLModel):
    producto_id: int
    cantidad: int = Field(ge=1)


class DetallePedidoRead(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    pedido_id: int
    producto_id: int
    cantidad: int
    precio_unitario: float


class PedidoCreate(SQLModel):
    detalles: list[DetallePedidoCreate] = Field(min_length=1)

    @model_validator(mode="after")
    def validar_productos_repetidos(self):
        ids = [detalle.producto_id for detalle in self.detalles]

        if len(ids) != len(set(ids)):
            raise ValueError("No se puede repetir un producto en el pedido")

        return self


class PedidoUpdate(SQLModel):
    estado: Literal[
        "PENDIENTE",
        "CONFIRMADO",
        "ENTREGADO",
        "CANCELADO",
    ]


class PedidoRead(SQLModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha: datetime
    estado: str
    total: float
    detalles: list[DetallePedidoRead] = Field(default_factory=list)
