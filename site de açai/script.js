// BANCO DE DADOS LOCAL (ESTOQUE) INICIAL
const initialStock = {
    "copo-300": { name: "Açaí no Copo 300ml", qty: 50 },
    "copo-400": { name: "Açaí no Copo 400ml", qty: 40 },
    "copo-500": { name: "Açaí no Copo 500ml", qty: 35 },
    "marmita-700": { name: "Marmita de Açaí 700ml", qty: 20 },
    "marmita-1000": { name: "Marmita de Açaí 1L", qty: 15 },
    "garrafa-500": { name: "Garrafa de Açaí 500ml", qty: 30 },
    "garrafa-1000": { name: "Garrafa de Açaí 1L", qty: 25 }
};

// Verifica se já existe estoque salvo, senão cria o padrão
if (!localStorage.getItem('store_stock')) {
    localStorage.setItem('store_stock', JSON.stringify(initialStock));
}

let currentCart = [];
let currentUser = null;

// CONTROLE DO LOGIN OBRIGATÓRIO DOS CLIENTES
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    currentUser = {
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        phone: document.getElementById('user-phone').value,
        address: document.getElementById('user-address').value
    };

    // Salva a sessão do usuário no navegador
    localStorage.setItem('active_customer', JSON.stringify(currentUser));
    document.getElementById('login-screen').style.display = 'none';
});

// ADICIONAR AO CARRINHO COM VERIFICAÇÃO DE ESTOQUE
document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const id = card.getAttribute('data-id');
        const nome = card.getAttribute('data-nome');
        const preco = parseFloat(card.getAttribute('data-preco'));
        
        let stock = JSON.parse(localStorage.getItem('store_stock'));

        // Validação se há item no estoque do painel restrito
        if (stock[id].qty <= 0) {
            alert(`Desculpe, o item "${nome}" está esgotado no estoque!`);
            return;
        }

        // Reduz estoque temporariamente na tentativa do carrinho
        stock[id].qty -= 1;
        localStorage.setItem('store_stock', JSON.stringify(stock));

        const itemInCart = currentCart.find(item => item.id === id);
        if (itemInCart) {
            itemInCart.qty += 1;
        } else {
            currentCart.push({ id, nome, preco, qty: 1 });
        }

        renderCart();
    });
});

// REDERIZAÇÃO DA INTERFACE DO CARRINHO
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    
    if (currentCart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">O carrinho está vazio.</p>';
        totalContainer.innerText = 'R$ 0,00';
        return;
    }

    cartContainer.innerHTML = '';
    let total = 0;

    currentCart.forEach(item => {
        total += item.preco * item.qty;
        cartContainer.innerHTML += `
            <div class="cart-item">
                <span>${item.qty}x ${item.nome}</span>
                <span>R$ ${(item.preco * item.qty).toFixed(2)}</span>
            </div>
        `;
    });

    totalContainer.innerText = `R$ ${total.toFixed(2)}`;
}

// FINALIZAR PEDIDO (SALVA HISTÓRICO E DISPARA SIMULAÇÃO)
document.getElementById('btn-checkout').addEventListener('click', function() {
    if (currentCart.length === 0) {
        alert("Adicione pelo menos um açaí ao carrinho!");
        return;
    }

    const payMethod = document.getElementById('payment-method').value;
    
    const finalOrder = {
        cliente: currentUser,
        itens: currentCart,
        pagamento: payMethod,
        data: new Date().toLocaleString()
    };

    // Salva o histórico de pedidos permanente no navegador
    let ordersHistory = JSON.parse(localStorage.getItem('orders_history')) || [];
    ordersHistory.push(finalOrder);
    localStorage.setItem('orders_history', JSON.stringify(ordersHistory));

    // Exibe simulação realista de conclusão de pedido
    alert(`🎉 Pedido Recebido com Sucesso!\n\nCliente: ${currentUser.name}\nEndereço: ${currentUser.address}\nForma de Pagamento: ${payMethod}\n\nO motoboy já está a caminho!`);
    
    // Limpa carrinho atual
    currentCart = [];
    renderCart();
});

// PAINEL DE CONTROLE DE ESTOQUE RESTRITO (SÓ PARA FUNCIONÁRIOS)
document.getElementById('btn-admin-login').addEventListener('click', function() {
    const passwordInput = prompt("Digite a senha secreta de funcionário:");
    
    // Definição da senha estática exigida no enunciado
    if (passwordInput === "admin123") {
        renderStockTable();
        document.getElementById('admin-screen').style.display = 'flex';
    } else {
        alert("Senha incorreta! Acesso estritamente negado.");
    }
});

// FECHAR MODAL DO PAINEL INTERNO
document.getElementById('close-admin').addEventListener('click', function() {
    document.getElementById('admin-screen').style.display = 'none';
});

// MONTA A TABELA DE ESTOQUE DINAMICAMENTE COM BOTÃO DE ADICIONAR MAIS PRODUTO
function renderStockTable() {
    const tbody = document.getElementById('stock-table-body');
    let stock = JSON.parse(localStorage.getItem('store_stock'));
    tbody.innerHTML = '';

    Object.keys(stock).forEach(key => {
        tbody.innerHTML += `
            <tr>
                <td>${stock[key].name}</td>
                <td><strong>${stock[key].qty} un</strong></td>
                <td><button onclick="restock('${key}')" style="padding:4px 8px; cursor:pointer;">+10 Unidades</button></td>
            </tr>
        `;
    });
}

// FUNÇÃO INTERNA DO FUNCIONÁRIO PARA REABASTECER ITENS
window.restock = function(id) {
    let stock = JSON.parse(localStorage.getItem('store_stock'));
    stock[id].qty += 10;
    localStorage.setItem('store_stock', JSON.stringify(stock));
    renderStockTable();
};

