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
