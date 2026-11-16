
from sqlmodel import Session, select

from app.pedidos.model import Pedido, DetallePedido
from app.producto.model import Producto


class PedidoRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self):
        statement = select(Pedido).where(
            Pedido.deleted_at.is_(None)
        )
        return self.session.exec(statement).all()

    def get_by_id(self, pedido_id: int):
        statement = select(Pedido).where(
            Pedido.id == pedido_id,
            Pedido.deleted_at.is_(None),
        )
        return self.session.exec(statement).first()

    def create(self, pedido: Pedido):
        self.session.add(pedido)
        self.session.flush()
        self.session.refresh(pedido)
        return pedido

    def update(self, pedido: Pedido):
        self.session.add(pedido)
        self.session.flush()
        return pedido


class DetallePedidoRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_pedido(self, pedido_id: int):
        statement = select(DetallePedido).where(
            DetallePedido.pedido_id == pedido_id
        )
        return self.session.exec(statement).all()

    def create(self, detalle: DetallePedido):
        self.session.add(detalle)
        self.session.flush()
        return detalle


class ProductoRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, producto_id: int):
        statement = select(Producto).where(
            Producto.id == producto_id
        )
        return self.session.exec(statement).first()
