// ================================
// CARRINHO DE COMPRAS
// ================================

// Carrega o carrinho salvo
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Atualiza a tela ao abrir o site
atualizarCarrinho();


// ================================
// ADICIONAR PRODUTO
// ================================

function adicionarCarrinho(nome, preco){

    carrinho.push({
        nome: nome,
        preco: preco
    });

    salvarCarrinho();

    alert(nome + " adicionado ao carrinho!");

}


// ================================
// SALVAR CARRINHO
// ================================

function salvarCarrinho(){

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    atualizarCarrinho();

}


// ================================
// ATUALIZAR CARRINHO
// ================================

function atualizarCarrinho(){

    const lista = document.getElementById("listaCarrinho");
    const contador = document.getElementById("contador");
    const total = document.getElementById("total");

    if(!lista) return;

    lista.innerHTML = "";

    let valorTotal = 0;

    contador.textContent = carrinho.length;

    if(carrinho.length == 0){

        lista.innerHTML = "<p>Seu carrinho está vazio.</p>";

        total.innerHTML = "Total: R$ 0,00";

        return;

    }

    carrinho.forEach((produto,index)=>{

        valorTotal += produto.preco;

        lista.innerHTML += `

        <div class="itemCarrinho">

            <p>

                <strong>${produto.nome}</strong>

                - R$ ${produto.preco.toFixed(2)}

                <button onclick="removerItem(${index})">

                    Remover

                </button>

            </p>

        </div>

        `;

    });

    total.innerHTML =
        "Total: R$ " + valorTotal.toFixed(2);

}


// ================================
// REMOVER ITEM
// ================================

function removerItem(indice){

    carrinho.splice(indice,1);

    salvarCarrinho();

}


// ================================
// BOTÃO DO CARRINHO
// ================================

const btnCarrinho = document.getElementById("btnCarrinho");

const painel = document.getElementById("painelCarrinho");

if(btnCarrinho){

    btnCarrinho.addEventListener("click",()=>{

        if(painel.style.display=="block"){

            painel.style.display="none";

        }else{

            painel.style.display="block";

        }

    });

}


// Esconde ao abrir

if(painel){

    painel.style.display="none";

}


// ================================
// FINALIZAR PEDIDO (abre pagamento)
// ================================
const finalizar = document.getElementById("btnFinalizar");

if(finalizar){

    finalizar.addEventListener("click",()=>{
        
        if(carrinho.length==0){
            
            alert("Seu carrinho está vazio.");
            return;
        }

        const total = carrinho.reduce((t,p)=>t+p.preco,0);

        // guarda pedido pendente (ainda não cria em "pedidos")
        const pedidoPendente = {
            produtos: carrinho,
            total,
            criadoEm: new Date().toISOString()
        };
        localStorage.setItem("pedidoPendente", JSON.stringify(pedidoPendente));

        // abre modal
        abrirModalPagamento();
    });
}

// ================================
// MODAL PAGAMENTO (SIMULAÇÃO)
// ================================
let metodoSelecionado = null;

function abrirModalPagamento(){
    const modal = document.getElementById('modalPagamento');
    if(!modal) return;

    // reset telas
    selecionarMetodo(null, true);

    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');

    // prepara dados PIX
    const pendente = JSON.parse(localStorage.getItem('pedidoPendente'));
    const total = pendente?.total || 0;
    const pixTotal = document.getElementById('pixTotal');
    if(pixTotal){
        pixTotal.innerHTML = `Total: R$ ${Number(total).toFixed(2)}`;
    }

    const pixCodigo = document.getElementById('pixCodigo');
    if(pixCodigo){
        // código mock determinístico (para copiar/visualizar)
        const ref = (pendente?.criadoEm || Date.now().toString()).replace(/[^0-9]/g,'').slice(-10);
        pixCodigo.value = `00020126.${ref}BR.GOV.BCB.PIXDEMO.${String(total).replace('.','')}.0000`;
    }
}

