[index.html](https://github.com/user-attachments/files/32254683/index.html)
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cruzador de Processos - Físicos x CSV</title>
    <link rel="stylesheet" href="style.css">
    <!-- PDF.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <!-- PapaParse -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
</head>
<body>
    <div class="container">
        <header>
            <h1>🔍 Cruzador de Processos</h1>
            <p class="subtitulo">Processos <strong>FÍSICOS</strong> do PDF × Processos do CSV</p>
        </header>

        <!-- Upload -->
        <section class="upload-area">
            <div class="upload-box">
                <label for="csvInput">📄 Arquivo CSV</label>
                <input type="file" id="csvInput" accept=".csv">
                <span id="csvStatus" class="status">Nenhum arquivo selecionado</span>
            </div>

            <div class="upload-box">
                <label for="pdfInput">📕 Arquivo PDF</label>
                <input type="file" id="pdfInput" accept=".pdf">
                <span id="pdfStatus" class="status">Nenhum arquivo selecionado</span>
            </div>

            <button id="btnProcessar" class="btn-principal" disabled>
                🚀 Processar Cruzamento
            </button>
        </section>

        <!-- Loading -->
        <div id="loading" class="loading hidden">
            <div class="spinner"></div>
            <p id="loadingText">Processando...</p>
        </div>

        <!-- Resultados -->
        <section id="resultados" class="hidden">
            <div class="cards">
                <div class="card card-azul">
                    <span class="card-num" id="totalPdf">0</span>
                    <span class="card-label">Físicos no PDF</span>
                </div>
                <div class="card card-verde">
                    <span class="card-num" id="totalEncontrados">0</span>
                    <span class="card-label">✅ Encontrados no CSV</span>
                </div>
                <div class="card card-vermelho">
                    <span class="card-num" id="totalNaoEncontrados">0</span>
                    <span class="card-label">❌ NÃO ENCONTRADOS</span>
                </div>
                <div class="card card-cinza">
                    <span class="card-num" id="totalCsv">0</span>
                    <span class="card-label">📄 Total no CSV</span>
                </div>
            </div>

            <!-- Filtros -->
            <div class="filtros">
                <button class="filtro ativo" data-filtro="todos">Todos</button>
                <button class="filtro" data-filtro="encontrados">✅ Encontrados</button>
                <button class="filtro" data-filtro="nao_encontrados">❌ Não Encontrados</button>
                <button class="filtro" data-filtro="csv_sobrando">📄 Só no CSV</button>
                <input type="text" id="busca" placeholder="🔎 Buscar número...">
                <button id="btnExportar" class="btn-exportar">📥 Exportar CSV</button>
            </div>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Arial, sans-serif;
}

body {
    background: linear-gradient(135deg, #1e3c72, #2a5298);
    min-height: 100vh;
    padding: 20px;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #eee;
}

h1 {
    color: #1e3c72;
    margin-bottom: 8px;
}

.subtitulo {
    color: #666;
    font-size: 0.95rem;
}

/* Upload */
.upload-area {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.upload-box {
    border: 2px dashed #bbb;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s;
    background: #fafafa;
}

.upload-box:hover {
    border-color: #2a5298;
    background: #f0f4ff;
}

.upload-box label {
    display: block;
    font-weight: bold;
    margin-bottom: 10px;
    color: #1e3c72;
    font-size: 1.05rem;
}

.upload-box input[type="file"] {
    display: block;
    margin: 0 auto 10px;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    width: 100%;
    max-width: 280px;
}

.status {
    display: block;
    font-size: 0.85rem;
    color: #888;
    font-style: italic;
    margin-top: 5px;
}

.status.ok {
    color: #27ae60;
    font-style: normal;
    font-weight: 600;
}

.btn-principal {
    grid-column: 1 / -1;
    padding: 15px;
    background: #27ae60;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-principal:hover:not(:disabled) {
    background: #219150;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
}

.btn-principal:disabled {
    background: #ccc;
    cursor: not-allowed;
}

/* Loading */
.loading {
    text-align: center;
    padding: 40px;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #2a5298;
    border-radius: 50%;
    margin: 0 auto 15px;
    animation: girar 1s linear infinite;
}

@keyframes girar {
    100% { transform: rotate(360deg); }
}

.hidden {
    display: none !important;
}

/* Cards */
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
    margin-bottom: 25px;
}

.card {
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-num {
    display: block;
    font-size: 2.2rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.card-label {
    font-size: 0.9rem;
    opacity: 0.95;
}

.card-azul     { background: linear-gradient(135deg, #3498db, #2980b9); }
.card-verde    { background: linear-gradient(135deg, #2ecc71, #27ae60); }
.card-vermelho { background: linear-gradient(135deg, #e74c3c, #c0392b); }
.card-cinza    { background: linear-gradient(135deg, #7f8c8d, #5d6d7e); }

/* Filtros */
.filtros {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
}

.filtro {
    padding: 8px 16px;
    border: 2px solid #ddd;
    background: #fff;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
}

.filtro:hover {
    border-color: #2a5298;
    color: #2a5298;
}

.filtro.ativo {
    background: #2a5298;
    color: #fff;
    border-color: #2a5298;
}

#busca {
    flex: 1;
    min-width: 200px;
    padding: 8px 15px;
    border: 2px solid #ddd;
    border-radius: 20px;
    font-size: 0.95rem;
}

#busca:focus {
    outline: none;
    border-color: #2a5298;
}

.btn-exportar {
    padding: 8px 20px;
    background: #f39c12;
    color: #fff;
    border: none;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-exportar:hover {
    background: #e67e22;
}

/* Tabela */
.tabela-wrapper {
    overflow-x: auto;
    border-radius: 10px;
    border: 1px solid #eee;
    max-height: 500px;
    overflow-y: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}

thead {
    position: sticky;
    top: 0;
    background: #1e3c72;
    color: #fff;
    z-index: 10;
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

tbody tr:hover {
    background: #f8faff;
}

tr.linha-ok {
    background: #eafaf1;
    border-left: 4px solid #27ae60;
}

tr.linha-nao {
    background: #fdecea;
    border-left: 4px solid #e74c3c;
}

tr.linha-csv {
    background: #fef5e7;
    border-left: 4px solid #f39c12;
}

.badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
}

.badge-ok   { background: #27ae60; color: #fff; }
.badge-nao  { background: #e74c3c; color: #fff; }
.badge-csv  { background: #f39c12; color: #fff; }
.badge-fis  { background: #8e44ad; color: #fff; font-size: 0.7rem; margin-left: 5px; }

.mono {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 0.85rem;
}

/* Responsivo */
@media (max-width: 700px) {
    .upload-area {
        grid-template-columns: 1fr;
    }
    .container {
        padding: 20px;
    }
}
            <!-- Tabela -->
            <div class="tabela-wrapper">
                <table id="tabelaResultado">
                    <thead>
                        <tr>
                            <th>Nº Processo (PDF)</th>
                            <th>Status</th>[style.css](https://github.com/user-attachments/files/32254703/style.css)
                            <th>Membro / Info PDF</th>
                            <th>Dados do CSV</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyResultado"></tbody>
                </table>
            </div>
        </section>
    </div>

    <script src="script.js"></script>[script.js](https://github.com/user-attachments/files/32254700/script.js)

</body>
</html>
