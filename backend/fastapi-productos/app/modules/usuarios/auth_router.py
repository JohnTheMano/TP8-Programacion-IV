
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from app.core.database import get_session
from app.core.security import (
    verificar_password,
    crear_access_token
)
from app.core.dependencies import get_current_active_user
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.repository import UsuarioRepository
from app.modules.usuarios.schema import UserCreate, UserPublic
from app.modules.usuarios.service import UsuarioService

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticación"])


@router.post("/register", response_model=UserPublic, status_code=201)
def register(
    datos: UserCreate,
    session: Session = Depends(get_session)
):
    repository = UsuarioRepository(session)
    service = UsuarioService(repository)

    usuario = service.registrar(datos)

    return UserPublic(
        id=usuario.id,
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        email=usuario.email,
        celular=usuario.celular,
        roles=["user", "CLIENTE"]
    )


@router.post("/token")
def login(
    response: Response,
    form: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    repository = UsuarioRepository(session)

    usuario = repository.obtener_por_email(form.username.lower())

    if not usuario or not verificar_password(
        form.password,
        usuario.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Email o contraseña incorrectos"
        )

    if usuario.deleted_at is not None:
        raise HTTPException(
            status_code=400,
            detail="Cuenta de usuario desactivada"
        )

    token = crear_access_token({
        "sub": str(usuario.id)
    })

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=3600,
        path="/"
    )

    return {"mensaje": "Inicio de sesión exitoso"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )

    return {"mensaje": "Sesión cerrada"}


@router.get("/me", response_model=UserPublic)
def me(
    usuario: Usuario = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    repository = UsuarioRepository(session)

    return UserPublic(
        id=usuario.id,
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        email=usuario.email,
        celular=usuario.celular,
        roles=repository.obtener_roles(usuario.id)
    )
