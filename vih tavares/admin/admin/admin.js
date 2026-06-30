const USUARIO = "admin";
const SENHA = "123456";

// LOGIN
function login() {

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const erro = document.getElementById("erro");

    if (usuario === USUARIO && senha === SENHA) {

        localStorage.setItem("logado", "true");

        window.location.href = "painel.html";

    } else {

        erro.innerHTML = "Usuário ou senha incorretos.";

    }

}

// PROTEGER PAINEL
if (window.location.pathname.includes("painel.html")) {

    if (localStorage.getItem("logado") !== "true") {

        window.location.href = "login.html";

    }

}

// SAIR
function sair() {

    localStorage.removeItem("logado");

    window.location.href = "login.html";

}

// SALVAR PRODUTO
function salvarProduto(produto) {

    let preco;
    let estoque;

    if(produto === "300ml"){
        preco = document.getElementById("preco300").value;
        estoque = document.getElementById("estoque300").value;
    }

    if(produto === "500ml"){
        preco = document.getElementById("preco500").value;
        estoque = document.getElementById("estoque500").value;
    }

    if(produto === "700ml"){
        preco = document.getElementById("preco700").value;
        estoque = document.getElementById("estoque700").value;
    }

    if(produto === "1000ml"){
        preco = document.getElementById("preco1000").value;
        estoque = document.getElementById("estoque1000").value;
    }

    localStorage.setItem(produto, JSON.stringify({
        preco: preco,
        estoque: estoque
    }));

    alert("Produto salvo com sucesso!");

}

// ADICIONAR NOVO PRODUTO
function adicionarProduto(){

    const nome = document.getElementById("novoNome").value;
    const preco = document.getElementById("novoPreco").value;
    const estoque = document.getElementById("novoEstoque").value;

    if(nome === "" || preco === "" || estoque === ""){

        alert("Preencha todos os campos.");

        return;

    }

    let produtos = JSON.parse(localStorage.getItem("novosProdutos")) || [];

    produtos.push({

        nome:nome,
        preco:preco,
        estoque:estoque

    });

    localStorage.setItem("novosProdutos",JSON.stringify(produtos));

    alert("Produto cadastrado!");

    document.getElementById("novoNome").value="";
    document.getElementById("novoPreco").value="";
    document.getElementById("novoEstoque").value="";

}