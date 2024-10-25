let cart = {};

function loadCart() {
    let storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCart();
        updateCartQuantity();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function toggleCart() {
    let cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.style.display = cartSidebar.style.display === 'none' ? 'block' : 'none';
}

function addToCart(id, name, price, image) {
    if (cart[id]) {
        cart[id].quantity++;
    } else {
        cart[id] = { name, price, quantity: 1, image };
    }
    saveCart();
    updateCart();
    updateCartQuantity();
    showCartSidebar();
    let addButton = document.querySelector(`.food-item[data-id="${id}"] .add-to-cart`);
    addButton.innerText = 'Already Added';
    addButton.style.backgroundColor = 'gray';
    addButton.disabled = true;
}

function showCartSidebar() {
    let cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.style.display = 'block';
}

function updateCart() {
    let cartContent = document.getElementById('cart-content');
    cartContent.innerHTML = '';
    let totalPrice = 0;

    for (let id in cart) {
        let item = cart[id];
        let itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        let cartDiv = document.createElement('div');
        cartDiv.className = 'flex items-center justify-between border-2 border-bg-gray-100 p-5 rounded my-4 relative';
        cartDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 mr-2">
            <div class="flex-grow">
                <span class="block text-lg font-medium">${item.name}</span>
                <span class="block text-lg font-bold">$${itemTotal.toFixed(2)}</span>
            </div>
            <div class="flex items-center bg-white px-2 py-1">
                <button class="text-2xl font-roboto font-semibold bg-red-500 px-1 text-white" onclick="updateQuantity(${id}, 1)">+</button>
                <span class="mx-3 text-xl font-roboto font-semibold bg-gray-700 px-2 text-white">${item.quantity}</span>
                <button class="text-2xl font-roboto font-semibold bg-red-500 px-2 text-white" onclick="updateQuantity(${id}, -1)">-</button>
            </div>
            <button class="absolute top-0 right-0 bg-gray-500 text-white px-2 rounded" onclick="removeFromCart(${id})"><i class="fa-solid fa-xmark"></i></button>
        `;

        cartContent.appendChild(cartDiv);
    }

    let totalDiv = document.createElement('div');
    totalDiv.className = 'font-bold text-lg mt-4';
    totalDiv.innerHTML = `Total: $${totalPrice.toFixed(2)}`;
    cartContent.appendChild(totalDiv);
}

function updateQuantity(id, change) {
    if (cart[id]) {
        cart[id].quantity += change;
        if (cart[id].quantity <= 0) {
            removeFromCart(id); 
        } else {
            saveCart(); 
            updateCart();
            updateCartQuantity();
        }
    }
}

function updateCartQuantity() {
    let cartQuantity = document.getElementById('cart-quantity');
    let totalQuantity = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    cartQuantity.innerText = totalQuantity > 0 ? totalQuantity : '';
}

function removeFromCart(id) {
    delete cart[id];
    saveCart();
    updateCart();
    updateCartQuantity();
    let addButton = document.querySelector(`.food-item[data-id="${id}"] .add-to-cart`);
    if (addButton) {
        addButton.innerText = 'Add to Cart';
        addButton.style.backgroundColor = '';
        addButton.disabled = false;
    }
}

function hideCartSidebar() {
    let cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart(); 

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            let foodItem = e.target.closest('.food-item');
            let id = foodItem.getAttribute('data-id');
            let name = foodItem.getAttribute('data-name');
            let price = parseFloat(foodItem.getAttribute('data-price'));
            let image = foodItem.querySelector('img').src;
            addToCart(id, name, price, image);
        });
    });

    document.querySelectorAll('.customize').forEach(button => {
        button.addEventListener('click', (e) => {
            let foodItem = e.target.closest('.food-item');
            let id = foodItem.getAttribute('data-id');
            let addButton = foodItem.querySelector('.add-to-cart');
            addButton.innerText = 'Add to Cart';
            addButton.style.backgroundColor = '';
            addButton.disabled = false;
        });
    });

    document.getElementById('close-cart-button').addEventListener('click', hideCartSidebar);
});