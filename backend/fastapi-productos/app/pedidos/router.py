
from fastapi import APIRouter, HTTPException, status

from app.pedidos.service import (
    PedidoService,
    PedidoNoEncontrado,
    ProductoNoEncontrado,
)
from app.pedidos.schema import (
    PedidoCreate,
    PedidoUpdate,
    PedidoRead,
)


router = APIRouter(
    prefix="/pedidos",
    tags=["pedidos"],
)

service = PedidoService()


@router.get("/", response_model=list[PedidoRead])
def listar_pedidos():
    return service.listar()


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_pedido(pedido_id: int):
    try:
        return service.obtener(pedido_id)
    except PedidoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Pedido no encontrado",
        )


@router.post(
    "/",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_pedido(data: PedidoCreate):
    try:
        return service.crear(data)
    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=404,
            detail=f"Producto {error} no encontrado",
        )


@router.put("/{pedido_id}", response_model=PedidoRead)
def actualizar_pedido(
    pedido_id: int,
    data: PedidoUpdate,
):
    try:
        return service.actualizar(pedido_id, data)
    except PedidoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Pedido no encontrado",
        )


@router.delete(
    "/{pedido_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_pedido(pedido_id: int):
    try:
        service.eliminar(pedido_id)
    except PedidoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Pedido no encontrado",
        )

    return None
