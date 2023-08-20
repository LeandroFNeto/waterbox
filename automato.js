class AutomatoFinito {
    constructor(automatoData) {
        this.initialState = automatoData.initial;
        this.finalStates = new Set(automatoData.final);
        this.transitions = automatoData.transitions;
    }

    processarEntrada(entrada) {
        let estadoAtual = this.initialState;
        for (const simbolo of entrada) {
            const transicao = this.transitions.find(t =>
                t.from === estadoAtual && (t.read === simbolo || t.read === null)
            );
            if (!transicao) {
                return false;
            }
            estadoAtual = transicao.to;
        }
        return this.finalStates.has(estadoAtual); // Verifica se o estado final é alcançado
    }
}

async function Automato(arquivo) {
    const response = await fetch(arquivo);
    const dadosAutomato = await response.json();
    return new AutomatoFinito(dadosAutomato);
}

async function Testes(arquivo) {
    const response = await fetch(arquivo);
    const texto = await response.text();
    const linhas = texto.split('\n');
    const casosTeste = [];

    for (const linha of linhas) {
        const [entrada, esperado] = linha.trim().split(';');
        casosTeste.push({ entrada, esperado: parseInt(esperado) });
    }

    return casosTeste;
}

async function main() {
    const automato = await Automato('arquivo_do_automato.json');
    const casosTeste = await Testes('arquivo_de_testes.in');

    const resultados = [];

    for (const { entrada, esperado } of casosTeste) {
        const startTime = performance.now();
        const resultado = automato.processarEntrada(entrada);
        const Time = performance.now() - startTime;

        resultados.push({
            entrada,
            esperado,
            obtido: resultado ? 1 : 0,
            tempo: Time.toFixed(5)
        });
    }

    const resultadosTexto = resultados.map(r => `${r.entrada};${r.esperado};${r.obtido};${r.tempo}`).join('\n');
    document.getElementById('resultado').textContent = resultadosTexto;
}

main();
