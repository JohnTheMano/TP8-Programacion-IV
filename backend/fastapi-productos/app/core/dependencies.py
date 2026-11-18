
from fastapi import Depends, HTTPException, Request
from sqlmodel import Session

from app.core.database import get_session
from app.core.security import decodificar_token
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.repository import UsuarioRepository


def get_current_user(
    request: Request,
    session: Session = Depends(get_session)
):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=401,
            detail="No autenticado"
        )

    payload = decodificar_token(token)

    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=401,
            detail="Token inválido o vencido"
        )

    try:
        usuario_id = int(payload["sub"])
    except (ValueError, TypeError):
        raise HTTPException(401, "Token inválido")

    usuario = session.get(Usuario, usuario_id)

    if not usuario:
        raise HTTPException(401, "Usuario no encontrado")

    return usuario


def get_current_active_user(
    usuario=Depends(get_current_user)
):
    if usuario.deleted_at is not None:
        raise HTTPException(
            status_code=400,
            detail="Cuenta de usuario desactivada"
        )

    return usuario


def require_role(roles: list[str]):

    def verificar_rol(
        usuario=Depends(get_current_active_user),
        session: Session = Depends(get_session)
    ):
        repository = UsuarioRepository(session)
        roles_usuario = repository.obtener_roles(usuario.id)

        if not any(rol in roles_usuario for rol in roles):
            raise HTTPException(
                status_code=403,
                detail="No tenés permisos para realizar esta operación"
            )

        return usuario

    return verificar_rol
