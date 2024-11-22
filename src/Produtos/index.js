const apiUrl = 'https://ecom-back-strapi.onrender.com/api/products';

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMxOTM0NTE4LCJleHAiOjE3MzQ1MjY1MTh9.P0gMo2o_ELJCl3fqnGoYGWDgEP_0sKqeDHbci9As76g';

function configurarCabecalhos() {
    return {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
}

async function buscarProdutos() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: configurarCabecalhos()
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da API: ' + response.status);
        }

        const data = await response.json();
        console.log('Dados retornados pela API:', data);
        return data.data;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        return null;
    }
}


function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade += 1; // Incrementa a quantidade se o item já estiver no carrinho
    } else {
        produto.id = produto.id || produto.attributes.nome; // Define o id do produto como nome se não tiver id
        produto.quantidade = 1; // Adiciona a propriedade quantidade se o item for novo no carrinho
        carrinho.push(produto);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`Produto adicionado ao carrinho: ${produto.attributes.nome}`);
}



function obterCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}


function exibirCarrinho() {
    const carrinhoContainer = document.getElementById('carrinho');
    const carrinho = obterCarrinho();
    carrinhoContainer.innerHTML = ''; // Limpa o container antes de adicionar novos produtos

    let total = 0;
    carrinho.forEach(produto => {
        const attributes = produto.attributes;

        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto-no-carrinho');

        const nome = document.createElement('h2');
        nome.textContent = attributes.nome;

        const preco = document.createElement('p');
        preco.textContent = `Preço: R$ ${attributes.preco.toFixed(2)}`;

        const quantidade = document.createElement('p');
        quantidade.textContent = `Quantidade: ${produto.quantidade || 1}`; // Garante que quantidade não é undefined

        const btnMais = document.createElement('button');
        btnMais.textContent = '+';
        btnMais.onclick = () => ajustarQuantidade(produto.id, 1);

        const btnMenos = document.createElement('button');
        btnMenos.textContent = '-';
        btnMenos.onclick = () => ajustarQuantidade(produto.id, -1);

        total += attributes.preco * produto.quantidade;

        produtoDiv.appendChild(nome);
        produtoDiv.appendChild(preco);
        produtoDiv.appendChild(quantidade);
        produtoDiv.appendChild(btnMais);
        produtoDiv.appendChild(btnMenos);
        carrinhoContainer.appendChild(produtoDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.textContent = `Total: R$ ${total.toFixed(2)}`;
    carrinhoContainer.appendChild(totalDiv);
}

function ajustarQuantidade(produtoId, ajuste) {
    let carrinho = obterCarrinho();
    const item = carrinho.find(produto => produto.id === produtoId);

    if (item) {
        item.quantidade += ajuste;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(produto => produto.id !== produtoId);
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        exibirCarrinho(); // Atualiza o carrinho exibido
    }
}



function removerDoCarrinho(produtoId) {
    let carrinho = obterCarrinho();
    const item = carrinho.find(produto => produto.id === produtoId);

    if (item) {
        const quantidadeParaRemover = parseInt(prompt(`Quantas unidades de ${item.attributes.nome} você deseja remover?`), 10);

        if (!isNaN(quantidadeParaRemover) && quantidadeParaRemover > 0) {
            if (item.quantidade > quantidadeParaRemover) {
                item.quantidade -= quantidadeParaRemover; // Diminui a quantidade
            } else {
                carrinho = carrinho.filter(produto => produto.id !== produtoId); // Remove o item se a quantidade a remover for maior ou igual
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            exibirCarrinho(); // Atualiza o carrinho exibido
        } else {
            alert('Quantidade inválida. Por favor, insira um número válido.');
        }
    }
}




// Função para exibir produtos na página inicial
function exibirProdutos(produtos) {
    const produtosContainer = document.getElementById('produtos');
    produtosContainer.innerHTML = ''; // Limpa o container antes de adicionar novos produtos

    produtos.forEach(produto => {
        const attributes = produto.attributes;

        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto');

        const imagem = document.createElement('img');
        if (attributes.imagens && attributes.imagens.length > 0) {
            imagem.src = attributes.imagens[0]; // Usa a primeira imagem
        } else {
            imagem.src = 'https://via.placeholder.com/300'; // Imagem padrão se não houver imagens
        }
        imagem.alt = attributes.nome;
        imagem.classList.add('produto-imagem');

        const nome = document.createElement('h2');
        nome.textContent = attributes.nome;

        const preco = document.createElement('p');
        if (attributes.preco !== undefined) {
            preco.textContent = `Preço: R$ ${attributes.preco.toFixed(2)}`;
        } else {
            preco.textContent = 'Preço: Não disponível';
        }

        const botaoComprar = document.createElement('button');
        botaoComprar.textContent = 'Comprar';
        botaoComprar.onclick = () => {
            adicionarAoCarrinho(produto);
        };

        produtoDiv.appendChild(imagem);
        produtoDiv.appendChild(nome);
        produtoDiv.appendChild(preco);
        produtoDiv.appendChild(botaoComprar);
        produtosContainer.appendChild(produtoDiv);
    });
}

async function iniciarApp() {
    const produtos = await buscarProdutos();
    if (produtos) {
        exibirProdutos(produtos);
    } else {
        console.error('Nenhum produto encontrado.');
    }

    // Configuração do modal
    const modal = document.getElementById('carrinhoModal');
    const btn = document.getElementById('carrinhoBtn');
    const btn1 = document.getElementById('carrinhoBtn1')
    const span = document.getElementsByClassName('close')[0];

    btn.onclick = function() {
        exibirCarrinho();
        modal.style.display = 'block';
    }

    btn1.onclick = function() {
        exibirCarrinho();
        modal.style.display = 'block';
    }

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

window.onload = iniciarApp;
