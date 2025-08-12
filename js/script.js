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
let productos = productosBase.map(prod => ({
    nombre: prod.nombre,
    precio: parseFloat((prod.precio * 1.21).toFixed(2))
}));

// ===================== 2. Carrito y LocalStorage =====================
// Intentamos recuperar el carrito guardado en localStorage, o lo inicializamos vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ===================== 3. Renderizado de productos =====================
// Rellena el select y además muestra cards clickeables para sumar al carrito
function renderProductos() {
    // Relleno del select existente
    const select = document.getElementById("producto");
    if (select) {
        select.innerHTML = "";
        productos.forEach((prod, idx) => {
            const option = document.createElement("option");
            option.value = idx;
            option.textContent = `${prod.nombre} - $${prod.precio}`;
            select.appendChild(option);
        });
    }

    // Cards en el contenedor
    const lista = document.getElementById("listaProductos");
    if (lista) {
        lista.innerHTML = "";
        productos.forEach((prod, idx) => {
            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-md-4 col-lg-3";
            col.innerHTML = `
                <div class="card h-100">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${prod.nombre}</h5>
                        <p class="card-text mb-3">$${prod.precio}</p>
                        <div class="input-group mt-auto">
                            <input type="number" class="form-control" id="cant-${idx}" min="1" value="1">
                            <button class="btn btn-primary" data-add="${idx}">Agregar</button>
                        </div>
                    </div>
                </div>`;
            lista.appendChild(col);
        });

        // Delegación de eventos para agregar
        lista.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-add]");
            if (!btn) return;
            const idx = parseInt(btn.getAttribute("data-add"), 10);
            const input = document.getElementById(`cant-${idx}`);
            const cantidad = Math.max(1, parseInt(input?.value || "1", 10));
            agregarAlCarrito(idx, cantidad);
        });
    }
}

// ===================== 3b. Cargar productos desde productos.json (opcional) =====================
async function actualizarProductosDesdeJSON() {
    try {
        const response = await fetch("js/productos.json", { cache: "no-store" });
        if (!response.ok) throw new Error("No se pudo cargar productos.json");
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Formato inválido en productos.json");
        const normalizados = data
            .filter(item => item && typeof item.nombre === "string" && typeof item.precio === "number")
            .map(item => ({
                nombre: item.nombre,
                precio: parseFloat((item.precio * 1.21).toFixed(2))
            }));
        if (normalizados.length === 0) return;
        productos = normalizados;
        renderProductos();
    } catch (error) {
        console.warn("No se pudo actualizar productos desde JSON. Se usan valores por defecto.", error.message);
    }
}

// ===================== 4. Renderizado del carrito =====================
// Muestra el contenido del carrito y el total en el DOM
function renderCarrito() {
    const ul = document.getElementById("carrito");
    ul.innerHTML = ""; // Limpiamos la lista antes de llenarla
    carrito.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center gap-2";
        const subtotal = (item.precio * item.cantidad);
        li.innerHTML = `
            <div class="flex-grow-1">
                <strong>${item.nombre}</strong>
                <div class="small text-muted">$${item.precio} c/u</div>
            </div>
            <div class="input-group input-group-sm" style="width: 150px;">
                <button class="btn btn-outline-secondary" data-restar="${index}">-</button>
                <input class="form-control text-center" data-cant="${index}" type="number" min="1" value="${item.cantidad}">
                <button class="btn btn-outline-secondary" data-sumar="${index}">+</button>
            </div>
            <span class="badge bg-primary rounded-pill">$${subtotal}</span>
            <button class="btn btn-sm btn-danger" data-eliminar="${index}">Eliminar</button>
        `;
        ul.appendChild(li);
    });
    // Calculamos el total usando reduce
    const subtotal = carrito.reduce((acum, item) => acum + item.precio * item.cantidad, 0);
    const costoEnvio = obtenerCostoEnvio();
    const descuento = obtenerDescuento(subtotal);
    const total = Math.max(0, subtotal + costoEnvio - descuento);
    document.getElementById("total").textContent = `Subtotal: $${subtotal} | Envío: $${costoEnvio} | Descuento: $${descuento} | Total: $${total}`;
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
        Swal.fire({
            icon: 'error',
            title: 'Cantidad inválida',
            text: 'Por favor, ingresa una cantidad válida (mayor a 0).'
        });
        return;
    }
    agregarAlCarrito(parseInt(idx, 10), cantidad);
});

function agregarAlCarrito(indiceProducto, cantidad) {
    const prod = productos[indiceProducto];
    if (!prod) return;
    const existente = carrito.find(item => item.nombre === prod.nombre);
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ nombre: prod.nombre, precio: prod.precio, cantidad });
    }
    renderCarrito();
}

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

