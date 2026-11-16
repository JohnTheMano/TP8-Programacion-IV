
from sqlmodel import Session, select

from app.ingrediente.model import Ingrediente
from app.ingrediente.schema import IngredienteCreate, IngredienteUpdate


def obtener_ingredientes(session: Session):
    return session.exec(select(Ingrediente)).all()


def obtener_ingrediente(session: Session, ingrediente_id: int):
    return session.get(Ingrediente, ingrediente_id)


def crear_ingrediente(session: Session, datos: IngredienteCreate):
    ingrediente = Ingrediente(nombre=datos.nombre)
    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente


def actualizar_ingrediente(
    session: Session,
    ingrediente_id: int,
    datos: IngredienteUpdate,
):
    ingrediente = session.get(Ingrediente, ingrediente_id)

    if ingrediente is None:
        return None

    ingrediente.nombre = datos.nombre
    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente


def eliminar_ingrediente(session: Session, ingrediente_id: int):
    ingrediente = session.get(Ingrediente, ingrediente_id)

    if ingrediente is None:
        return False

    session.delete(ingrediente)
    session.commit()
    return True
