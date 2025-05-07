document.addEventListener('DOMContentLoaded', function() {
    const lexerType = document.getElementById('lexerType');
    const inputText = document.getElementById('inputText');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultContainer = document.getElementById('resultContainer');
    const examplesContainer = document.getElementById('examplesContainer');
    
    // Ejemplos para cada tipo de analizador
    const examples = {
        relacional: ['<', '<=', '>', '>=', '==', '!=', '<>'],
        identificador: ['variable1', 'if', 'while', '123invalido', '_temp'],
        numeros: ['123', '45.67', '1.2E3', '5E-2', '3.14', '1.2.3', 'E45']
    };
    
    // Actualizar ejemplos cuando cambia el tipo de analizador
    lexerType.addEventListener('change', updateExamples);
    
    // Manejar clic en el botón de análisis
    analyzeBtn.addEventListener('click', analyzeInput);
    
    // Manejar clic en los ejemplos
    examplesContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('example')) {
            inputText.value = e.target.textContent;
            analyzeInput();
        }
    });
    
    function analyzeInput() {
        const text = inputText.value.trim();
        const type = lexerType.value;
        
        resultContainer.innerHTML = '';
        
        if (!text) {
            resultContainer.innerHTML = '<p class="error">Por favor ingrese texto para analizar</p>';
            return;
        }
        
        try {
            let token;
            
            switch(type) {
                case 'relacional':
                    token = analizarRelacional(text);
                    break;
                case 'identificador':
                    token = analizarIdentificador(text);
                    break;
                case 'numeros':
                    token = analizarNumero(text);
                    break;
            }
            
            if (token) {
                const tokenHTML = `
                    <div class="token">
                        <strong>Tipo:</strong> ${token.type}<br>
                        <strong>Atributo:</strong> ${token.attribute || 'N/A'}
                    </div>
                `;
                resultContainer.innerHTML = tokenHTML;
            }
        } catch (error) {
            resultContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        }
    }
    
    function updateExamples() {
        const type = lexerType.value;
        examplesContainer.innerHTML = examples[type]
            .map(ex => `<span class="example">${ex}</span>`)
            .join('');
    }
    
    updateExamples();
});
