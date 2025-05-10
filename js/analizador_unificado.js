// Funciones de análisis originales (sin cambios)
function analizarRelacional(input) {
    let estado = 0;
    let pos = 0;
    let token = { type: 'OPREL' };
    
    while (true) {
        const c = input[pos] || null;
        
        switch(estado) {
            case 0:
                if (c === '<') estado = 1;
                else if (c === '=') estado = 5;
                else if (c === '>') estado = 6;
                else if (c === '!') estado = 3;
                else throw new Error("No es un operador relacional válido");
                pos++;
                break;
                
            case 1:
                if (c === '=') {
                    token.attribute = 'LE';
                    pos++;
                    return token;
                } else {
                    token.attribute = 'LT';
                    return token;
                }
                
            case 3:
                if (c === '=') {
                    token.attribute = 'NE';
                    pos++;
                    return token;
                } else {
                    throw new Error("Operador relacional incompleto");
                }
                
            case 5:
                token.attribute = 'EQ';
                return token;
                
            case 6:
                if (c === '=') {
                    token.attribute = 'GE';
                    pos++;
                    return token;
                } else {
                    token.attribute = 'GT';
                    return token;
                }
        }
    }
}

function analizarIdentificador(input) {
    let estado = "inicio";
    let lexema = "";
    let pos = 0;
    
    while (true) {
        const c = input[pos] || null;
        
        switch(estado) {
            case "inicio":
                if (esLetra(c)) {
                    estado = "en_identificador";
                    lexema += c;
                    pos++;
                } else {
                    throw new Error("No es un identificador válido");
                }
                break;
                
            case "en_identificador":
                if (esLetra(c) || esDigito(c)) {
                    lexema += c;
                    pos++;
                } else {
                    return instalarID(lexema);
                }
                break;
        }
    }
}

function esLetra(c) {
    return c && (c.match(/[a-zA-Z_]/) !== null);
}

function esDigito(c) {
    return c && (c.match(/[0-9]/) !== null);
}

function instalarID(lexema) {
    const palabrasClave = {
        "if": "IF",
        "else": "ELSE",
        "while": "WHILE",
        "for": "FOR",
        "return": "RETURN"
    };
    
    if (palabrasClave[lexema]) {
        return { type: "PALABRA_CLAVE", attribute: palabrasClave[lexema] };
    } else {
        return { type: "ID", attribute: lexema };
    }
}

function analizarNumero(input) {
    let estado = "inicio";
    let lexema = "";
    let pos = 0;
    
    while (true) {
        const c = input[pos] || null;
        
        switch(estado) {
            case "inicio":
                if (esDigito(c)) {
                    estado = "entero";
                    lexema += c;
                    pos++;
                } else {
                    throw new Error("No es un número válido");
                }
                break;
                
            case "entero":
                if (esDigito(c)) {
                    lexema += c;
                    pos++;
                } else if (c === '.') {
                    estado = "decimal";
                    lexema += c;
                    pos++;
                } else if (c === 'E' || c === 'e') {
                    estado = "exponente";
                    lexema += c;
                    pos++;
                } else {
                    return { type: "NUMERO", attribute: parseInt(lexema) };
                }
                break;
                
            case "decimal":
                if (esDigito(c)) {
                    lexema += c;
                    pos++;
                } else if (c === 'E' || c === 'e') {
                    estado = "exponente";
                    lexema += c;
                    pos++;
                } else {
                    return { type: "NUMERO", attribute: parseFloat(lexema) };
                }
                break;
                
            case "exponente":
                if (esDigito(c)) {
                    estado = "numero_exponente";
                    lexema += c;
                    pos++;
                } else if (c === '+' || c === '-') {
                    estado = "signo_exponente";
                    lexema += c;
                    pos++;
                } else {
                    throw new Error("Notación científica incompleta");
                }
                break;
                
            case "signo_exponente":
                if (esDigito(c)) {
                    estado = "numero_exponente";
                    lexema += c;
                    pos++;
                } else {
                    throw new Error("Notación científica incompleta");
                }
                break;
                
            case "numero_exponente":
                if (esDigito(c)) {
                    lexema += c;
                    pos++;
                } else {
                    return { type: "NUMERO", attribute: parseFloat(lexema) };
                }
                break;
        }
    }
}

// Nueva función para autodetección
function analizarInput(input) {
    const resultados = [];
    let tieneEspacios = input.includes(' ');
    let tieneSignos = /[!@#$%^&*(),.?":{}|<>]/.test(input);

    // Verificar cada categoría
    try {
        const rel = analizarRelacional(input);
        resultados.push(`Operador relacional: ${rel.attribute}`);
    } catch (e) {}

    try {
        const id = analizarIdentificador(input);
        resultados.push(id.type === "PALABRA_CLAVE" ? 
                       `Palabra clave: ${id.attribute}` : 
                       `Identificador: ${id.attribute}`);
    } catch (e) {}

    try {
        const num = analizarNumero(input);
        resultados.push(`Número: ${num.attribute}`);
    } catch (e) {}

    if (tieneEspacios) {
        resultados.push("Contiene espacios");
    }

    if (tieneSignos) {
        resultados.push("Contiene signos especiales");
    }

    if (resultados.length === 0) {
        return "No se pudo identificar el tipo de entrada";
    }

    return resultados.join("\n");
}
