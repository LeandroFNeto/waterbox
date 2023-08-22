class AutomatoFinito {
    constructor(automatoData) {
        // Define o estado inicial do autômato
        this.initialState = automatoData.initial;
        // Cria um conjunto de estados finais do autômato
        this.finalStates = new Set(automatoData.final);
        // Armazena as transições do autômato
        this.transitions = automatoData.transitions;
    }

    processarEntrada(entrada) {
        // Inicializa o estado atual com o estado inicial do autômato
        let estadoAtual = this.initialState;
        // Itera sobre os símbolos da entrada
        for (const simbolo of entrada) {
            // Procura a transição adequada para o estado atual e símbolo
            const transicao = this.transitions.find(t =>
                t.from === estadoAtual && (t.read === simbolo || t.read === null)
            );
            // Se não houver transição, retorna falso (rejeita)
            if (!transicao) {
                return false;
            }
            // Atualiza o estado atual com o estado de destino da transição
            estadoAtual = transicao.to;
        }
        // Verifica se o estado atual é um estado final
        return this.finalStates.has(estadoAtual);
    }
}
async function Automato(arquivo) {
    // Faz o fetch dos dados do autômato a partir do arquivo JSON
    const response = await fetch(arquivo);
    const dadosAutomato = await response.json();
    // Retorna uma nova instância do autômato com os dados obtidos
    return new AutomatoFinito(dadosAutomato);
}
async function Testes(arquivo) {
    // Faz o fetch dos casos de teste a partir do arquivo CSV
    const response = await fetch(arquivo);
    const texto = await response.text();
    const linhas = texto.split('\n');
    const casosTeste = [];
    // Lê cada linha do arquivo CSV, divide a entrada e o resultado esperado
    for (const linha of linhas) {
        const [entrada, esperado] = linha.trim().split(';');
        // Adiciona o caso de teste a um array
        casosTeste.push({ entrada, esperado: parseInt(esperado) });
    }
    // Retorna o array de casos de teste
    return casosTeste;
}
async function main() {
    // Carrega o autômato a partir do arquivo JSON
    const automato = await Automato('arquivoFD.json');
    // Carrega os casos de teste a partir do arquivo CSV
    const casosTeste = await Testes('testesFD.csv');
    const resultados = [];
    // Itera sobre cada caso de teste
    for (const { entrada, esperado } of casosTeste) {
        // Marca o início da medição de tempo
        const inicio = performance.now();
        // Executa o autômato para a entrada do caso de teste
        const resultado = automato.processarEntrada(entrada);
        // Calcula o tempo decorrido
        const Time = performance.now() - inicio;
        // Adiciona o resultado do caso de teste ao array de resultados
        resultados.push({
            entrada,
            esperado,
            obtido: resultado ? 1 : 0,
            tempo: Time.toFixed(5)
        });
    }
    // Formata os resultados como texto
    const resultadosTexto = resultados.map(r => `${r.entrada};${r.esperado};${r.obtido};${r.tempo}`).join('\n');
    // Atualiza o conteúdo do elemento HTML com os resultados
    document.getElementById('resultado').textContent = resultadosTexto;
}

// Chama a função principal para executar o programa
main();
