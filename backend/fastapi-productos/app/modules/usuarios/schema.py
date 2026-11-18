
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    apellido: str = Field(min_length=2, max_length=100)
    email: EmailStr
    celular: str | None = None
    password: str = Field(min_length=8)


class UserPublic(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    celular: str | None
    roles: list[str]


class UserAdmin(UserPublic):
    activo: bool
    created_at: datetime
    deleted_at: datetime | None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    mensaje: str
    token_type: str = "bearer"
