
// Cada moneda que ofrece la casa de cambio
class Moneda {
    constructor(id, codigo, nombre, cotizacion, stock) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.cotizacion = cotizacion; 
        this.stock = stock;           
    }

    // convierte un monto en pesos a unidades de esta moneda
    convertir(montoARS) {
        return montoARS / this.cotizacion;
    }

    // informa si hay stock suficiente para vender esa cantidad
    hayStock(cantidad) {
        return this.stock >= cantidad;
    }

    // modifica el estado: descuenta lo vendido del stock
    descontarStock(cantidad) {
        this.stock -= cantidad;
    }

    informar() {
        return `${this.id}) ${this.codigo} - ${this.nombre} | $${this.cotizacion} ARS | stock: ${this.stock.toFixed(2)}`;
    }
}

// Cada operacion de cambio realizada
class Operacion {
    constructor(id, monto, codigo, cotizacion, dineroRecibido) {
        this.id = id;
        this.monto = monto;
        this.codigo = codigo;
        this.cotizacion = cotizacion;
        this.dineroRecibido = dineroRecibido;
    }

    informar() {
        return (
            `Operacion ${this.id}: $${this.monto.toLocaleString("es-AR")} ARS -> ` +
            `${this.dineroRecibido.toFixed(2)} ${this.codigo} ` +
            `(cotizacion: $${this.cotizacion} ARS)`
        );
    }
}

// array de objetos
const monedas = [
    new Moneda(1, "USD", "Dolar estadounidense", 1500, 5000),
    new Moneda(2, "EUR", "Euro", 1750, 3000),
    new Moneda(3, "BRL", "Real brasileno", 280, 20000),
    new Moneda(4, "CLP", "Peso chileno", 1.6, 500000),
    new Moneda(5, "UYU", "Peso uruguayo", 37, 80000)
];

const historial = [];

//FUNCIONES AUXILIARES 

// find: captura una moneda por su codigo (devuelve undefined si no existe)
const buscarMoneda = (lista, codigo) => lista.find((moneda) => moneda.codigo === codigo);

// arma el texto con las monedas para mostrarlo en un prompt
const armarListado = (lista) =>
    lista.map((moneda) => `${moneda.codigo} - ${moneda.nombre} ($${moneda.cotizacion} ARS)`).join("\n");

// pide un numero mayor que cero
function solicitarNumero(mensaje) {
    while (true) {
        const entrada = prompt(mensaje);

        if (entrada === null) {
            return null;
        }

        const numero = Number(entrada.trim().replace(",", "."));

        if (entrada.trim() !== "" && Number.isFinite(numero) && numero > 0) {
            return numero;
        }
        alert("Ingresa un numero mayor que cero.");
    }
}

//OPCIONES DEL SIMULADOR 

function mostrarMonedas(lista) {
    console.log("----- Monedas disponibles -----");
    lista.forEach((moneda) => console.log(moneda.informar()));
}

// Cambiar dinero
function operarCambio(lista, operaciones) {
    const entrada = prompt(
        `Que moneda queres comprar?\n\n${armarListado(lista)}\n\nEscribi el codigo.`
    );

    if (entrada === null) {
        return;
    }

    const moneda = buscarMoneda(lista, entrada.trim().toUpperCase());

    if (moneda === undefined) {
        alert("La moneda seleccionada no esta disponible.");
        console.log("Error: moneda no disponible.");
        return;
    }

    const monto = solicitarNumero(`Ingresa el monto en pesos (ARS) para comprar ${moneda.codigo}:`);

    if (monto === null) {
        return;
    }

    const cantidad = moneda.convertir(monto);

    if (!moneda.hayStock(cantidad)) {
        alert(`No hay stock suficiente de ${moneda.codigo}.`);
        console.log(`Error: stock insuficiente de ${moneda.codigo}. Disponible: ${moneda.stock.toFixed(2)}`);
        return;
    }

    moneda.descontarStock(cantidad);

    const operacion = new Operacion(operaciones.length + 1, monto, moneda.codigo, moneda.cotizacion, cantidad);
    operaciones.push(operacion);

    console.log("----- Resultado del cambio -----");
    console.log(operacion.informar());
    console.log(`Stock restante de ${moneda.codigo}: ${moneda.stock.toFixed(2)}`);
}

