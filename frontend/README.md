Food Store – Frontend
Descripción
Aplicación web desarrollada para el Trabajo Práctico de la Unidad 8 de Programación IV de la Tecnicatura Universitaria en Programación.

El sistema permite administrar categorías, productos e ingredientes mediante una interfaz desarrollada con React y TypeScript, conectada a un backend REST con FastAPI.

Tecnologías utilizadas
React 19
TypeScript
Vite
Tailwind CSS
React Router DOM
TanStack Query: gestión de consultas y mutaciones con la API.
TanStack Form: gestión y validación de formularios.
TanStack Table v8: tablas con ordenamiento y paginación.
Funcionalidades implementadas
Categorías
Listado de categorías.
Alta de nuevas categorías.
Edición de categorías existentes.
Eliminación con confirmación.
Validación del nombre obligatorio.
Productos
Listado de productos.
Alta de productos.
Edición de productos.
Eliminación con confirmación.
Gestión de nombre, descripción, precio base, imágenes y disponibilidad.
Validación del nombre obligatorio y precio no negativo.
Ingredientes
Listado de ingredientes.
Alta de ingredientes.
Edición de ingredientes.
Eliminación con confirmación.
Validación del nombre obligatorio.
Organización del proyecto

text
src/
├── components/
│   ├── CategoriaList.tsx
│   ├── CategoriaModal.tsx
│   ├── ProductoList.tsx
│   ├── ProductoModal.tsx
│   └── ...
├── pages/
│   ├── CategoriasPage.tsx
│   ├── ProductsPage.tsx
│   └── IngredientesPage.tsx
├── services/
│   ├── categoria.ts
│   ├── producto.ts
│   └── ingrediente.ts
├── types/
│   ├── categoria.ts
│   ├── producto.ts
│   └── ingrediente.ts
├── App.tsx
└── main.tsx
Instalación
Instalar las dependencias:


bash
pnpm install
Ejecución
Iniciar el servidor de desarrollo:


bash
pnpm dev
La aplicación estará disponible en:

http://localhost:5173

Backend
El frontend consume una API REST desarrollada con FastAPI.

Dirección del backend:

http://localhost:8000

Documentación interactiva:

http://localhost:8000/docs

Compilación
Para generar la versión de producción:


bash
pnpm build
Verificación
Para ejecutar ESLint:


bash
pnpm lint
Trabajo Práctico – Unidad 8
Programación IV
Tecnicatura Universitaria en Programación a Distancia.