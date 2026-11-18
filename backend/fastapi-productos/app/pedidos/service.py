
from datetime import datetime, timezone

from app.pedidos.model import Pedido, DetallePedido
from app.pedidos.schema import (
    PedidoCreate,
    PedidoUpdate,
    PedidoRead,
    DetallePedidoRead,
)
from app.pedidos.unit_of_work import PedidoUnitOfWork


class ProductoNoEncontrado(Exception):
    pass


class PedidoNoEncontrado(Exception):
    pass


class PedidoService:

    def __init__(self, uow=None):
        self.uow = uow or PedidoUnitOfWork()

    def listar(self, usuario_id: int | None = None):
        with self.uow as uow:
            pedidos = (
                uow.pedidos.get_all()
                if usuario_id is None
                else uow.pedidos.get_by_owner(usuario_id)
            )

            return [
                PedidoRead(
                    id=pedido.id,
                    usuario_id=pedido.usuario_id,
                    fecha=pedido.fecha,
                    estado=pedido.estado,
                    total=pedido.total,
                    detalles=[
                        DetallePedidoRead.model_validate(detalle)
                        for detalle in uow.detalles.get_by_pedido(pedido.id)
                    ],
                )
                for pedido in pedidos
            ]

    def obtener(self, pedido_id: int, usuario_id: int | None = None):
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)

            if pedido is None or (
                usuario_id is not None and pedido.usuario_id != usuario_id
            ):
                raise PedidoNoEncontrado()

            detalles = uow.detalles.get_by_pedido(pedido_id)

            return PedidoRead(
                id=pedido.id,
                usuario_id=pedido.usuario_id,
                fecha=pedido.fecha,
                estado=pedido.estado,
                total=pedido.total,
                detalles=[
                    DetallePedidoRead.model_validate(detalle)
                    for detalle in detalles
                ],
            )

    def crear(self, data: PedidoCreate, usuario_id: int):
        with self.uow as uow:

            pedido = uow.pedidos.create(
                Pedido(
                    usuario_id=usuario_id,
                    fecha=datetime.now(timezone.utc),
                    estado="PENDIENTE",
                    total=0,
                )
            )

            total = 0.0

            for item in data.detalles:
                producto = uow.productos.get_by_id(item.producto_id)

                if producto is None:
                    raise ProductoNoEncontrado(item.producto_id)

                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    precio_unitario=producto.precio_base,
                )

                uow.detalles.create(detalle)
                total += item.cantidad * producto.precio_base

            pedido.total = total
            uow.pedidos.update(pedido)

            return PedidoRead(
                id=pedido.id,
                usuario_id=pedido.usuario_id,
                fecha=pedido.fecha,
                estado=pedido.estado,
                total=pedido.total,
                detalles=[
                    DetallePedidoRead.model_validate(detalle)
                    for detalle in uow.detalles.get_by_pedido(pedido.id)
                ],
            )

    def actualizar(self, pedido_id: int, data: PedidoUpdate):
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)

            if pedido is None:
                raise PedidoNoEncontrado()

            pedido.estado = data.estado

            uow.pedidos.update(pedido)

            return PedidoRead(
                id=pedido.id,
                usuario_id=pedido.usuario_id,
                fecha=pedido.fecha,
                estado=pedido.estado,
                total=pedido.total,
                detalles=[
                    DetallePedidoRead.model_validate(detalle)
                    for detalle in uow.detalles.get_by_pedido(pedido_id)
                ],
            )

    def eliminar(self, pedido_id: int):
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)

            if pedido is None:
                raise PedidoNoEncontrado()

            pedido.deleted_at = datetime.now(timezone.utc)

            uow.pedidos.update(pedido)