//  monedas con cotizacion minima elegida por el usuario
function filtrarPorCotizacion(lista) {
    const minimo = solicitarNumero("Mostrar monedas con cotizacion mayor o igual a (ARS):");

    if (minimo === null) {
        return;
    }

    const filtradas = lista.filter((moneda) => moneda.cotizacion >= minimo);

    if (filtradas.length === 0) {
        console.log(`Ninguna moneda tiene cotizacion mayor o igual a $${minimo} ARS.`);
        return;
    }

    console.log(`----- Monedas con cotizacion >= $${minimo} ARS -----`);
    filtradas.forEach((moneda) => console.log(moneda.informar()));
}

// se ordena una copia para no alterar la lista
function mostrarTop3(lista) {
    const top = [...lista].sort((a, b) => b.cotizacion - a.cotizacion).slice(0, 3);

    console.log("----- Top 3 monedas de mayor cotizacion -----");
    top.forEach((moneda, indice) => {
        console.log(`${indice + 1}) ${moneda.codigo}: $${moneda.cotizacion} ARS`);
    });
}

// busca una moneda por su ID
function consultarPorId(lista) {
    const id = solicitarNumero(`Ingresa el ID de la moneda (1 a ${lista.length}):`);

    if (id === null) {
        return;
    }

    const moneda = lista.find((item) => item.id === id);

    if (moneda === undefined) {
        alert("No existe una moneda con ese ID.");
        console.log(`Error: no existe la moneda con ID ${id}.`);
        return;
    }

    console.log("----- Moneda encontrada -----");
    console.log(moneda.informar());
}

// total de pesos cambiados en todas las operaciones
function mostrarHistorial(operaciones) {
    if (operaciones.length === 0) {
        console.log("Todavia no realizaste operaciones.");
        return;
    }

    console.log("----- Historial de operaciones -----");
    operaciones.forEach((operacion) => console.log(operacion.informar()));

    const totalARS = operaciones.reduce((acumulado, operacion) => acumulado + operacion.monto, 0);
    console.log(`Total cambiado: $${totalARS.toLocaleString("es-AR")} ARS en ${operaciones.length} operacion(es).`);
}

// PROGRAMA PRINCIPAL 
function iniciarSimulador(lista, operaciones) {
    console.log("Simulador de Casa de Cambio iniciado");
    mostrarMonedas(lista);

    let continuar = true;

    while (continuar) {
        const opcion = prompt(
            "CASA DE CAMBIO\n\n" +
            "1 - Cambiar dinero\n" +
            "2 - Ver monedas con cotizacion minima\n" +
            "3 - Ver top 3 de mayor cotizacion\n" +
            "4 - Consultar moneda por ID\n" +
            "5 - Ver historial y total cambiado\n" +
            "0 - Salir"
        );

        if (opcion === null) {
            break;
        }

        switch (opcion.trim()) {
            case "1":
                operarCambio(lista, operaciones);
                break;
            case "2":
                filtrarPorCotizacion(lista);
                break;
            case "3":
                mostrarTop3(lista);
                break;
            case "4":
                consultarPorId(lista);
                break;
            case "5":
                mostrarHistorial(operaciones);
                break;
            case "0":
                continuar = false;
                break;
            default:
                alert("Opcion no valida.");
        }
    }

    console.log("===== Resumen final =====");
    mostrarHistorial(operaciones);
    console.log("Simulador finalizado.");
}


document.getElementById("iniciar").addEventListener("click", () => {
    iniciarSimulador(monedas, historial);
});
