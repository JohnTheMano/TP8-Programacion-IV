
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.core.database import get_session
from app.core.dependencies import require_role
from app.modules.usuarios.repository import UsuarioRepository
from app.modules.usuarios.service import UsuarioService
from app.modules.usuarios.schema import UserAdmin

router = APIRouter(
    prefix="/api/v1/admin/usuarios",
    tags=["Administración de usuarios"]
)


@router.get("", response_model=list[UserAdmin])
def listar_usuarios(
    session: Session = Depends(get_session),
    admin=Depends(require_role(["admin"]))
):
    repository = UsuarioRepository(session)
    usuarios = UsuarioService(repository).listar_usuarios()

    resultado = []

    for usuario in usuarios:
        resultado.append(
            UserAdmin(
                id=usuario.id,
                nombre=usuario.nombre,
                apellido=usuario.apellido,
                email=usuario.email,
                celular=usuario.celular,
                roles=repository.obtener_roles(usuario.id),
                activo=usuario.deleted_at is None,
                created_at=usuario.created_at,
                deleted_at=usuario.deleted_at
            )
        )

    return resultado


@router.post("/{usuario_id}/activar")
def activar_usuario(
    usuario_id: int,
    session: Session = Depends(get_session),
    admin=Depends(require_role(["admin"]))
):
    repository = UsuarioRepository(session)
    usuario = UsuarioService(repository).activar(usuario_id)

    return {"mensaje": "Usuario activado", "id": usuario.id}


@router.post("/{usuario_id}/desactivar")
def desactivar_usuario(
    usuario_id: int,
    session: Session = Depends(get_session),
    admin=Depends(require_role(["admin"]))
):
    if admin.id == usuario_id:
        raise HTTPException(
            status_code=400,
            detail="No podés desactivar tu propia cuenta"
        )

    repository = UsuarioRepository(session)
    usuario = UsuarioService(repository).desactivar(usuario_id)

    return {"mensaje": "Usuario desactivado", "id": usuario.id}
