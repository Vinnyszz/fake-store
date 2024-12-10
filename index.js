let shoppingCart = []

function cartItemContainer(id) {
    const container = document.createElement('div')
    container.classList.add('item')
    container.id = `item-${id}`
    return container
}

function createItemName(name) {
    const itemName = document.createElement('span')
    itemName.textContent = name
    return itemName
}

function createItemQuantitie(quantitie) {
    const itemQuantitie = document.createElement('span')
    itemQuantitie.textContent = (`Quantidade: ${quantitie}`)
    return itemQuantitie
}

function createItemPrice(price) {
    const itemPrice = document.createElement('span')
    itemPrice.classList.add('item-price')
    const formater = Intl.NumberFormat('pt-BR', {
        compactDisplay: 'long',
        currency: 'BRL',
        style: 'currency'
    })
    // Retirar e substituir por Código CSS
    itemPrice.textContent = (`Valor: ${formater.format(price)}`)
    return itemPrice
}

function createItemTotalPrice(quantitie, price) {
    const ItemTotalPrice = document.createElement('span')
    ItemTotalPrice.classList.add('total-item-price')
    const totalPrice = quantitie * price
    const formater = Intl.NumberFormat('pt-BR', {
        compactDisplay: 'long',
        currency: 'BRL',
        style: 'currency'
    })
    // Retirar e substituir por Código CSS
    ItemTotalPrice.textContent = (`Valor total: ${formater.format(totalPrice)}`)
    return ItemTotalPrice
}
function createEditBtn(item) {
    const editBtn = document.createElement('button')
    editBtn.classList.add('edit-btn')
    editBtn.textContent='Editar'
    editBtn.addEventListener('click', () => {
        document.querySelector('#id').value = item.id
        document.querySelector('#item').value = item.name
        document.querySelector('#quantitie').value = item.quantitie
        document.querySelector('#price').value = item.price
    })
    return editBtn
}

function createDeleteBtn(id) {
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('delete-btn')
    deleteBtn.textContent = 'Excluir'
    deleteBtn.addEventListener('click', async() => {
        await fetch (`http://localhost:3000/shoppingCart/${id}`, {method: 'DELETE'})
        deleteBtn.parentElement.remove()
        const indexToRemove = shoppingCart.findIndex((i) => i.id === id)
        shoppingCart.splice(indexToRemove, 1)
        updateTotal()
    })
    return deleteBtn
}
function renderItem(item) {
    const container = cartItemContainer(item.id)
    const name = createItemName(item.name)
    const itemQuantitie = createItemQuantitie(item.quantitie)
    const itemPrice = createItemPrice(item.price)
    const totalPrice = createItemTotalPrice(item.quantitie, item.price)
    const editBtn = createEditBtn(item)
    const deleteBtn = createDeleteBtn(item.id)

    container.append(name, itemQuantitie, itemPrice, totalPrice, editBtn, deleteBtn)
    document.querySelector('#cart').append(container)
}

async function saveTrasaction(ev) {
    ev.preventDefault()
    const id = document.querySelector('#id').value
    const name = document.querySelector('#item').value
    const quantitie = Number(document.querySelector('#quantitie').value)
    const price = parseFloat(document.querySelector('#price').value)
    const total = price * quantitie
    
    if(id) {
        // Se o item já existir, vamos atualizá-lo
        const response = await fetch(`http://localhost:3000/shoppingCart/${id}`, {
            method: 'PUT',
            body: JSON.stringify({name, quantitie, price, total}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const item = await response.json()

        //Vamos atualizar o array agora
        const indexToRemove = shoppingCart.findIndex((i) => i.id === id)
        shoppingCart.splice(indexToRemove, 1, item)
        // Vamos também remover o elemento da tela
        document.querySelector(`#item-${id}`).remove()
        renderItem(item)

    } else {
        const response = await fetch('http://localhost:3000/shoppingCart', {
            method: 'POST',
            body: JSON.stringify({name, quantitie, price, total}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const item = await response.json()
        shoppingCart.push(item)
        renderItem(item)
    }
    ev.target.reset()
    updateTotal()
}

async function fetchItens() {
    return await fetch('http://localhost:3000/shoppingCart').then(res => res.json())
}
function updateTotal() {
    const totalPriceSpan = document.querySelector('#total-price')
    const totalPrice = shoppingCart.reduce((sum, item) => sum + item.total, 0)
    const formater = Intl.NumberFormat('pt-BR', {
        compactDisplay: 'long',
        currency: 'BRL',
        style: 'currency'
    })
    totalPriceSpan.textContent = formater.format(totalPrice)
}
async function setup() {
    const itens = await fetchItens()
    shoppingCart.push(...itens)
    shoppingCart.forEach(renderItem)
    updateTotal()
}

document.addEventListener('DOMContentLoaded', setup)
document.addEventListener('submit', saveTrasaction)

/* Toggle between light and dark themes */
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.createElement('button');
    themeToggle.textContent = 'Toggle Dark Mode';
    themeToggle.style = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 10px;
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
        document.documentElement.setAttribute(
            'data-theme',
            document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        );
    });
});