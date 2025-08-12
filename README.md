# Simulador de Compras

Este proyecto es un simulador de compras tipo Ecommerce desarrollado como entrega final para el curso de JavaScript. Permite seleccionar productos, agregarlos a un carrito, modificar cantidades, eliminar productos y finalizar la compra, todo con una experiencia visual moderna y validaciones amigables.

---

## 🛠️ Tecnologías utilizadas

- **HTML5** y **CSS3**
- **JavaScript** (ES6+)
- **Bootstrap 5** (CDN)
- **SweetAlert2** (CDN)
- **fetch API** para carga de productos desde JSON

---

## 🚀 ¿Cómo ejecutar el proyecto?

1. **Descarga o clona** este repositorio.
2. Abre la carpeta en tu editor (recomendado: VS Code).
3. **Inicia un servidor local** (por ejemplo, con la extensión Live Server de VS Code) para evitar problemas de CORS al cargar el JSON.
4. Abre `index.html` en tu navegador.

---

## 📦 Estructura de carpetas

entregable2+mungiello/ │ ├── css/ │ └── style.css ├── js/ │ ├── script.js │ └── productos.json ├── index.html └── README.md


---

## ✨ Funcionalidades principales

- **Carga dinámica de productos** desde un archivo JSON usando fetch.
- **Catálogo visual** de productos con cards y opción de agregar al carrito.
- **Carrito interactivo**: ver, modificar cantidades, eliminar productos y vaciar carrito.
- **Cálculo automático** de totales.
- **Finalización de compra** con resumen y validaciones.
- **Notificaciones visuales** con SweetAlert2 (sin alert ni console.log).
- **Persistencia del carrito** usando localStorage.
- **Diseño responsive** con Bootstrap.

---

## ℹ️ Notas

- Si abres el HTML directamente (doble clic), la carga de productos puede fallar por políticas de seguridad del navegador. Usa siempre un servidor local.
- Puedes modificar los productos editando el archivo `js/productos.json`.

---

## 👨‍💻 Autor

- **Nombre y Apellido:** Gonzalo Mungiello
- **Curso:** JavaScript - Proyecto Final

---

¡Gracias por revisar mi proyecto!
