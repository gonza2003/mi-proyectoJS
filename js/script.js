// ===================== 1. Definición de productos =====================
// Array base de productos, cada uno con nombre y precio sin IVA
const productosBase = [
    { nombre: "Pan", precio: 100 },
    { nombre: "Leche", precio: 200 },
    { nombre: "Queso", precio: 300 },
    { nombre: "Carne", precio: 500 },
    { nombre: "Verduras", precio: 150 },
    { nombre: "Frutas", precio: 250 }
];

// Creamos un nuevo array de productos con el precio final (con IVA)
const productos = productosBase.map(prod => ({
    nombre: prod.nombre,
    precio: parseFloat((prod.precio * 1.21).toFixed(2))
}));

// ===================== 2. Carrito y LocalStorage =====================
// Intentamos recuperar el carrito guardado en localStorage, o lo inicializamos vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ===================== 3. Renderizado de productos en el <select> =====================
// Llena el <select> con los productos disponibles
function renderProductos() {
    const select = document.getElementById("producto");
    select.innerHTML = ""; // Limpiamos el select antes de llenarlo
    productos.forEach((prod, idx) => {
        const option = document.createElement("option");
        option.value = idx; // El valor será el índice del producto
        option.textContent = `${prod.nombre} - $${prod.precio}`;
        select.appendChild(option);
    });
}

// ===================== 4. Renderizado del carrito =====================
// Muestra el contenido del carrito y el total en el DOM
function renderCarrito() {
    const ul = document.getElementById("carrito");
    ul.innerHTML = ""; // Limpiamos la lista antes de llenarla
    carrito.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.cantidad} x ${item.nombre} - $${item.precio * item.cantidad}`;
        ul.appendChild(li);
    });
    // Calculamos el total usando reduce
    const total = carrito.reduce((acum, item) => acum + item.precio * item.cantidad, 0);
    document.getElementById("total").textContent = `Total: $${total}`;
    // Guardamos el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ===================== 5. Evento para agregar productos al carrito =====================
// Captura el evento de envío del formulario y agrega el producto seleccionado al carrito
document.getElementById("formagregar").addEventListener("submit", function(e) {
    e.preventDefault(); // Evita que la página se recargue
    const idx = document.getElementById("producto").value; // Índice del producto seleccionado
    const cantidad = parseInt(document.getElementById("cantidad").value); // Cantidad ingresada
     // Validación de entrada
    if (isNaN(cantidad) || cantidad < 1) {
        alert("Por favor, ingresa una cantidad válida (mayor a 0).");
        return;
    }
    const prod = productos[idx]; // Producto seleccionado
    // Buscamos si el producto ya está en el carrito
    const existente = carrito.find(item => item.nombre === prod.nombre);
    if (existente) {
        // Si ya está, sumamos la cantidad
        existente.cantidad += cantidad;
    } else {
        // Si no está, lo agregamos como nuevo
        carrito.push({ nombre: prod.nombre, precio: prod.precio, cantidad });
    }
    renderCarrito(); // Actualizamos la vista del carrito
});

// ===================== 6. Buscar producto por nombre =====================
// Busca un producto exacto por nombre y lo muestra en el DOM
document.getElementById("btnBuscar").addEventListener("click", () => {
    const nombre = document.getElementById("busqueda").value.trim().toLowerCase();
    const prod = productos.find(p => p.nombre.toLowerCase() === nombre);
    // Mostramos el resultado en un nuevo elemento o en consola
    let resultados = document.getElementById("resultados");
    if (!resultados) {
        resultados = document.createElement("section");
        resultados.id = "resultados";
        document.body.appendChild(resultados);
    }
    resultados.textContent = prod
        ? `Producto encontrado: ${prod.nombre} - $${prod.precio}`
        : "Producto no encontrado.";
});

// ===================== 7. Filtrar productos por nombre parcial =====================
// Filtra productos cuyo nombre contenga el texto ingresado
document.getElementById("filtroNombre").addEventListener("input", () => {
    const texto = document.getElementById("filtroNombre").value.trim().toLowerCase();
    let resultados = document.getElementById("resultados");
    if (!resultados) {
        resultados = document.createElement("section");
        resultados.id = "resultados";
        document.body.appendChild(resultados);
    }
    if (texto === "") {
        resultados.textContent = "";
        return;
    }
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    resultados.innerHTML = filtrados.length
        ? filtrados.map(p => `${p.nombre} - $${p.precio}`).join("<br>")
        : "No se encontraron productos.";
});

// ===================== 8. Vaciar el carrito =====================
// Evento para vaciar el carrito y actualizar el DOM y localStorage
document.getElementById("vaciarCarrito").addEventListener("click", () => {
    carrito = []; // Vacía el array
    localStorage.removeItem("carrito"); // Elimina del storage
    renderCarrito(); // Actualiza la vista
});

// ===================== 9. Inicialización =====================
// Llamamos a las funciones para mostrar los productos y el carrito al cargar la página
renderProductos();
renderCarrito();