from sqlmodel import Session

from app.core.database import engine
from app.pedidos.repository import (
    PedidoRepository,
    DetallePedidoRepository,
    ProductoRepository,
)


class PedidoUnitOfWork:

    def __enter__(self):
        self.session = Session(engine, expire_on_commit=False)

        self.pedidos = PedidoRepository(self.session)
        self.detalles = DetallePedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)

        return self

    def __exit__(self, exc_type, exc_value, traceback):
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()

        return False