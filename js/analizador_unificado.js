// Funciones básicas de análisis
function esLetra(c) {
    return c && (c.match(/[a-zA-Z_]/) !== null);
}

function esDigito(c) {
    return c && (c.match(/[0-9]/) !== null);
}

// Analizador de operadores relacionales
function analizarRelacional(input) {
    if (/^[<>]=?|==|!=?$/.test(input)) {
        return {
            type: 'OPREL',
            attribute: input.replace('=', 'E').replace('!', 'N')
        };
    }
    throw new Error("No es un operador relacional válido");
}

// Analizador de identificadores/palabras clave
function analizarIdentificador(input) {
    if (!esLetra(input[0])) throw new Error("No comienza con letra");
    
    const palabrasClave = {
        "if": "IF", "else": "ELSE", "while": "WHILE", 
        "for": "FOR", "return": "RETURN"
    };
    
    if (palabrasClave[input]) {
        return { type: "PALABRA_CLAVE", attribute: palabrasClave[input] };
    }
    
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(input)) {
        throw new Error("No es un identificador válido");
    }
    
    return { type: "ID", attribute: input };
}

// Analizador de números
function analizarNumero(input) {
    if (!/^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(input)) {
        throw new Error("No es un número válido");
    }
    
    return {
        type: "NUMERO",
        attribute: input.includes('.') || input.includes('e') || input.includes('E') 
               ? parseFloat(input) 
               : parseInt(input)
    };
}

// Función principal de autodetección
function analizarInput(input) {
    const resultados = [];
    const tieneEspacios = input.includes(' ');
    const tieneSignos = /[^\w\s=<>!]/.test(input);

    // Verificar cada categoría
    try {
        const rel = analizarRelacional(input);
        resultados.push(`Operador relacional: ${rel.attribute}`);
    } catch (e) {}

    try {
        const id = analizarIdentificador(input);
        resultados.push(id.type === "PALABRA_CLAVE" 
            ? `Palabra clave: ${id.attribute}` 
            : `Identificador: ${id.attribute}`);
    } catch (e) {}

    try {
        const num = analizarNumero(input);
        resultados.push(`Número: ${num.attribute}`);
    } catch (e) {}

    // Elementos adicionales
    if (tieneEspacios) resultados.push("Contiene espacios");
    if (tieneSignos) resultados.push("Contiene signos especiales");

    return resultados.length > 0 
        ? resultados.join('\n') 
        : "No se pudo identificar el tipo de entrada";
}
