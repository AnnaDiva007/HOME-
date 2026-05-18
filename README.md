<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Classificação de Processos</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">



  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }

    .main-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Título principal */
    h1 {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #fff 0%, #e0d7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 30px;
      letter-spacing: -0.5px;
    }

    /* Área de texto */
    textarea {
      width: 100%;
      padding: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      font-family: 'Inter', monospace;
      font-size: 14px;
      resize: vertical;
      transition: all 0.3s ease;
      margin-bottom: 15px;
    }

    textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* Botão principal */
    button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    /* Total de processos */
    h3 {
      background: white;
      padding: 15px 25px;
      border-radius: 12px;
      margin: 20px 0;
      display: inline-block;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    #total-geral {
      font-size: 1.5rem;
      font-weight: 800;
      color: #667eea;
      margin-left: 10px;
    }

    /* Container dos cards */
    .container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 25px;
      margin-top: 30px;
    }

    /* Cards */
    .box {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .box:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .box h2 {
      padding: 20px;
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Cores dos headers */
    #recebidos h2 {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
    }

    #atualizados h2 {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    #cancelados h2 {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;
    }

    #erros h2 {
      background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
      color: white;
    }

    /* Contador */
    .contador {
      padding: 10px 20px;
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
    }

    .contador span {
      color: #667eea;
      font-size: 1.2rem;
      margin-left: 5px;
    }

    /* Conteúdo */
    pre {
      padding: 20px;
      margin: 0;
      font-family: 'Inter', monospace;
      font-size: 12px;
      color: #555;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.6;
      max-height: 400px;
      overflow-y: auto;
      background: #fafafa;
    }

    /* Scrollbar */
    pre::-webkit-scrollbar {
      width: 6px;
    }

    pre::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    pre::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }

    /* Botão copiar dentro do card */
    .box button {
      margin: 15px 20px;
      padding: 8px 20px;
      background: #667eea;
      font-size: 0.9rem;
    }

    .box button:hover {
      background: #5a67d8;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    /* Responsivo */
    @media (max-width: 768px) {
      body {
        padding: 20px;
      }
      
      h1 {
        font-size: 1.8rem;
      }
      
      .container {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
    .footer {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.footer-content {
  width: 100%;
  max-width: 1400px;
  padding: 15px 25px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

/* efeito glass (se quiser manter o estilo moderno) */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* lados */
.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ícones */
.footer-left i {
  color: #ff4d4d;
}

.footer-right i {
  color: #ffd700;
}










  </style>
</head>
<body>
<div class="main-container">
  <h1>
    <i class="fas fa-tasks"></i> Classificação de Processos
  </h1>
  
  <textarea id="texto-processos" placeholder="Cole a tela de recebimento aqui" rows="10"></textarea>
  
  <br>
  <button onclick="separarProcessos()">
    <i class="fas fa-magic"></i> Separar Processos
  </button>
  
  <h3>
    <i class="fas fa-chart-line"></i> Total de Processos: 
    <span id="total-geral">0</span>
  </h3>
  
  <div class="container">
    <div class="box" id="recebidos">
      <h2><i class="fas fa-check-circle"></i> Recebidos com Sucesso</h2>
      <div class="contador">
        <i class="fas fa-calculator"></i> Quantidade: <span id="cont-recebidos">0</span>
      </div>
      <pre></pre>
      <button onclick="copiarTextoPorContainer(this)">
        <i class="fas fa-copy"></i> Copiar Texto
      </button>
    </div>

    <div class="box" id="atualizados">
      <h2><i class="fas fa-sync-alt"></i> Recebidos e Atualizados</h2>
      <div class="contador">
        <i class="fas fa-calculator"></i> Quantidade: <span id="cont-atualizados">0</span>
      </div>
      <pre></pre>
      <button onclick="copiarTextoPorContainer(this)">
        <i class="fas fa-copy"></i> Copiar Texto
      </button>
    </div>

    <div class="box" id="cancelados">
      <h2><i class="fas fa-ban"></i> Cancelados</h2>
      <div class="contador">
        <i class="fas fa-calculator"></i> Quantidade: <span id="cont-cancelados">0</span>
      </div>
      <pre></pre>
      <button onclick="copiarTextoPorContainer(this)">
        <i class="fas fa-copy"></i> Copiar Texto
      </button>
    </div>

    <div class="box" id="erros">
      <h2><i class="fas fa-exclamation-triangle"></i> Erros Diversos</h2>
      <div class="contador">
        <i class="fas fa-calculator"></i> Quantidade: <span id="cont-erros">0</span>
      </div>
      <pre></pre>
      <button onclick="copiarTextoPorContainer(this)">
        <i class="fas fa-copy"></i> Copiar Texto
      </button>
    </div>
  </div>

<footer class="container">
<div class="footer-content glass">
<div class="footer-left">
<i class="fas fa-heart" style="color: #ff4d4d;"></i>
<span>Anna do HC • </span>
</div>
<div class="footer-right">
<span>v2.0</span>
<i class="fas fa-crown" style="color: #ffd700;"></i>
</div>
</div>
</footer>




</div>

<script>
function copiarTextoPorContainer(botao) {
  const pre = botao.parentElement.querySelector("pre");
  const texto = pre ? pre.innerText : "Nenhum texto encontrado.";
  navigator.clipboard.writeText(texto)
    .then(() => alert("Texto copiado!"))
    .catch(err => alert("Erro ao copiar: " + err));
}

function contarTodos() {
  const tipos = ['recebidos', 'atualizados', 'cancelados', 'erros'];
  let total = 0;

  tipos.forEach(tipo => {
    const pre = document.querySelector("#" + tipo + " pre");
    const texto = pre ? pre.innerText : "";
    const numeros = texto.match(/\b\d{17}\b/g);
    const quantidade = numeros ? numeros.length : 0;
    document.getElementById('cont-' + tipo).textContent = quantidade;
    total += quantidade;
  });

  document.getElementById('total-geral').textContent = total;
}

function separarProcessos() {
  const texto = document.getElementById("texto-processos").value;
  const linhas = texto.split('\n');

  const recebidos = [];
  const atualizados = [];
  const cancelados = [];
  const erros = [];

  linhas.forEach(linha => {
    if (linha.includes("recebido com sucesso")) {
      recebidos.push(linha);
    } else if (linha.includes("atualizado com sucesso")) {
      atualizados.push(linha);
    } else if (linha.includes("Cancelado") || linha.includes("cancelado") || linha.includes("Erro no recebimento")) {
      if (linha.includes("-")) {
        cancelados.push(linha);
      } else {
        erros.push(linha);
      }
    }
  });

  document.querySelector("#recebidos pre").textContent = recebidos.join("\n");
  document.querySelector("#atualizados pre").textContent = atualizados.join("\n");
  document.querySelector("#cancelados pre").textContent = cancelados.join("\n");
  document.querySelector("#erros pre").textContent = erros.join("\n");

  contarTodos();
}





contarTodos();
</script>
</body>
</html>
