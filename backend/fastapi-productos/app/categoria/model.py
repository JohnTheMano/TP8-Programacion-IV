from datetime import datetime

from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime


class Categoria(SQLModel, table=True):
    __tablename__ = "categorias"

    id: int | None = Field(default=None, primary_key=True)

    nombre: str = Field(
        max_length=100,
        unique=True,
        index=True,
    )

    descripcion: str = Field()

    deleted_at: datetime | None = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )