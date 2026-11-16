
from pydantic import BaseModel, StringConstraints
from typing import Annotated


NombreIngrediente = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1, max_length=100)
]


class IngredienteCreate(BaseModel):
    nombre: NombreIngrediente


class IngredienteRead(BaseModel):
    id: int
    nombre: str


class IngredienteUpdate(BaseModel):
    nombre: NombreIngrediente
