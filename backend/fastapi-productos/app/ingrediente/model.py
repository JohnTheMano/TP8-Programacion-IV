
from sqlmodel import SQLModel, Field


class Ingrediente(SQLModel, table=True):
    __tablename__ = "ingredientes"

    id: int | None = Field(default=None, primary_key=True)

    nombre: str = Field(
        max_length=100,
        index=True,
    )
