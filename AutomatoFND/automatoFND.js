// Classe que define um Automato Finito Não Determinístico
class AutomatoFinitoNaoDeterministico {
    constructor(automatoData) {
        // Inicializa os estados iniciais, finais e transições com os dados fornecidos
        this.initialState = automatoData.initial;
        this.finalStates = new Set(automatoData.final);
        this.transitions = automatoData.transitions;
    }
    // Método para processar uma entrada no automato
    processarEntrada(entrada) {
        // Inicializa o conjunto de estados atuais com o estado inicial
        let estadosAtuais = new Set([this.initialState]);
        // Itera sobre cada símbolo da entrada
        for (const simbolo of entrada) {
            // Inicializa um novo conjunto para armazenar os estados alcançados após a leitura do símbolo
            const novosEstados = new Set();
            // Itera sobre cada estado atual
            for (const estadoAtual of estadosAtuais) {
                // Filtra as transições que partem do estado atual e correspondem ao símbolo lido
                const transicoes = this.transitions.filter(t =>
                    t.from === estadoAtual && (t.read === simbolo || t.read === null)
                );
                // Itera sobre as transições encontradas
                for (const transicao of transicoes) {
                    if (transicao.to) {
                        // Adiciona os estados alcançados pela transição ao conjunto de novos estados
                        if (Array.isArray(transicao.to)) {
                            novosEstados.add(...transicao.to);
                        } else {
                            novosEstados.add(transicao.to);
                        }
                    }
                }
            }
            // Atualiza o conjunto de estados atuais com os novos estados alcançados
            estadosAtuais = novosEstados;
        }
        // Verifica se algum estado atual é um estado final
        for (const estadoAtual of estadosAtuais) {
            if (this.finalStates.has(estadoAtual)) {
                return true; // Aceita a entrada
            }
        }
        return false; // Rejeita a entrada
    }
}
// Função assíncrona para criar um AutomatoFinitoNaoDeterministico a partir de um arquivo JSON
async function Automato(arquivo) {
    const response = await fetch(arquivo);
    const dadosAutomato = await response.json();
    return new AutomatoFinitoNaoDeterministico(dadosAutomato);
}
// Função assíncrona para obter casos de teste a partir de um arquivo CSV
async function Testes(arquivo) {
    const response = await fetch(arquivo);
    const texto = await response.text();
    const linhas = texto.split('\n');
    const casosTeste = [];
    // Itera sobre cada linha do arquivo CSV para obter os casos de teste
    for (const linha of linhas) {
        const [entrada, esperado] = linha.trim().split(';');
        casosTeste.push({ entrada, esperado: parseInt(esperado) });
    }
    return casosTeste;
}
// Função principal assíncrona
async function main() {
    // Cria um AutomatoFinitoNaoDeterministico a partir de um arquivo JSON
    const automatoND = await Automato('arquivoFND.json');
    // Obtém casos de teste a partir de um arquivo CSV
    const casosTeste = await Testes('testesFND.csv');
    const resultados = [];
    // Itera sobre cada caso de teste
    for (const { entrada, esperado } of casosTeste) {
        // Marca o início do tempo de processamento
        const startTime = performance.now();
        // Processa a entrada no automato e obtém o resultado (true ou false)
        const resultado = automatoND.processarEntrada(entrada);
        // Calcula o tempo de processamento
        const Time = performance.now() - startTime;

        // Adiciona o resultado ao array de resultados
        resultados.push({
            entrada,
            esperado,
            obtido: resultado ? 1 : 0,
            tempo: Time.toFixed(5)
        });
    }
    // Formata os resultados como texto e junta-os com quebras de linha
    const resultadosTexto = resultados.map(r => `${r.entrada};${r.esperado};${r.obtido};${r.tempo}`).join('\n');
    // Define o texto formatado no elemento HTML com o ID 'resultadoFND'
    document.getElementById('resultadoFND').textContent = resultadosTexto;
}
// Chama a função principal para iniciar o processamento
main();
