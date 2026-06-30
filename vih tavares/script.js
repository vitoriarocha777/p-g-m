// Carrinho
let carrinho = [];
let total = 0;

// Adicionar produto ao carrinho
function adicionarCarrinho(nome, preco) {

    carrinho.push({
        nome: nome,
        preco: preco
    });

    total += preco;

    document.getElementById("contador").innerText = carrinho.length;

    alert(nome + " adicionado ao carrinho!");
}

// Botão Finalizar Pedido
const botao = document.querySelector(".finalizar");

botao.addEventListener("click", finalizarPedido);

function finalizarPedido() {

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let pagamento = document.querySelector("input[name='pagamento']:checked");

    if (!pagamento) {
        alert("Escolha uma forma de pagamento.");
        return;
    }

    let lista = "";

    carrinho.forEach(function(produto){

        lista += produto.nome + " - R$ " + produto.preco.toFixed(2) + "\n";

    });

    let mensagem =
`========== PEDIDO ==========
${lista}

----------------------------
Total: R$ ${total.toFixed(2)}

Pagamento:
${pagamento.parentElement.innerText}

Obrigado pela preferência!
`;

    alert(mensagem);

    carrinho = [];
    total = 0;

    document.getElementById("contador").innerText = "0";

    document.querySelectorAll("input[type=checkbox]").forEach(item=>{
        item.checked=false;
    });

    pagamento.checked=false;
}