
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.core.database import get_session
from app.core.dependencies import require_role
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.repository import UsuarioRepository
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
def listar_pedidos(
    usuario: Usuario = Depends(require_role(["CLIENTE", "admin"])),
    session: Session = Depends(get_session),
):
    roles = UsuarioRepository(session).obtener_roles(usuario.id)
    if "admin" in roles:
        return service.listar()
    return service.listar(usuario.id)


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_pedido(
    pedido_id: int,
    usuario: Usuario = Depends(require_role(["CLIENTE", "admin"])),
    session: Session = Depends(get_session),
):
    try:
        roles = UsuarioRepository(session).obtener_roles(usuario.id)
        usuario_id = None if "admin" in roles else usuario.id
        return service.obtener(pedido_id, usuario_id)
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
def crear_pedido(
    data: PedidoCreate,
    usuario: Usuario = Depends(require_role(["CLIENTE", "admin"])),
):
    try:
        return service.crear(data, usuario.id)
    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=404,
            detail=f"Producto {error} no encontrado",
        )


@router.put("/{pedido_id}", response_model=PedidoRead)
def actualizar_pedido(
    pedido_id: int,
    data: PedidoUpdate,
    admin: Usuario = Depends(require_role(["admin"])),
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
def eliminar_pedido(
    pedido_id: int,
    admin: Usuario = Depends(require_role(["admin"])),
):
    try:
        service.eliminar(pedido_id)
    except PedidoNoEncontrado:
        raise HTTPException(
            status_code=404,
            detail="Pedido no encontrado",
        )

    return None
