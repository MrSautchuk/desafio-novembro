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

function exibirProdutos(produtos) {
    const produtosContainer = document.getElementById('produtos');
    produtosContainer.innerHTML = '';

    produtos.forEach(produto => {
        console.log('Produto:', produto);

        const attributes = produto.attributes;

        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto');

        const imagem = document.createElement('img');
        if (attributes.imagens && attributes.imagens.length > 0) {
            imagem.src = attributes.imagens[0];
        } else {
            imagem.src = 'https://via.placeholder.com/300';
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
            alert(`Você comprou: ${attributes.nome}`);  // precisa trabalhar
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
}

window.onload = iniciarApp;

