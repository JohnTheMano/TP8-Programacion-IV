
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.core.database import get_session
from app.ingrediente.schema import (
    IngredienteCreate,
    IngredienteRead,
    IngredienteUpdate,
)
from app.ingrediente import service

router = APIRouter(
    prefix="/ingredientes",
    tags=["ingredientes"],
)


@router.get("/", response_model=list[IngredienteRead])
def listar_ingredientes(
    session: Session = Depends(get_session),
):
    return service.obtener_ingredientes(session)


@router.post(
    "/",
    response_model=IngredienteRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_ingrediente(
    datos: IngredienteCreate,
    session: Session = Depends(get_session),
):
    return service.crear_ingrediente(session, datos)


@router.put("/{ingrediente_id}", response_model=IngredienteRead)
def actualizar_ingrediente(
    ingrediente_id: int,
    datos: IngredienteUpdate,
    session: Session = Depends(get_session),
):
    ingrediente = service.actualizar_ingrediente(
        session, ingrediente_id, datos
    )

    if ingrediente is None:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")

    return ingrediente


@router.delete(
    "/{ingrediente_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_ingrediente(
    ingrediente_id: int,
    session: Session = Depends(get_session),
):
    eliminado = service.eliminar_ingrediente(session, ingrediente_id)

    if not eliminado:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
