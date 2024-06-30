let products = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
        })
        .catch(error => console.error('Error loading products:', error));
});

function displayProducts(productList) {
    const productListElement = document.getElementById('productList');
    productListElement.innerHTML = '';
    productList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h2>${product.name}</h2>
            <p>${product.price} VND</p>
        `;
        productCard.onclick = () => showProductDetails(product);
        productListElement.appendChild(productCard);
    });
}

function showProductDetails(product) {
    const modal = document.getElementById('productModal');
    const productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="modal-product-image">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Giá: ${product.price} VND</p>
    `;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
}

function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => {
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchInput);
        return matchesCategory && matchesSearch;
    });
    displayProducts(filteredProducts);
}
