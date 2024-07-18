const socket = io();

socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    if (productList) {
        productList.innerHTML = '';
        products.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.title} - ${product.price}`;
            productList.appendChild(li);
        });
    }
});

function addToCart(productId) {
    fetch(`/api/carts/your_cart_id/products/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: 1 })
    }).then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}
