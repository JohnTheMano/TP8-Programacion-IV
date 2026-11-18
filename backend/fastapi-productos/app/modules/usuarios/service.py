
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from app.modules.usuarios.model import Usuario
from app.modules.usuarios.repository import UsuarioRepository
from app.modules.usuarios.schema import UserCreate
from app.core.security import hash_password
from datetime import datetime, timezone


class UsuarioService:

    def __init__(self, repository: UsuarioRepository):
        self.repository = repository

    def registrar(self, datos: UserCreate):
        email = str(datos.email).lower()

        existente = self.repository.obtener_por_email(email)

        if existente:
            raise HTTPException(
                status_code=409,
                detail="El email ya está registrado"
            )

        rol_user = self.repository.obtener_rol("user")
        rol_cliente = self.repository.obtener_rol("CLIENTE")

        if not rol_user or not rol_cliente:
            raise HTTPException(
                status_code=500,
                detail="Faltan roles iniciales. Ejecutá seed.py"
            )

        usuario = Usuario(
            nombre=datos.nombre,
            apellido=datos.apellido,
            email=email,
            celular=datos.celular,
            password_hash=hash_password(datos.password)
        )

        try:
            self.repository.crear(usuario)
            self.repository.asignar_rol(
                usuario.id,
                rol_user.id
            )
            self.repository.asignar_rol(
                usuario.id,
                rol_cliente.id
            )
            self.repository.guardar()
            self.repository.refrescar(usuario)

        except IntegrityError:
            self.repository.session.rollback()
            raise HTTPException(
                status_code=409,
                detail="El email ya está registrado"
            )

        return usuario

    def listar_usuarios(self):
        return self.repository.listar()

    def activar(self, usuario_id: int):
        usuario = self.repository.obtener_por_id(usuario_id)

        if not usuario:
            raise HTTPException(404, "Usuario no encontrado")

        usuario.deleted_at = None

        self.repository.guardar()

        return usuario

    def desactivar(self, usuario_id: int):
        usuario = self.repository.obtener_por_id(usuario_id)

        if not usuario:
            raise HTTPException(404, "Usuario no encontrado")

        usuario.deleted_at = datetime.now(timezone.utc)

        self.repository.guardar()

        return usuario
