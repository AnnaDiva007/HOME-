// ==========================================
// CONFIGURAÇÃO PDF.js
// ==========================================
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    console.log('✅ PDF.js carregado');
} else {
    console.error('❌ PDF.js NÃO carregou!');
}

// ==========================================
// ESTADO GLOBAL
// ==========================================
let dadosCsv = [];
let dadosPdf = [];
let resultado = [];
let filtroAtual = 'todos';
let buscaAtual = '';

// ==========================================
// ELEMENTOS DOM
// ==========================================
const csvInput = document.getElementById('csvInput');
const pdfInput = document.getElementById('pdfInput');
const csvStatus = document.getElementById('csvStatus');
const pdfStatus = document.getElementById('pdfStatus');
const btnProcessar = document.getElementById('btnProcessar');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const resultados = document.getElementById('resultados');
const tbody = document.getElementById('tbodyResultado');

// ==========================================
// UTILIDADES
// ==========================================
function limparNumero(str) {
    if (!str) return '';
    return String(str).replace(/[.\-\/\s]/g, '').trim();
}

function mostrarLoading(msg = 'Processando...') {
    loadingText.textContent = msg;
    loading.classList.remove('hidden');
    resultados.classList.add('hidden');
}

function esconderLoading() {
    loading.classList.add('hidden');
}

// ==========================================
// UPLOAD
// ==========================================
csvInput.addEventListener('change', (e) => {
    const f = e.target.files[0];
    csvStatus.textContent = f ? `✅ ${f.name}` : 'Nenhum arquivo';
    csvStatus.classList.toggle('ok', !!f);
    verificarBotao();
});

pdfInput.addEventListener('change', (e) => {
    const f = e.target.files[0];
    pdfStatus.textContent = f ? `✅ ${f.name}` : 'Nenhum arquivo';
    pdfStatus.classList.toggle('ok', !!f);
    verificarBotao();
});

function verificarBotao() {
    btnProcessar.disabled = !(csvInput.files[0] && pdfInput.files[0]);
}

// ==========================================
// PROCESSAR CSV
// ==========================================
function processarCsv(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            delimiter: '|',
            skipEmptyLines: true,
            encoding: 'UTF-8',
            complete: (results) => {
                const processos = results.data
                    .filter(row => row['Numeração Única'] && row['Numeração Única'].trim())
                    .map(row => ({
                        numeracaoOriginal: row['Numeração Única'].trim(),
                        numeracaoLimpa: limparNumero(row['Numeração Única']),
                        membro: row['Membro(s) Oficiante(s)'] || '-',
                        orgao: row['Órgão Julgador'] || '-',
                        classe: row['Classe'] || '-',
                        tipoComunicacao: row['Tipo de Comunicação'] || '-',
                        finalidade: row['Finalidade da Vista'] || '-',
                        dataEnvio: row['Data Envio'] || '-',
                        marcadores: row['Marcadores'] || '-'
                    }));
                resolve(processos);
            },
            error: reject
        });
    });
}

// ==========================================
// PROCESSAR PDF - versão com DEBUG
// ==========================================
async function processarPdf(file) {
    console.log('📕 Iniciando leitura do PDF...');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    console.log(`📕 PDF carregado: ${pdf.numPages} páginas`);

    const fisicosEncontrados = [];
    const numerosVistos = new Set();

    for (let i = 1; i <= pdf.numPages; i++) {
        loadingText.textContent = `📖 Lendo PDF: página ${i} de ${pdf.numPages}...`;
        console.log(`📄 Processando página ${i}/${pdf.numPages}`);

        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Junta TODO o texto da página
        const textoPagina = textContent.items
            .map(item => item.str)
            .join(' ')
            .replace(/\s+/g, ' ');

        // DEBUG: mostra o texto da página 1
        if (i === 1) {
            console.log('📝 TEXTO BRUTO PÁGINA 1 (primeiros 1500 chars):');
            console.log(textoPagina.substring(0, 1500));
        }

        // Pega todos os números longos (15+ dígitos)
        const todosNumeros = textoPagina.match(/\d{15,}/g) || [];
        console.log(`   Números longos na pág ${i}:`, todosNumeros.slice(0, 10));

        // Para cada número, olha o contexto
        todosNumeros.forEach(numero => {
            if (numerosVistos.has(numero)) return;

            const posNum = textoPagina.indexOf(numero);
            const contexto = textoPagina
                .substring(posNum, posNum + numero.length + 250)
                .toUpperCase();

            if (contexto.includes('FISICO')) {
                numerosVistos.add(numero);
                fisicosEncontrados.push({
                    numeracaoOriginal: numero,
                    numeracaoLimpa: numero,
                    infoPdf: contexto.substring(0, 200),
                    pagina: i
                });
            }
        });
    }

    console.log(`✅ PDF processado. Físicos encontrados: ${fisicosEncontrados.length}`);
    console.log('📋 Lista de físicos:', fisicosEncontrados);

    return fisicosEncontrados;
}

