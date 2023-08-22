// Classe que define um Autômato Finito Não Determinístico com Movimento Vazio
class AutomatoFinitoNaoDeterministicoMovimentoVazio {
    constructor(automatoData) {
        // Inicializa os estados iniciais, finais e transições com os dados fornecidos
        this.initialState = automatoData.initial;
        this.finalStates = new Set(automatoData.final);
        this.transitions = automatoData.transitions;
    }
    // Método para processar uma entrada no autômato com movimento vazio
    processarEntrada(entrada) {
        // Inicializa o conjunto de estados atuais com o estado inicial após o fechamento epsilon
        let estadosAtuais = this.epsilonFechamento(new Set([this.initialState]));
        // Itera sobre cada símbolo da entrada
        for (const simbolo of entrada) {
            // Inicializa um novo conjunto para armazenar os estados alcançados após a leitura do símbolo
            const novosEstados = new Set();
            // Itera sobre cada estado atual
            for (const estadoAtual of estadosAtuais) {
                // Filtra as transições que partem do estado atual e correspondem ao símbolo lido ou movimento vazio
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
            // Atualiza o conjunto de estados atuais com os novos estados alcançados após fechamento epsilon
            estadosAtuais = this.epsilonFechamento(novosEstados);
        }
        // Verifica se algum estado atual é um estado final
        for (const estadoAtual of estadosAtuais) {
            if (this.finalStates.has(estadoAtual)) {
                return true; // Aceita a entrada
            }
        }
        return false; // Rejeita a entrada
    }
    // Método para realizar o fechamento epsilon a partir de um conjunto de estados
    epsilonFechamento(estado) {
        // Inicializa um conjunto de estados com o mesmo conteúdo do conjunto de entrada
        const estadosFechamento = new Set(estado);
        // Inicializa uma pilha com os estados do conjunto de entrada
        const stack = [...estado];
        // Enquanto a pilha não estiver vazia
        while (stack.length > 0) {
            // Remove o estado atual da pilha
            const estadoAtual = stack.pop();
            // Filtra as transições de movimento vazio que partem do estado atual
            const transicoesEpsilon = this.transitions.filter(t =>
                t.from === estadoAtual && t.read === null
            );
            // Itera sobre as transições de movimento vazio encontradas
            for (const transicao of transicoesEpsilon) {
                if (transicao.to) {
                    // Adiciona os estados alcançados pela transição ao conjunto de fechamento
                    if (Array.isArray(transicao.to)) {
                        for (const estadoTo of transicao.to) {
                            if (!estadosFechamento.has(estadoTo)) {
                                estadosFechamento.add(estadoTo);
                                stack.push(estadoTo);
                            }
                        }
                    } else {
                        if (!estadosFechamento.has(transicao.to)) {
                            estadosFechamento.add(transicao.to);
                            stack.push(transicao.to);
                        }
                    }
                }
            }
        }
        return estadosFechamento; // Retorna o conjunto de fechamento epsilon
    }
}
// Função assíncrona para criar um AutômatoFinitoNaoDeterministicoMovimentoVazio a partir de um arquivo JSON
async function AutomatoMovimentoVazio(arquivo) {
    // Realiza uma requisição assíncrona para obter os dados do arquivo JSON
    const response = await fetch(arquivo);
    const dadosAutomato = await response.json();
    // Retorna uma nova instância do AutômatoFinitoNaoDeterministicoMovimentoVazio
    return new AutomatoFinitoNaoDeterministicoMovimentoVazio(dadosAutomato);
}
// Função assíncrona para obter casos de teste a partir de um arquivo CSV
async function TestesMovimentoVazio(arquivo) {
    // Realiza uma requisição assíncrona para obter o conteúdo do arquivo CSV
    const response = await fetch(arquivo);
    const texto = await response.text();
    // Divide o texto em linhas para obter os casos de teste
    const linhas = texto.split('\n');
    const casosTeste = [];
    // Itera sobre cada linha do arquivo CSV para obter os casos de teste
    for (const linha of linhas) {
        // Divide a linha em entrada e valor esperado, transforma o valor em um número inteiro
        const [entrada, esperado] = linha.trim().split(';');
        casosTeste.push({ entrada, esperado: parseInt(esperado) });
    }
    return casosTeste; // Retorna o array de casos de teste
}
// Função principal assíncrona
async function mainMovimentoVazio() {
    // Chama a função para criar o autômato a partir de um arquivo JSON
    const automatoND = await AutomatoMovimentoVazio('arquivoFNDMV.json');
    // Chama a função para obter casos de teste a partir de um arquivo CSV
    const casosTeste = await TestesMovimentoVazio('testesFNDMV.csv');
    const resultados = [];
    // Itera sobre cada caso de teste
    for (const { entrada, esperado } of casosTeste) {
        // Marca o início do tempo de processamento
        const startTime = performance.now();
        // Processa a entrada no autômato e obtém o resultado (true ou false)
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
    // Define o texto formatado no elemento HTML com o ID 'resultado_movimento_vazio'
    document.getElementById('resultado_movimento_vazio').textContent = resultadosTexto;
}
// Chama a função principal para iniciar o processamento
mainMovimentoVazio();
