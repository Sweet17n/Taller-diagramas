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

function esDigito(c) {
    return c && (c.match(/[0-9]/) !== null);
}
