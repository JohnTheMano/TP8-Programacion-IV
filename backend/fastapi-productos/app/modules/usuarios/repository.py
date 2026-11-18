
from datetime import datetime, timezone

from sqlmodel import Session, select

from app.modules.usuarios.model import Usuario, Rol, UsuarioRol


class UsuarioRepository:

    def __init__(self, session: Session):
        self.session = session

    def obtener_por_email(self, email: str):
        statement = select(Usuario).where(Usuario.email == email)
        return self.session.exec(statement).first()

    def obtener_por_id(self, usuario_id: int):
        return self.session.get(Usuario, usuario_id)

    def crear(self, usuario: Usuario):
        self.session.add(usuario)
        self.session.flush()
        return usuario

    def obtener_rol(self, nombre: str):
        statement = select(Rol).where(Rol.nombre == nombre)
        return self.session.exec(statement).first()

    def asignar_rol(
        self,
        usuario_id: int,
        rol_id: int,
        asignado_por_id: int | None = None
    ):
        asignacion = UsuarioRol(
            usuario_id=usuario_id,
            rol_id=rol_id,
            asignado_por_id=asignado_por_id
        )

        self.session.add(asignacion)

    def obtener_roles(self, usuario_id: int):
        statement = (
            select(Rol)
            .join(UsuarioRol, UsuarioRol.rol_id == Rol.id)
            .where(UsuarioRol.usuario_id == usuario_id)
        )

        asignaciones = self.session.exec(statement).all()

        ahora = datetime.now(timezone.utc)

        roles = []

        for rol in asignaciones:
            asignacion = self.session.get(
                UsuarioRol,
                (usuario_id, rol.id)
            )

            if asignacion and (
                asignacion.expires_at is None
                or asignacion.expires_at.replace(
                    tzinfo=timezone.utc
                ) > ahora
            ):
                roles.append(rol.nombre)

        return roles

    def listar(self):
        return self.session.exec(select(Usuario)).all()

    def guardar(self):
        self.session.commit()

    def refrescar(self, usuario):
        self.session.refresh(usuario)
        return usuario
