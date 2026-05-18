function parseEntries(text){

const regex = /(\d{10,})\s+([A-ZÁÉÍÓÚÃÕÇ\s]+?)(?=\s*\[|$)/g;

const out = [];

let match;

while ((match = regex.exec(text)) !== null) {

out.push({
number: match[1],
name: match[2].trim()
});

}

return out;

}

async function lerArquivo(input, textareaId) {

const file = input.files[0];
if (!file) return;

// 👉 SE FOR PDF
if(file.type === "application/pdf"){

const reader = new FileReader();

reader.onload = async function(){

const typedarray = new Uint8Array(this.result);

const pdf = await pdfjsLib.getDocument(typedarray).promise;

let text = "";

for(let i = 1; i <= pdf.numPages; i++){

const page = await pdf.getPage(i);

const content = await page.getTextContent();

const strings = content.items.map(item => item.str);

text += strings.join(" ") + "\n";

}

document.getElementById(textareaId).value = text;

};

reader.readAsArrayBuffer(file);

}else{

// 👉 TXT e RTF continuam iguais
const reader = new FileReader();

reader.onload = function(e){
document.getElementById(textareaId).value = e.target.result;
}

reader.readAsText(file);

}

}

document.getElementById("file1").addEventListener("change", function() {
  lerArquivo(this, "inputText1");
});

document.getElementById("file2").addEventListener("change", function() {
  lerArquivo(this, "inputText2");
});

let batch1 = [];
let batch2 = [];

document.getElementById("btnParse").addEventListener("click", () => {

const text1 = document.getElementById("inputText1").value;
const text2 = document.getElementById("inputText2").value;

batch1 = parseEntries(text1);
batch2 = parseEntries(text2);

document.getElementById("count1").textContent = batch1.length;
document.getElementById("count2").textContent = batch2.length;

// 👉 MOSTRAR ESPELHO
renderTable(batch1, "table1");
renderTable(batch2, "table2");

// 👉 MOSTRAR A SEÇÃO
document.getElementById("previewSection").style.display = "block";

});

document.getElementById("btnClear").addEventListener("click", () => {
  document.getElementById("inputText1").value = "";
  document.getElementById("inputText2").value = "";

  batch1 = [];
  batch2 = [];

  document.getElementById("count1").textContent = 0;
  document.getElementById("count2").textContent = 0;
});

document.getElementById("btnDownload").addEventListener("click", () => {
  const max = Math.max(batch1.length, batch2.length);

  let html = "<table>";

  for (let i = 0; i < max; i++) {
    const v1 = batch1[i] ? batch1[i].number + " " + batch1[i].name : "";
    const v2 = batch2[i] ? batch2[i].number + " " + batch2[i].name : "";
    html += `<tr><td>${v1}</td><td>${v2}</td></tr>`;
  }

  html += "</table>";

  const blob = new Blob([`<html><meta charset="UTF-8">${html}</html>`], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resultado.xls";
  a.click();
});

function renderTable(rows, tableId){

const tbody = document.querySelector(`#${tableId} tbody`);

tbody.innerHTML = "";

rows.forEach(r => {

const tr = document.createElement("tr");

tr.innerHTML = `
<td>${r.number}</td>
<td>${r.name}</td>
`;

tbody.appendChild(tr);

});

}
document.getElementById("btnClearPreview").addEventListener("click", () => {
document.getElementById("btnClear").click();
});
