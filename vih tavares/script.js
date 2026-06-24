let carrinho = [];
let subtotal = 0;
const entrega = 5;

function adicionarCarrinho(nome, preco){

    carrinho.push({
        nome,
        preco
    });

    subtotal += preco;

    atualizarCarrinho();

    document.querySelector(".carrinho")
    .scrollIntoView({
        behavior:"smooth"
    });
}

function atualizarCarrinho(){

    const lista =
    document.getElementById("listaCarrinho");

    lista.innerHTML = "";

    carrinho.forEach(item=>{

        let li =
        document.createElement("li");

        li.innerText =
        `${item.nome} - R$ ${item.preco.toFixed(2)}`;

        lista.appendChild(li);

    });

    document.getElementById("subtotal")
    .innerText = subtotal.toFixed(2);

    document.getElementById("total")
    .innerText = (subtotal + entrega).toFixed(2);
}

function finalizarCompra(){

    let nome =
    document.getElementById("nome").value;

    let telefone =
    document.getElementById("telefone").value;

    let endereco =
    document.getElementById("endereco").value;

    if(!nome || !telefone || !endereco){
        alert("Preencha os dados de entrega.");
        return;
    }

    if(carrinho.length === 0){
        alert("Seu carrinho está vazio.");
        return;
    }

    let pagamento =
    document.getElementById("pagamento").value;

    let numeroPedido =
    Math.floor(Math.random()*100000);

    document.getElementById("resultado").innerHTML = `
    <h3>✅ Pedido Confirmado</h3>
    <p><strong>Nº Pedido:</strong> ${numeroPedido}</p>
    <p><strong>Cliente:</strong> ${nome}</p>
    <p><strong>Pagamento:</strong> ${pagamento.toUpperCase()}</p>
    <p><strong>Total:</strong> R$ ${(subtotal+entrega).toFixed(2)}</p>
    <p><strong>Tempo estimado:</strong> 25 minutos</p>
    `;

    carrinho = [];
    subtotal = 0;

    atualizarCarrinho();
}