// ===================== 10. Finalizar Compra =====================

// Simulamos una "petición al servidor" con una Promesa
function procesarCompra(carrito) {
    return new Promise((resolve, reject) => {
        // Simulamos un pequeño retraso de red
        setTimeout(() => {
            if (carrito.length === 0) {
                reject(new Error("El carrito está vacío."));
            } else {
                // Simulamos un éxito
                resolve("Compra realizada con éxito 🎉");
            }
        }, 2000);
    });
}


document.getElementById("finalizarCompra").addEventListener("click", async () => {
    try {
        document.getElementById("total").textContent = "Procesando compra...";
        const mensaje = await procesarCompra(carrito);
        // Notificación de éxito
        await Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: mensaje
        });
        carrito = [];
        localStorage.removeItem("carrito");
        renderCarrito();
    } catch (error) {
        // Notificación de error
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
        renderCarrito();
    } finally {
    }
});


// ===================== 9. Inicialización =====================
// Llamamos a las funciones para mostrar los productos y el carrito al cargar la página
renderProductos();
renderCarrito();
actualizarProductosDesdeJSON();

// ===================== 11. Eventos de carrito (sumar, restar, eliminar) =====================
document.getElementById("carrito").addEventListener("click", (e) => {
    const btnSumar = e.target.closest("button[data-sumar]");
    const btnRestar = e.target.closest("button[data-restar]");
    const btnEliminar = e.target.closest("button[data-eliminar]");
    if (btnSumar) {
        const idx = parseInt(btnSumar.getAttribute("data-sumar"), 10);
        carrito[idx].cantidad += 1;
        renderCarrito();
    }
    if (btnRestar) {
        const idx = parseInt(btnRestar.getAttribute("data-restar"), 10);
        carrito[idx].cantidad = Math.max(1, carrito[idx].cantidad - 1);
        renderCarrito();
    }
    if (btnEliminar) {
        const idx = parseInt(btnEliminar.getAttribute("data-eliminar"), 10);
        carrito.splice(idx, 1);
        renderCarrito();
    }
});

document.getElementById("carrito").addEventListener("change", (e) => {
    const input = e.target.closest("input[data-cant]");
    if (!input) return;
    const idx = parseInt(input.getAttribute("data-cant"), 10);
    const nueva = Math.max(1, parseInt(input.value || "1", 10));
    carrito[idx].cantidad = nueva;
    renderCarrito();
});

// ===================== 12. Envío y cupones =====================
function obtenerCostoEnvio() {
    const seleccionado = document.querySelector('input[name="envio"]:checked');
    const valor = seleccionado ? parseFloat(seleccionado.value) : 0;
    return Number.isFinite(valor) ? valor : 0;
}

// Cupón simple: DESCUENTO10 = 10%, DESCUENTO20 = 20%
function obtenerDescuento(subtotal) {
    const cupon = (localStorage.getItem("cuponAplicado") || "").toUpperCase();
    if (cupon === "DESCUENTO10") return Math.round(subtotal * 0.10);
    if (cupon === "DESCUENTO20") return Math.round(subtotal * 0.20);
    return 0;
}

function aplicarCupon(code) {
    const normalizado = (code || "").trim().toUpperCase();
    const valido = ["DESCUENTO10", "DESCUENTO20"];
    const estado = document.getElementById("cuponEstado");
    if (valido.includes(normalizado)) {
        localStorage.setItem("cuponAplicado", normalizado);
        estado.textContent = `Cupón aplicado: ${normalizado}`;
        estado.className = "text-success";
        renderCarrito();
    } else {
        localStorage.removeItem("cuponAplicado");
        estado.textContent = "Cupón inválido";
        estado.className = "text-danger";
        renderCarrito();
    }
}

document.getElementById("aplicarCupon")?.addEventListener("click", () => {
    const code = document.getElementById("cupon").value;
    aplicarCupon(code);
});

document.getElementById("metodoEnvio")?.addEventListener("change", () => {
    renderCarrito();
});

// ===================== 13. Validación de checkout =====================
document.getElementById("finalizarCompra").addEventListener("click", async () => {
    const nombre = document.getElementById("nombre")?.value?.trim();
    const email = document.getElementById("email")?.value?.trim();
    const direccion = document.getElementById("direccion")?.value?.trim();
    if (!carrito.length) {
        await Swal.fire({ icon: 'warning', title: 'Carrito vacío', text: 'Agrega productos antes de finalizar.' });
        return;
    }
    if (!nombre || !email || !direccion) {
        await Swal.fire({ icon: 'warning', title: 'Datos incompletos', text: 'Completa tus datos para continuar.' });
        return;
    }
});