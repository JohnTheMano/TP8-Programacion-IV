from sqlmodel import Session, SQLModel, select

from app.core.database import engine
from app.categoria.model import Categoria
from app.ingrediente.model import Ingrediente
from app.pedidos import model as pedido_model
from app.producto.model import Producto, ProductoCategoria
from app.modules.usuarios.model import Rol, Usuario, UsuarioRol


ROLES = [
    ("admin", "Administrador del sistema"),
    ("user", "Usuario registrado"),
    ("CLIENTE", "Cliente que puede gestionar sus pedidos"),
]

CATEGORIES = [
    ("Bebidas", "Bebidas para acompañar tus comidas."),
    ("Platos principales", "Platos principales del menú."),
    ("Postres", "Opciones dulces."),
]

PRODUCTS = [
    ("Limonada de prueba", "Bebida refrescante de limón.", 1500.0, "Bebidas"),
    ("Hamburguesa de prueba", "Hamburguesa clásica.", 6500.0, "Platos principales"),
    ("Flan de prueba", "Flan casero con caramelo.", 2500.0, "Postres"),
]

INGREDIENTS = ["Limón", "Carne", "Harina", "Leche"]


def seed():
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        roles_by_name = {}
        for nombre, descripcion in ROLES:
            rol = session.exec(select(Rol).where(Rol.nombre == nombre)).first()
            if rol is None:
                rol = Rol(nombre=nombre, descripcion=descripcion)
                session.add(rol)
                session.flush()
            roles_by_name[nombre] = rol

        session.commit()

        user_role = roles_by_name["user"]
        cliente_role = roles_by_name["CLIENTE"]
        for usuario in session.exec(select(Usuario)).all():
            has_user_role = session.get(UsuarioRol, (usuario.id, user_role.id))
            has_cliente_role = session.get(
                UsuarioRol,
                (usuario.id, cliente_role.id),
            )
            if has_user_role is not None and has_cliente_role is None:
                session.add(
                    UsuarioRol(
                        usuario_id=usuario.id,
                        rol_id=cliente_role.id,
                    )
                )

        categories_by_name = {}
        for nombre, descripcion in CATEGORIES:
            categoria = session.exec(
                select(Categoria).where(Categoria.nombre == nombre)
            ).first()
            if categoria is None:
                categoria = Categoria(nombre=nombre, descripcion=descripcion)
                session.add(categoria)
                session.flush()
            categories_by_name[nombre] = categoria

        for nombre, descripcion, precio, categoria_nombre in PRODUCTS:
            producto = session.exec(
                select(Producto).where(Producto.nombre == nombre)
            ).first()
            if producto is None:
                producto = Producto(
                    nombre=nombre,
                    descripcion=descripcion,
                    precio_base=precio,
                    imagenes_url=[],
                    disponible=True,
                )
                session.add(producto)
                session.flush()

            categoria = categories_by_name[categoria_nombre]
            association = session.get(
                ProductoCategoria,
                (producto.id, categoria.id),
            )
            if association is None:
                session.add(
                    ProductoCategoria(
                        producto_id=producto.id,
                        categoria_id=categoria.id,
                    )
                )

        for nombre in INGREDIENTS:
            ingrediente = session.exec(
                select(Ingrediente).where(Ingrediente.nombre == nombre)
            ).first()
            if ingrediente is None:
                session.add(Ingrediente(nombre=nombre))

        session.commit()

    print("Seed ejecutado: roles y datos iniciales verificados.")


if __name__ == "__main__":
    seed()
