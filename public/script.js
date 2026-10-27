const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1499,
        description: "Enjoy clear sound and comfortable listening.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 1999,
        description: "Track your daily activity and stay connected.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Apple Phone",
        price: 119499,
        description: "Enjoy your all-rounder phone.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Lenovo Laptop",
        price: 1499,
        description: "A laptop for multitasking and daily use.",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "JBL Soundbar",
        price: 1499,
        description: "Enjoy clear sound and powerful audio.",
        category: "accessories",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Running Shoes",
        price: 2499,
        description: "Lightweight shoes for everyday running.",
        category: "fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Gray Mercedes",
        price: 5000000,
        description: "Classic look and very high speed car , best for daily uses.",
        category: "car",
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
    },
    {
        id: 8,
        name: "Fortuner car",
        price: 3000000,
        description: "Classic look and very high speed car ,4 * 4 , best for daily uses.",
        category: "car",
        image: "https://images.unsplash.com/photo-1664783856972-ac9922d7b2d3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
    },
    {
        id: 9,
        name: "Duke 400",
        price: 3500000,
        description: "Premium look and ,High speed bike, it's exhaust sound so good ",
        category: "bike",
        image: "https://images.unsplash.com/photo-1591378603223-e15b45a81640?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
    },
    {
        id: 10,
        name: "Hunter 350",
        price: 250000,
        description: "Classic look and, comfort riding with Beutifull Experience ",
        category: "bike",
        image: "https://images.unsplash.com/photo-1689600615622-0e6aa9f1a949?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
    }
];

const productsContainer = document.getElementById("products");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("product-search");

const productList = document.getElementById("product-list");
const productDetails = document.getElementById("product-details");
const detailsContent = document.getElementById("details-content");

const checkoutForm = document.getElementById("checkout-form");
const orderMessage = document.getElementById("order-message");

let cart = [];

try {
    const savedCart = JSON.parse(localStorage.getItem("cart"));

    if (Array.isArray(savedCart)) {
        cart = savedCart;
    }
} catch (error) {
    console.error("Could not load saved cart:", error);
}

// Render Products
function renderProducts(productArray = products) {
    if (productArray.length === 0) {
        productsContainer.innerHTML =
            "<p>No products found. Try another search.</p>";
        return;
    }

    productsContainer.innerHTML = productArray.map(product => `
        <div class="product-card">
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <h3>${product.name}</h3>

            <p><strong>₹${product.price.toLocaleString("en-IN")}</strong></p>

            <button onclick="showDetails(${product.id})">
                View Details
            </button>

            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join("");
}

// Search Products
function searchProducts(query) {
    const searchTerm = query.trim().toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    productList.hidden = false;
    productDetails.hidden = true;

    renderProducts(filteredProducts);
}

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchProducts(searchInput.value);
});

// Search results update
searchInput.addEventListener("input", function () {
    searchProducts(searchInput.value);
});

// Category Filtering
document.querySelectorAll("[data-category]").forEach(link => {
    link.addEventListener("click", function () {
        const selectedCategory = this.dataset.category;

        searchInput.value = "";

        const filteredProducts = selectedCategory === "all"
            ? products
            : products.filter(product =>
                product.category === selectedCategory
            );

        productList.hidden = false;
        productDetails.hidden = true;

        renderProducts(filteredProducts);
    });
});

// Product Details
function showDetails(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    productList.hidden = true;
    productDetails.hidden = false;

    detailsContent.innerHTML = `
        <div class="product-card">
            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <h2>${product.name}</h2>

            <p>
                <strong>Price: ₹${product.price.toLocaleString("en-IN")}</strong>
            </p>

            <p>${product.description}</p>

            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    productDetails.scrollIntoView({ behavior: "smooth" });
}

function showProducts() {
    productList.hidden = false;
    productDetails.hidden = true;

    searchInput.value = "";
    renderProducts();

    productList.scrollIntoView({ behavior: "smooth" });
}

// Save Cart
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to Cart
function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Change Quantity
function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);

    if (!item) return;
    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
}

// Remove Cart Item
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Update Cart
function updateCart() {
    cartItemsContainer.innerHTML = cart.length === 0
        ? "<p>Your cart is empty.</p>"
        : cart.map(item => `
            <div class="cart-item">
                <span>${item.name}</span>

                <button onclick="changeQuantity(${item.id}, -1)">
                    −
                </button>

                <span>${item.quantity}</span>

                <button onclick="changeQuantity(${item.id}, 1)">
                    +
                </button>

                <span>
                    ₹${(item.price * item.quantity).toLocaleString("en-IN")}
                </span>

                <button onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `).join("");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartTotal.textContent =
        `Total: ₹${total.toLocaleString("en-IN")}`;

    saveCart();
}

// Checkout
checkoutForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (cart.length === 0) {
        orderMessage.textContent =
            "Please add products to your cart first.";
        return;
    }

    const customerName =
        document.getElementById("customer-name").value.trim();

    const customerEmail =
        document.getElementById("customer-email").value.trim();

    const customerAddress =
        document.getElementById("customer-address").value.trim();

    const order = {
        customerName,
        customerEmail,
        customerAddress,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        )
    };

    const submitButton =
        checkoutForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    orderMessage.textContent = "Placing your order...";

    try {
        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(order)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Order failed");
        }

        cart = [];
        updateCart();
        checkoutForm.reset();

        orderMessage.textContent =
            `Thank you, ${customerName}! ${data.message || "Your order has been placed."}`;

    } catch (error) {
        orderMessage.textContent =
            "Order not placed. Please try again";

        console.error("Checkout error:", error);

    } finally {
        submitButton.disabled = false;
    }
});

renderProducts();
updateCart();