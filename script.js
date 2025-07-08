// Declaración de variables y constantes
const productos = [
    { nombre: "Pan", precio: 100 },
    { nombre: "Leche", precio: 200 },
    { nombre: "Queso", precio: 300 },
    { nombre: "Carne", precio: 500 },
    { nombre: "Verduras", precio: 150 },
    { nombre: "Frutas", precio: 250 }
];

let carrito = [];
let total = 0;

// Función para mostrar el menú de productos
function mostrarMenu() {
    let menu = "Productos disponibles:\n";
    productos.forEach((producto, index) => {
        menu += `${index + 1}. ${producto.nombre} - $${producto.precio}\n`;
    });
    menu += "0. Salir\n";
    return menu;
}

// Función para agregar un producto al carrito
function agregarProducto() {
    let seguirComprando = true;

    while (seguirComprando) {
        alert (mostrarMenu());
        let seleccion = prompt("Seleccione un producto por su número (0 para salir):");
        if (seleccion === "0") {
            break;
        }
        
        let cantidad= prompt("Ingrese la cantidad del producto:");

        let productoSeleccionado = productos[seleccion - 1];

        if (productoSeleccionado) {
            carrito.push({
                nombre: productoSeleccionado.nombre,
                precio: productoSeleccionado.precio,
                cantidad: parseInt(cantidad)
            });
            total += productoSeleccionado.precio * parseInt(cantidad);
            alert(`Agregaste ${cantidad} ${productoSeleccionado.nombre}(s) al carrito.`);
        } else {
            alert("Selección inválida. Intente nuevamente.");
        }

        seguirComprando = confirm("¿Desea agregar otro producto?");
        }
    }

// Función para mostrar el resumen de la compra
function mostrarResumen() {
    console.log("Resumen de la compra:");
    carrito.forEach((item) => {
        console.log(`${item.cantidad} x ${item.nombre} - $${item.precio * item.cantidad}`);
    });
    console.log(`Total a pagar: $${total}`);
    alert(`Total a pagar: $${total}`);
}

// Llamada a las funciones
document.getElementById("Iniciar").addEventListener("click", () => {
agregarProducto();
mostrarResumen();
});



