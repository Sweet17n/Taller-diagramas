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
