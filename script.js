const PRODUCTS_PER_PAGE = 12;
const PRODUCTS_PER_LOAD = 8;

let allProducts = [];
let displayedProducts = {
    bestsellerProductList: [],
    hotProductList: []
};

document.addEventListener('DOMContentLoaded', () => {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';

    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            allProducts = Object.keys(data).flatMap(category =>
                data[category].map(item => ({ ...item, category }))
            );
            // Hiển thị sản phẩm ban đầu
            displayProducts('bestsellerProductList', 0, PRODUCTS_PER_PAGE);
            displayProducts('hotProductList', 0, PRODUCTS_PER_PAGE);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            // Hiển thị thông báo lỗi cho người dùng
            loadingIndicator.innerText = "Có lỗi xảy ra khi tải sản phẩm!";
        })
        .finally(() => {
            loadingIndicator.style.display = 'none';
        });


    const loadMoreButtons = document.querySelectorAll('.load-more-button');
    loadMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const listType = button.id.replace('LoadMoreButton', '');
            loadMoreProducts(listType);
        });
    });

    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', filterProducts);

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', filterProducts);

});

function displayProducts(listType, startIndex, limit) {
    const filteredProducts = getFilteredProducts(listType);
    const productListElement = document.getElementById(listType);

    const productsToDisplay = filteredProducts.slice(startIndex, startIndex + limit);
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = getProductCardHTML(product);
        productCard.onclick = () => showProductDetails(product);
        productListElement.appendChild(productCard);
    });

    // Lưu trữ sản phẩm đã hiển thị
    displayedProducts[listType] = displayedProducts[listType].concat(productsToDisplay);

    checkLoadMoreButton(listType);
}

function getProductCardHTML(product) {
    const priceDisplay = product.price === -1 ? "Liên hệ" : `${product.price}.000 VND`;
    return `
        <img src="${product.image || 'default-image.png'}" alt="${product.name}" class="product-image">
        <h2>${product.name}</h2>
        <p>${priceDisplay}</p>
        <p>Thời gian: ${product.duration}</p>
    `;
}

function showProductDetails(product) {
    const modal = document.getElementById('productModal');
    const productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = `
        <img src="${product.image || 'default-image.png'}" alt="${product.name}" class="modal-product-image">
        <h2>${product.name}</h2>
        <p>Giá: ${product.price}.000 VND</p>
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

    // Reset displayed products
    displayedProducts = {
        bestsellerProductList: [],
        hotProductList: []
    };

    // Clear existing product lists
    document.getElementById('bestsellerProductList').innerHTML = '';
    document.getElementById('hotProductList').innerHTML = '';

    // Hiển thị sản phẩm đã lọc
    displayProducts('bestsellerProductList', 0, PRODUCTS_PER_PAGE);
    displayProducts('hotProductList', 0, PRODUCTS_PER_PAGE);

    if (searchInput) {
        titleProduct.innerText = "Kết quả tìm kiếm";
    } else if (categoryFilter === 'all') {
        titleProduct.innerText = "Sản phẩm bán chạy trong tháng";
    } else {
        titleProduct.innerText = `Kết quả tìm kiếm cho ${categoryFilter}`;
    }

    toggleHotSectionVisibility();
}

function toggleHotSectionVisibility() {
    const hotSection = document.getElementById('hotSection');
    const filteredHotProducts = getFilteredProducts('hotProductList');

    if (filteredHotProducts.length > 0) {
        hotSection.style.display = 'block';
    } else {
        hotSection.style.display = 'none';
    }
}

function loadMoreProducts(listType) {
    const startIndex = document.querySelectorAll(`#${listType} .product-card`).length;
    displayProducts(listType, startIndex, PRODUCTS_PER_LOAD);
}

function checkLoadMoreButton(listType) {
    const loadMoreButton = document.getElementById(`${listType}LoadMoreButton`);
    const filteredProducts = getFilteredProducts(listType);
    if (displayedProducts[listType].length >= filteredProducts.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
}

function getFilteredProducts(listType) {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    return allProducts.filter(product => {
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchInput);
        const matchesListType = !listType || (listType === 'bestsellerProductList' && product.bestseller) || (listType === 'hotProductList' && product.hot);
        return matchesCategory && matchesSearch && matchesListType;
    });
}
