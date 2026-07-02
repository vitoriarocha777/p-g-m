// ==============================
// CARRINHO DE COMPRAS
// ==============================

let carrinho = [];
let total = 0;

// ==============================
// ADICIONAR NO CARRINHO
// ==============================

function adicionarCarrinho(nome, preco){

    carrinho.push({nome, preco});
    total += preco;

    atualizarCarrinho();
}

// ==============================
// ATUALIZAR CARRINHO NA TELA
// ==============================

function atualizarCarrinho(){

    let lista = document.getElementById("listaCarrinho");

    lista.innerHTML = "";

    carrinho.forEach((item, index) => {

        lista.innerHTML += `
            <p>
                ${item.nome} - R$ ${item.preco.toFixed(2)}
                <button onclick="removerItem(${index})">❌</button>
            </p>
        `;
    });

    document.getElementById("total").innerText = total.toFixed(2);
}

// ==============================
// REMOVER ITEM DO CARRINHO
// ==============================

function removerItem(index){

    total -= carrinho[index].preco;
    carrinho.splice(index, 1);

    atualizarCarrinho();
}

// ==============================
// FINALIZAR COMPRA
// ==============================

function finalizarCompra(){

    if(carrinho.length === 0){
        alert("Seu carrinho está vazio!");
        return;
    }

    let pagamento = prompt(
`Escolha a forma de pagamento:
1 - PIX
2 - Cartão de Crédito
3 - Cartão de Débito
4 - Dinheiro`
    );

    let forma = "";

    if(pagamento == "1") forma = "PIX";
    else if(pagamento == "2") forma = "Cartão de Crédito";
    else if(pagamento == "3") forma = "Cartão de Débito";
    else if(pagamento == "4") forma = "Dinheiro";
    else{
        alert("Forma de pagamento inválida!");
        return;
    }

    alert(
        `✅ Pedido realizado com sucesso!\n` +
        `💰 Total: R$ ${total.toFixed(2)}\n` +
        `💳 Pagamento: ${forma}`
    );

    // Limpa carrinho
    carrinho = [];
    total = 0;
    atualizarCarrinho();
}

// ==============================
// ESTOQUE SIMPLES
// ==============================

let estoque = {
    acai: 120,
    morango: 25,
    banana: 80,
    oreo: 35,
    nutella: 22
};

// ==============================
// ATUALIZAR ESTOQUE NA TELA
// ==============================

function atualizarEstoque(){

    for(let item in estoque){

        let el = document.getElementById(item);

        if(el){
            el.innerText = estoque[item];
        }
    }
}

// ==============================
// REDUZ ESTOQUE AO COMPRAR
// ==============================

function reduzirEstoque(produto){

    if(estoque[produto] > 0){
        estoque[produto]--;
        atualizarEstoque();
    }else{
        alert("Estoque esgotado de " + produto);
    }
}

// ==============================
// INICIALIZA
// ==============================

atualizarEstoque();