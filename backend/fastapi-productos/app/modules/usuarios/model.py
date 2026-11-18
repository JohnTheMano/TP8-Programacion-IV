
from datetime import datetime, timezone

from sqlalchemy import Column, String
from sqlmodel import SQLModel, Field


def fecha_actual():
    return datetime.now(timezone.utc)


class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios"

    id: int | None = Field(default=None, primary_key=True)

    nombre: str = Field(max_length=100)
    apellido: str = Field(max_length=100)

    email: str = Field(
        sa_column=Column(String(255), unique=True, nullable=False)
    )

    celular: str | None = Field(default=None, max_length=30)

    password_hash: str

    created_at: datetime = Field(default_factory=fecha_actual)
    updated_at: datetime = Field(default_factory=fecha_actual)
    deleted_at: datetime | None = None


class Rol(SQLModel, table=True):
    __tablename__ = "roles"

    id: int | None = Field(default=None, primary_key=True)

    nombre: str = Field(
        sa_column=Column(String(50), unique=True, nullable=False)
    )

    descripcion: str | None = None


class UsuarioRol(SQLModel, table=True):
    __tablename__ = "usuario_rol"

    usuario_id: int = Field(
        foreign_key="usuarios.id",
        primary_key=True
    )

    rol_id: int = Field(
        foreign_key="roles.id",
        primary_key=True
    )

    asignado_por_id: int | None = Field(
        default=None,
        foreign_key="usuarios.id"
    )

    expires_at: datetime | None = None

    created_at: datetime = Field(default_factory=fecha_actual)
