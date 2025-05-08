// Función principal para auto detectar
function analizarInput(input) {
    try {
        const resultado = analizarRelacional(input);
        return `Operador relacional: ${resultado.attribute}`;
    } catch (e) {}

    try {
        const resultado = analizarNumero(input);
        return `Número sin signo: ${resultado.attribute}`;
    } catch (e) {}

    try {
        const resultado = analizarIdentificador(input);
        if (resultado.type === "PALABRA_CLAVE") {
            return `Palabra clave: ${resultado.attribute}`;
        } else {
            return `Identificador: ${resultado.attribute}`;
        }
    } catch (e) {}

    return "Entrada no reconocida.";
}

// ---------- Analizador de identificadores / palabras clave ----------
function analizarIdentificador(input) {
    let estado = "inicio";
    let lexema = "";
    let pos = 0;

    while (true) {
        const c = input[pos] || null;

        switch (estado) {
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
    return c && /[a-zA-Z_]/.test(c);
}

function esDigito(c) {
    return c && /[0-9]/.test(c);
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

// ---------- Analizador de números sin signo ----------
function analizarNumero(input) {
    let estado = "inicio";
    let lexema = "";
    let pos = 0;

    while (true) {
        const c = input[pos] || null;

        switch (estado) {
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

// ---------- Analizador de operadores relacionales ----------
function analizarRelacional(input) {
    let estado = 0;
    let pos = 0;
    let token = { type: 'OPREL' };

    while (true) {
        const c = input[pos] || null;

        switch (estado) {
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