function fecharModalPagamento(){
    const modal = document.getElementById('modalPagamento');
    if(!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

function selecionarMetodo(metodo, resetOnly){
    const painelPix = document.getElementById('painelPix');
    const painelCartao = document.getElementById('painelCartao');
    const btnPix = document.getElementById('btnMetodoPix');
    const btnCartao = document.getElementById('btnMetodoCartao');

    if(!painelPix || !painelCartao || !btnPix || !btnCartao) return;

    if(resetOnly){
        painelPix.style.display = 'none';
        painelCartao.style.display = 'none';
        btnPix.classList.remove('ativo');
        btnCartao.classList.remove('ativo');
        metodoSelecionado = null;
        return;
    }

    metodoSelecionado = metodo;

    if(metodo === 'pix'){
        painelPix.style.display = 'block';
        painelCartao.style.display = 'none';
        btnPix.classList.add('ativo');
        btnCartao.classList.remove('ativo');
    } else if(metodo === 'cartao'){
        painelPix.style.display = 'none';
        painelCartao.style.display = 'block';
        btnCartao.classList.add('ativo');
        btnPix.classList.remove('ativo');
    } else {
        painelPix.style.display = 'none';
        painelCartao.style.display = 'none';
        btnPix.classList.remove('ativo');
        btnCartao.classList.remove('ativo');
    }
}

function copiarPix(){
    const input = document.getElementById('pixCodigo');
    if(!input) return;

    input.focus();
    input.select();

    try{
        const ok = document.execCommand('copy');
        alert(ok ? 'Código PIX copiado!' : 'Não foi possível copiar. Copie manualmente.');
    }catch(e){
        alert('Não foi possível copiar. Copie manualmente.');
    }
}

function confirmarPagamento(){
    const pendente = JSON.parse(localStorage.getItem('pedidoPendente'));
    if(!pendente){
        alert('Nenhum pagamento pendente encontrado.');
        return;
    }

    // se o usuário não escolheu método, deixa confirmar mesmo assim (demo)
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    pedidos.push({
        numero: pedidos.length + 1,
        data: new Date().toLocaleString(),
        produtos: pendente.produtos || [],
        total: Number(pendente.total || 0),
        metodo: metodoSelecionado || 'indefinido'
    });

    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    localStorage.removeItem('pedidoPendente');

    // limpa carrinho (estado real)
    carrinho = [];
    salvarCarrinho();

    fecharModalPagamento();
    alert('Pagamento confirmado! Pedido realizado com sucesso!');
}



// ================================
// CADASTRO
// ================================

function cadastrarCliente(){

    let nome =
        document.getElementById("nome").value;

    let telefone =
        document.getElementById("telefone").value;

    let endereco =
        document.getElementById("endereco").value;

    let email =
        document.getElementById("email").value;

    let senha =
        document.getElementById("senha").value;

    if(
        nome=="" ||
        telefone=="" ||
        endereco=="" ||
        email=="" ||
        senha==""
    ){

        alert("Preencha todos os campos.");

        return;

    }

    let cliente={

        nome,
        telefone,
        endereco,
        email,
        senha

    };

    localStorage.setItem(
        "cliente",
        JSON.stringify(cliente)
    );

    alert("Cadastro realizado!");

    window.location="login.html";

}


// ================================
// LOGIN
// ================================

function fazerLogin(){

    let email =
        document.getElementById("email").value;

    let senha =
        document.getElementById("senha").value;

    let cliente =
        JSON.parse(localStorage.getItem("cliente"));

    if(cliente==null){

        alert("Nenhum cadastro encontrado.");

        return;

    }

    if(

        email==cliente.email &&

        senha==cliente.senha

    ){

        alert("Login realizado!");

        window.location="index.html";

    }

    else{

        alert("Email ou senha incorretos.");

    }

}


// ================================
// LOGOUT
// ================================

function sair(){

    alert("Até logo!");

    window.location="login.html";

}


// ================================
// LISTAR PEDIDOS
// ================================

function mostrarPedidos(){

    let lista =
        document.getElementById("pedidos");

    if(!lista) return;

    let pedidos =
        JSON.parse(localStorage.getItem("pedidos")) || [];

    if(pedidos.length==0){

        lista.innerHTML="<p>Nenhum pedido encontrado.</p>";

        return;

    }

    lista.innerHTML="";

    pedidos.forEach((pedido)=>{

        lista.innerHTML+=`

        <div class="pedido">

            <h3>Pedido #${pedido.numero}</h3>

            <p>${pedido.data}</p>

            <p>Total: R$ ${pedido.total.toFixed(2)}</p>

            <hr>

        </div>

        `;

    });

}


// ================================
// CARREGA PEDIDOS
// ================================

mostrarPedidos();