// ==========================================
// CRUZAMENTO
// ==========================================
function cruzarDados() {
    const mapaCsv = new Map();
    dadosCsv.forEach(p => mapaCsv.set(p.numeracaoLimpa, p));

    const numerosCsvUsados = new Set();
    const linhas = [];

    dadosPdf.forEach(pdfProc => {
        const encontrado = mapaCsv.get(pdfProc.numeracaoLimpa);
        if (encontrado) {
            numerosCsvUsados.add(pdfProc.numeracaoLimpa);
            linhas.push({
                tipo: 'encontrado',
                numeroPdf: pdfProc.numeracaoOriginal,
                numeroLimpo: pdfProc.numeracaoLimpa,
                infoPdf: pdfProc.infoPdf,
                pagina: pdfProc.pagina,
                csv: encontrado
            });
        } else {
            linhas.push({
                tipo: 'nao_encontrado',
                numeroPdf: pdfProc.numeracaoOriginal,
                numeroLimpo: pdfProc.numeracaoLimpa,
                infoPdf: pdfProc.infoPdf,
                pagina: pdfProc.pagina,
                csv: null
            });
        }
    });

    dadosCsv.forEach(csvProc => {
        if (!numerosCsvUsados.has(csvProc.numeracaoLimpa)) {
            linhas.push({
                tipo: 'csv_sobrando',
                numeroPdf: '—',
                numeroLimpo: csvProc.numeracaoLimpa,
                infoPdf: '—',
                pagina: '—',
                csv: csvProc
            });
        }
    });

    return linhas;
}

// ==========================================
// RENDERIZAÇÃO
// ==========================================
function renderizarCards() {
    document.getElementById('totalPdf').textContent = dadosPdf.length;
    document.getElementById('totalEncontrados').textContent =
        resultado.filter(r => r.tipo === 'encontrado').length;
    document.getElementById('totalNaoEncontrados').textContent =
        resultado.filter(r => r.tipo === 'nao_encontrado').length;
    document.getElementById('totalCsv').textContent = dadosCsv.length;
}

function filtrarResultado() {
    return resultado.filter(item => {
        if (filtroAtual === 'encontrados' && item.tipo !== 'encontrado') return false;
        if (filtroAtual === 'nao_encontrados' && item.tipo !== 'nao_encontrado') return false;
        if (filtroAtual === 'csv_sobrando' && item.tipo !== 'csv_sobrando') return false;

        if (buscaAtual) {
            const alvo = buscaAtual.toLowerCase();
            const texto = (
                item.numeroPdf + ' ' + item.numeroLimpo + ' ' +
                (item.csv?.numeracaoOriginal || '') + ' ' +
                (item.csv?.membro || '') + ' ' +
                (item.csv?.orgao || '')
            ).toLowerCase();
            if (!texto.includes(alvo)) return false;
        }
        return true;
    });
}

