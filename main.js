document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultContainer = document.getElementById('resultContainer');

    analyzeBtn.addEventListener('click', function() {
        const text = inputText.value.trim();
        resultContainer.innerHTML = '';

        if (!text) {
            resultContainer.innerHTML = '<p class="error">Ingrese texto</p>';
            return;
        }

        // Analizar TODAS las categorías
        const resultados = {
            espacios: tieneEspacios(text),
            relacional: esOperadorRelacional(text),
            identificador: esIdentificador(text),
            numero: esNumero(text),
            signos: tieneSignos(text)
        };

        // Mostrar resultados combinados
        let html = '<div class="token"><strong>Análisis:</strong><ul>';
        
        for (const [categoria, valido] of Object.entries(resultados)) {
            if (valido) {
                if (categoria === 'espacios') {
                    html += `<li>✅ Contiene <strong>espacios en blanco</strong></li>`;
                } else if (categoria === 'signos') {
                    html += `<li>✅ Contiene <strong>signos adicionales</strong></li>`;
                } else {
                    html += `<li>✅ Es un <strong>${categoria}</strong> válido</li>`;
                }
            }
        }

        html += '</ul></div>';
        resultContainer.innerHTML = html;
    });
});

// Funciones de análisis (adaptadas):
function esOperadorRelacional(input) {
    try {
        analizarRelacional(input);
        return true;
    } catch {
        return false;
    }
}

function esIdentificador(input) {
    try {
        analizarIdentificador(input);
        return true;
    } catch {
        return false;
    }
}

function esNumero(input) {
    try {
        analizarNumero(input);
        return true;
    } catch {
        return false;
    }
}

function tieneEspacios(input) {
    return input.includes(' ');
}

function tieneSignos(input) {
    const signos = /[!@#$%^&*(),.?":{}|<>]/;
    return signos.test(input);
}
