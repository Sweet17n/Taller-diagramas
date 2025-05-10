document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultContainer = document.getElementById('resultContainer');
    const examples = document.querySelectorAll('.example');

    // Función principal de análisis
    function analizar() {
        const texto = inputText.value.trim();
        resultContainer.innerHTML = '';

        if (!texto) {
            resultContainer.innerHTML = '<p class="info">Ingrese texto para analizar</p>';
            return;
        }

        const resultados = [];
        const tieneEspacios = texto.includes(' ');
        const tieneSignos = /[^\w\s=<>!]/.test(texto);

        // Analizar todas las posibilidades
        try {
            const rel = analizarRelacional(texto);
            resultados.push(`Operador relacional: <strong>${rel.attribute}</strong>`);
        } catch (e) {}

        try {
            const id = analizarIdentificador(texto);
            resultados.push(id.type === "PALABRA_CLAVE" 
                ? `Palabra clave: <strong>${id.attribute}</strong>` 
                : `Identificador: <strong>${id.attribute}</strong>`);
        } catch (e) {}

        try {
            const num = analizarNumero(texto);
            resultados.push(`Número: <strong>${num.attribute}</strong>`);
        } catch (e) {}

        if (tieneEspacios) resultados.push("Contiene <strong>espacios</strong>");
        if (tieneSignos) resultados.push("Contiene <strong>signos especiales</strong>");

        if (resultados.length === 0) {
            resultContainer.innerHTML = '<p class="error">No se reconoce ningún elemento léxico válido</p>';
            return;
        }

        let html = '<div class="token"><strong>Análisis automático:</strong><ul>';
        resultados.forEach(item => {
            html += `<li>${item}</li>`;
        });
        html += '</ul></div>';
        
        resultContainer.innerHTML = html;
    }

    // Hacer ejemplos clickables
    examples.forEach(example => {
        example.addEventListener('click', function() {
            inputText.value = this.textContent;
            inputText.focus();
        });
    });

    // Asignar evento al botón
    analyzeBtn.addEventListener('click', analizar);

    // Analizar al presionar Enter
    inputText.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analizar();
        }
    });
});

// Funciones de análisis específicas
function analizarRelacional(input) {
    const operadores = {
        '<': 'LT', '<=': 'LE',
        '>': 'GT', '>=': 'GE',
        '==': 'EQ', '!=': 'NE'
    };
    
    if (operadores[input]) {
        return { type: 'OPREL', attribute: operadores[input] };
    }
    throw new Error("No es un operador relacional válido");
}

function analizarIdentificador(input) {
    const palabrasClave = {
        "if": "IF", "else": "ELSE",
        "while": "WHILE", "for": "FOR",
        "return": "RETURN"
    };
    
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(input)) {
        throw new Error("No es un identificador válido");
    }
    
    return palabrasClave[input] 
        ? { type: "PALABRA_CLAVE", attribute: palabrasClave[input] }
        : { type: "ID", attribute: input };
}

function analizarNumero(input) {
    if (!/^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(input)) {
        throw new Error("No es un número válido");
    }
    
    return {
        type: "NUMERO",
        attribute: input.includes('.') || /[eE]/.test(input) 
               ? parseFloat(input) 
               : parseInt(input)
    };
}