function renderizarTabela() {
    const itens = filtrarResultado();
    tbody.innerHTML = '';

    if (itens.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;color:#888;">Nenhum registro.</td></tr>`;
        return;
    }

    itens.forEach(item => {
        const tr = document.createElement('tr');
        if (item.tipo === 'encontrado') tr.className = 'linha-ok';
        else if (item.tipo === 'nao_encontrado') tr.className = 'linha-nao';
        else tr.className = 'linha-csv';

        const tdNumPdf = document.createElement('td');
        tdNumPdf.innerHTML = `
            <span class="mono">${item.numeroPdf}</span>
            ${item.tipo !== 'csv_sobrando' ? '<span class="badge badge-fis">FÍSICO</span>' : ''}
        `;

        const tdStatus = document.createElement('td');
        if (item.tipo === 'encontrado') {
            tdStatus.innerHTML = '<span class="badge badge-ok">✅ ENCONTRADO</span>';
        } else if (item.tipo === 'nao_encontrado') {
            tdStatus.innerHTML = '<span class="badge badge-nao">❌ NÃO ENCONTRADO NO CSV</span>';
        } else {
            tdStatus.innerHTML = '<span class="badge badge-csv">📄 SÓ NO CSV</span>';
        }

        const tdInfoPdf = document.createElement('td');
        tdInfoPdf.innerHTML = `
            <div style="font-size:0.8rem;color:#666;">${item.infoPdf || '—'}</div>
            ${item.pagina !== '—' ? `<small style="color:#999;">pág. ${item.pagina}</small>` : ''}
        `;

        const tdCsv = document.createElement('td');
        if (item.csv) {
            tdCsv.innerHTML = `
                <div class="mono" style="font-weight:bold;color:#1e3c72;">${item.csv.numeracaoOriginal}</div>
                <div style="font-size:0.8rem;color:#555;margin-top:3px;">
                    <strong>Membro:</strong> ${item.csv.membro}<br>
                    <strong>Órgão:</strong> ${item.csv.orgao}<br>
                    <strong>Finalidade:</strong> ${item.csv.finalidade}
                </div>
            `;
        } else {
            tdCsv.innerHTML = '<span style="color:#c0392b;font-weight:bold;">⚠️ Não localizado no CSV</span>';
        }

        tr.appendChild(tdNumPdf);
        tr.appendChild(tdStatus);
        tr.appendChild(tdInfoPdf);
        tr.appendChild(tdCsv);
        tbody.appendChild(tr);
    });
}

// ==========================================
// FILTROS E BUSCA
// ==========================================
document.querySelectorAll('.filtro').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filtro').forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
        filtroAtual = btn.dataset.filtro;
        renderizarTabela();
    });
});

document.getElementById('busca').addEventListener('input', (e) => {
    buscaAtual = e.target.value.trim();
    renderizarTabela();
});

// ==========================================
// BOTÃO PROCESSAR
// ==========================================
btnProcessar.addEventListener('click', async () => {
    try {
        const csvFile = csvInput.files[0];
        const pdfFile = pdfInput.files[0];

        mostrarLoading('📄 Lendo CSV...');
        dadosCsv = await processarCsv(csvFile);
        console.log(`✅ CSV processado: ${dadosCsv.length} processos`);

        mostrarLoading('📕 Lendo PDF...');
        dadosPdf = await processarPdf(pdfFile);

        mostrarLoading('🔀 Cruzando dados...');
        resultado = cruzarDados();

        renderizarCards();
        renderizarTabela();

        esconderLoading();
        resultados.classList.remove('hidden');
        resultados.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error('❌ ERRO:', err);
        alert('❌ Erro ao processar:\n' + err.message);
        esconderLoading();
    }
});

// ==========================================
// EXPORTAR CSV
// ==========================================
document.getElementById('btnExportar').addEventListener('click', () => {
    if (!resultado.length) {
        alert('Nada para exportar.');
        return;
    }
    const itens = filtrarResultado();
    const linhas = [['Nº Processo PDF', 'Nº Processo CSV', 'Status', 'Membro CSV', 'Órgão CSV', 'Finalidade CSV', 'Página PDF', 'Info PDF']];
    itens.forEach(item => {
        let status = item.tipo === 'encontrado' ? 'ENCONTRADO'
                   : item.tipo === 'nao_encontrado' ? 'NAO ENCONTRADO NO CSV'
                   : 'SOMENTE NO CSV';
        linhas.push([
            item.numeroPdf,
            item.csv?.numeracaoOriginal || '',
            status,
            item.csv?.membro || '',
            item.csv?.orgao || '',
            item.csv?.finalidade || '',
            item.pagina,
            item.infoPdf
        ]);
    });
    const csvContent = linhas.map(l =>
        l.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')
    ).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cruzamento_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
});

console.log('✅ script.js carregado com sucesso');
