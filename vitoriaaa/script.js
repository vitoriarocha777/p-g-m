// ===============================
// ESTOQUE DOS PRODUTOS
// ===============================

let estoque = {
    acai: 120,
    morango: 25,
    banana: 80,
    oreo: 35,
    granola: 18,
    leitepo: 20,
    condensado: 40,
    nutella: 22,
    pacoca: 250
};

// ===============================
// ATUALIZA A TABELA
// ===============================

function atualizarEstoque() {

    document.getElementById("acai").innerHTML = estoque.acai + " Litros";
    document.getElementById("morango").innerHTML = estoque.morango + " Kg";
    document.getElementById("banana").innerHTML = estoque.banana + " Unidades";
    document.getElementById("oreo").innerHTML = estoque.oreo + " Pacotes";
    document.getElementById("granola").innerHTML = estoque.granola + " Kg";
    document.getElementById("leitepo").innerHTML = estoque.leitepo + " Kg";
    document.getElementById("condensado").innerHTML = estoque.condensado + " Latas";
    document.getElementById("nutella").innerHTML = estoque.nutella + " Potes";
    document.getElementById("pacoca").innerHTML = estoque.pacoca + " Unidades";

}

// ===============================
// RETIRAR PRODUTO
// ===============================

function retirarProduto(produto, quantidade){

    if(estoque[produto] >= quantidade){

        estoque[produto] -= quantidade;

        atualizarEstoque();

        verificarEstoque();

    }else{

        alert("Estoque insuficiente!");

    }

}

// ===============================
// ADICIONAR PRODUTO
// ===============================

function adicionarProduto(produto, quantidade){

    estoque[produto] += quantidade;

    atualizarEstoque();

}

// ===============================
// VERIFICAR ESTOQUE BAIXO
// ===============================

function verificarEstoque(){

    for(let item in estoque){

        if(estoque[item] <= 10){

            alert("⚠ Atenção! O estoque de " + item + " está baixo.");

        }

    }

}

// ===============================
// BOTÃO COMPRAR
// ===============================

let botoes = document.querySelectorAll(".produto button");

botoes.forEach(function(botao){

    botao.addEventListener("click", function(){

        let pagamento = prompt(
`Escolha a forma de pagamento:

1 - PIX
2 - Cartão de Crédito
3 - Cartão de Débito
4 - Dinheiro`
);

        if(pagamento == "1"){

            alert("✅ Pedido realizado!\nPagamento via PIX.");

        }

        else if(pagamento == "2"){

            alert("✅ Pedido realizado!\nPagamento no Cartão de Crédito.");

        }

        else if(pagamento == "3"){

            alert("✅ Pedido realizado!\nPagamento no Cartão de Débito.");

        }

        else if(pagamento == "4"){

            alert("✅ Pedido realizado!\nPagamento em Dinheiro.");

        }

        else{

            alert("Forma de pagamento inválida.");

            return;

        }

        // Diminui o estoque automaticamente

        retirarProduto("acai",1);
        retirarProduto("banana",1);
        retirarProduto("morango",1);
        retirarProduto("oreo",1);

    });

});

// ===============================
// ANIMAÇÃO NO BOTÃO
// ===============================

const botaoPedido = document.querySelector(".banner button");

botaoPedido.addEventListener("click", function(){

    window.scrollTo({

        top:700,

        behavior:"smooth"

    });

});

// ===============================
// CARREGA A TABELA
// ===============================

atualizarEstoque();

verificarEstoque();

// ===============================
// BOTÃO "PEÇA AGORA" -> DIRETO PRA seção Cardápio
// ===============================

const botaoPecaAgora = document.getElementById("botaoPecaAgora");

if (botaoPecaAgora) {
    botaoPecaAgora.addEventListener("click", () => {
        // vai direto pro cardápio dentro da index.html
        window.location.href = "index.html#cardapio";
    });
}

// ===============================
// CADASTRO
// ===============================

const formCadastro = document.getElementById("formCadastro");
const mensagemCadastro = document.getElementById("mensagemCadastro");

function setMensagem(texto, tipo) {
    if (!mensagemCadastro) return;
    mensagemCadastro.textContent = texto;
    mensagemCadastro.style.color = tipo === "erro" ? "#c62828" : "#2e7d32";
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (formCadastro) {
    formCadastro.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        if (!nome || !email || !telefone || !senha || !confirmarSenha) {
            setMensagem("Preencha todos os campos.", "erro");
            return;
        }

        if (!validarEmail(email)) {
            setMensagem("Digite um email válido.", "erro");
            return;
        }

        if (senha.length < 6) {
            setMensagem("A senha deve ter pelo menos 6 caracteres.", "erro");
            return;
        }

        if (senha !== confirmarSenha) {
            setMensagem("As senhas não coincidem.", "erro");
            return;
        }

        // Salva em localStorage (simulação)
        const usuarios = JSON.parse(localStorage.getItem("usuariosCadastro") || "[]");
        const novoUsuario = { nome, email, telefone };

        usuarios.push(novoUsuario);
        localStorage.setItem("usuariosCadastro", JSON.stringify(usuarios));

        setMensagem("✅ Cadastro realizado com sucesso!", "ok");
        formCadastro.reset();
    });

    formCadastro.addEventListener("reset", () => {
        setMensagem("", "ok");
    });
}

// ===============================
// CARRINHO (SIMULAÇÃO)
// ===============================

