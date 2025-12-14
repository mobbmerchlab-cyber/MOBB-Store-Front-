const API = "https://YOUR-BACKEND-URL/api/products"; // Replace with your backend URL
const container = document.getElementById("products");
const cartCount = document.getElementById("cart-count");

let cart = JSON.parse(localStorage.getItem("mobb-cart") || "[]");

function updateCartUI() {
  cartCount.textContent = cart.reduce((acc, i) => acc + i.quantity, 0);
  localStorage.setItem("mobb-cart", JSON.stringify(cart));
}

function addToCart(product) {
  const exist = cart.find(i => i.id === product.id);
  if (exist) exist.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  updateCartUI();
}

async function loadProducts() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    if (!data.success) return;

    container.innerHTML = data.products.map(p => `
      <div class="product-card fade-up border rounded-xl p-4">
        <img src="${p.thumbnail}" class="w-full aspect-square object-cover rounded-lg"/>
        <h2 class="mt-3 font-medium">${p.name}</h2>
        <button onclick='addToCart(${JSON.stringify(p)})'
                class="mt-2 w-full py-1 bg-black text-white rounded">Add to Cart</button>
      </div>
    `).join("");

    updateCartUI();
  } catch {
    container.innerHTML = `<p class="col-span-full text-center">Failed to load products.</p>`;
  }
}

document.getElementById("cart-btn").addEventListener("click", () => {
  if (!cart.length) return alert("Cart is empty");
  const customer = {
    name: "Test Customer",
    address: "Street 1",
    city: "City",
    country: "PH",
    state: "PH",
    zip: "1000"
  };
  fetch("https://YOUR-BACKEND-URL/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: cart, customer })
  })
  .then(r => r.json())
  .then(res => {
    if (res.success) { alert("Order created: "+res.order_id); cart=[]; updateCartUI(); }
    else alert("Order failed");
  });
});

loadProducts();