let products = [];
const PRODUCTS_PER_PAGE = 12;
const PRODUCTS_PER_LOAD = 8;

document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = Object.keys(data).flatMap(category =>
                data[category].map(item => ({ ...item, category }))
            );
            displayProducts(products.filter(product => product.bestseller), 'bestsellerProductList', PRODUCTS_PER_PAGE);
            displayProducts(products.filter(product => product.hot), 'hotProductList', PRODUCTS_PER_PAGE);
            checkLoadMoreButton('bestsellerProductList', products.filter(product => product.bestseller));
            checkLoadMoreButton('hotProductList', products.filter(product => product.hot));
        })
        .catch(error => console.error('Error loading products:', error));
});

function displayProducts(productList, elementId, limit) {
    const productListElement = document.getElementById(elementId);
    productList.slice(0, limit).forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image || 'default-image.png'}" alt="${product.name}" class="product-image">
            <h2>${product.name}</h2>
            <p>${product.price}.000 VND</p>
            <p>Thời gian: ${product.duration}</p>
        `;
        productCard.onclick = () => showProductDetails(product);
        productListElement.appendChild(productCard);
    });
}

function showProductDetails(product) {
    const modal = document.getElementById('productModal');
    const productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = `
        <img src="${product.image || 'default-image.png'}" alt="${product.name}" class="modal-product-image">
        <h2>${product.name}</h2>
        <p>Giá: ${product.price} VND</p>
        <p>Thời gian: ${product.duration}</p>
        <p>Chi tiết: ${product.description}</p>
    `;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
}

function filterProducts() {
    const titleProduct = document.getElementById('titleProduct');
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => {
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchInput);
        return matchesCategory && matchesSearch;
    });
    titleProduct.innerText="";
    document.getElementById('bestsellerProductList').innerHTML = '';
    document.getElementById('hotProductList').innerHTML = '';
    displayProducts(filteredProducts.filter(product => product.bestseller), 'bestsellerProductList', PRODUCTS_PER_PAGE);
    displayProducts(filteredProducts.filter(product => product.hot), 'hotProductList', PRODUCTS_PER_PAGE);
    checkLoadMoreButton('bestsellerProductList', filteredProducts.filter(product => product.bestseller));
    checkLoadMoreButton('hotProductList', filteredProducts.filter(product => product.hot));
    if (searchInput) {
        titleProduct.innerText = "Kết quả tìm kiếm";
    } else if (categoryFilter == 'all') {
        titleProduct.innerText = "Sản phẩm bán chạy trong tháng";
    } else {
        titleProduct.innerText = `Kết quả tìm kiếm cho ${categoryFilter}`
    }
}

function loadMoreProducts(listType) {
    const currentDisplayedProducts = document.querySelectorAll(`#${listType} .product-card`).length;
    const nextProducts = products.filter(product => listType === 'bestsellerProductList' ? product.bestseller : product.hot).slice(currentDisplayedProducts, currentDisplayedProducts + PRODUCTS_PER_LOAD);
    displayProducts(nextProducts, listType, PRODUCTS_PER_LOAD);
    checkLoadMoreButton(listType, products.filter(product => listType === 'bestsellerProductList' ? product.bestseller : product.hot));
}

function checkLoadMoreButton(listType, filteredProducts) {
    const loadMoreButton = document.getElementById(`${listType}LoadMoreButton`);
    if (document.querySelectorAll(`#${listType} .product-card`).length >= filteredProducts.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
}