const CARRINHO_KEY = "carrinho";

function carregarCarrinho() {
    try {
        return JSON.parse(localStorage.getItem(CARRINHO_KEY) || "[]");
    } catch {
        return [];
    }
}

function salvarCarrinho(carrinho) {
    localStorage.setItem(CARRINHO_KEY, JSON.stringify(carrinho));
}

function getPrecoFromCard(produtoEl) {
    // espera encontrar algo como <h4>R$ 15,00</h4>
    const h4 = produtoEl.querySelector("h4");
    if (!h4) return 0;
    const texto = h4.textContent || "";
    const numero = texto.replace(/[^0-9,\.]/g, "").replace(/\./g, "").replace(/,/g, ".");
    const preco = Number(numero);
    return Number.isFinite(preco) ? preco : 0;
}

function adicionarAoCarrinho(nomeProduto, preco, quantidade = 1) {
    const carrinho = carregarCarrinho();

    const idx = carrinho.findIndex((item) => item.nome === nomeProduto);
    if (idx >= 0) {
        carrinho[idx].quantidade += quantidade;
    } else {
        carrinho.push({ nome: nomeProduto, preco, quantidade });
    }

    salvarCarrinho(carrinho);
    return carrinho;
}

function calcularTotal(carrinho) {
    return carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
}

function formatarBRL(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Ao clicar em “Comprar” no cardápio, além do fluxo atual, adiciona no carrinho.
// Observação: seu código atual diminui estoque de ingredientes fixos.
// Aqui vamos só adicionar o produto ao carrinho com preço que já está na tela.
let botoes = document.querySelectorAll(".produto button");

botoes.forEach(function(botao) {
    botao.addEventListener("click", function() {
        // Captura dados do card pai (produto)
        const produtoEl = botao.closest(".produto");
        if (!produtoEl) return;

        const titulo = produtoEl.querySelector("h3");
        const nomeProduto = (titulo?.textContent || "Produto").trim();
        const preco = getPrecoFromCard(produtoEl);

        adicionarAoCarrinho(nomeProduto, preco, 1);
    });
});

// ===============================
// RENDER CARRINHO (PÁGINA)
// ===============================

function atualizarQuantidade(itemEl, quantidade) {
    const btnMinus = itemEl.querySelector("button[data-acao='menos']");
    const btnPlus = itemEl.querySelector("button[data-acao='mais']");
    const qtySpan = itemEl.querySelector(".carrinho-quantidade span");

    if (qtySpan) qtySpan.textContent = quantidade;
    if (btnMinus) btnMinus.disabled = quantidade <= 1;
}

function renderCarrinho() {
    const itensEl = document.getElementById("carrinhoItens");
    const totalEl = document.getElementById("carrinhoTotal");
    const btnLimpar = document.getElementById("btnLimparCarrinho");

    if (!itensEl || !totalEl) return; // não é a página do carrinho

    let carrinho = carregarCarrinho();

    if (!carrinho || carrinho.length === 0) {
        itensEl.innerHTML = "<p style='font-weight:700; color:#4b006e;'>Seu carrinho está vazio.</p>";
        totalEl.textContent = formatarBRL(0);
        return;
    }

    totalEl.textContent = formatarBRL(calcularTotal(carrinho));

    itensEl.innerHTML = "";

    carrinho.forEach((item, index) => {
        const totalItem = item.preco * item.quantidade;

        const itemDiv = document.createElement("div");
        itemDiv.className = "carrinho-item";
        itemDiv.setAttribute("data-index", String(index));

        itemDiv.innerHTML = `
            <div>
                <strong>${item.nome}</strong>
                <div class="carrinho-preco">${formatarBRL(totalItem)}</div>
            </div>

            <div class="carrinho-quantidade">
                <button type="button" data-acao="menos" aria-label="diminuir">-</button>
                <span>${item.quantidade}</span>
                <button type="button" data-acao="mais" aria-label="aumentar">+</button>
            </div>
        `;

        const btnMinus = itemDiv.querySelector("button[data-acao='menos']");
        const btnPlus = itemDiv.querySelector("button[data-acao='mais']");
        const qtySpan = itemDiv.querySelector(".carrinho-quantidade span");

        if (btnMinus) btnMinus.disabled = item.quantidade <= 1;

        if (btnMinus) {
            btnMinus.addEventListener("click", () => {
                const carrinho = carregarCarrinho();
                const i = Number(itemDiv.getAttribute("data-index"));
                if (!carrinho[i]) return;

                carrinho[i].quantidade -= 1;
                if (carrinho[i].quantidade <= 0) {
                    carrinho.splice(i, 1);
                }
                salvarCarrinho(carrinho);
                renderCarrinho();
            });
        }

        if (btnPlus) {
            btnPlus.addEventListener("click", () => {
                const carrinho = carregarCarrinho();
                const i = Number(itemDiv.getAttribute("data-index"));
                if (!carrinho[i]) return;

                carrinho[i].quantidade += 1;
                salvarCarrinho(carrinho);
                renderCarrinho();
            });
        }

        itensEl.appendChild(itemDiv);
    });

    if (btnLimpar) {
        btnLimpar.onclick = () => {
            localStorage.removeItem(CARRINHO_KEY);
            renderCarrinho();
        };
    }
}

// expõe para carrinho.html
window.renderCarrinho = renderCarrinho;

