const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

//ADICIONAR BEBIDAS-PORÇOES NO CARRINHO
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    console.log(name);
    console.log(price);
  }
});

function addToCartt(name, price) {
  alert("o item é" + name);
}

function showAddOns(burger, price) {
  document.getElementById("add-ons").classList.remove("hidden");
  document.getElementById("add-ons-form").setAttribute("data-burger", burger);
  document.getElementById("add-ons-form").setAttribute("data-price", price);
}

function hideAddOns() {
  document.getElementById("add-ons").classList.add("hidden");
}

function addBurger() {
  const burger = document
    .getElementById("add-ons-form")
    .getAttribute("data-burger");
  const price = parseFloat(
    document.getElementById("add-ons-form").getAttribute("data-price")
  );
  const addons = Array.from(
    document.querySelectorAll('input[name="addon"]:checked')
  ).map((checkbox) => {
    return {
      name: checkbox.value,
      price: parseFloat(checkbox.getAttribute("data-price")),
    };
  });

  addToCart(burger, price, addons);

  hideAddOns();
  document.getElementById("add-ons-form").reset();
}
//FUNÇÃO PARA ADICIONAR NO CARRINHO
function addToCart(name, price, addons) {
  const existingItem = cart.find(
    (item) =>
      item.name === name &&
      JSON.stringify(item.addons) === JSON.stringify(addons)
  );

  if (existingItem) {
    //se o item já exite, aumenta apenas a quantidade +1
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
      addons,
    });
  }

  updateCartModal();
}
//ATUALIZANDO O CARRINHO
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const addonsTotal = item.addons.reduce(
      (sum, addon) => sum + addon.price,
      0
    );
    const itemTotal = (item.price + addonsTotal) * item.quantity;

    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");
    cartItemElement.innerHTML = `
            <p><strong>${item.name}</strong> com adc: ${item.addons
      .map((addon) => `${addon.name} (R$${addon.price.toFixed(2)})`)
      .join(", ")}</p>
            <p>Qtd: ${item.quantity}</p>
            <p>Preço: R$${itemTotal.toFixed(2)}</p>
            
            <button class="remove-from-cart-btn bg-red-500 text-white rounded" data-name="${
              item.name
            }" data-addons='${JSON.stringify(item.addons)}'>Remover
            <br>
            </button>
        `;

    total += itemTotal;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerText = cart.length;
}

cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    const addons = JSON.parse(event.target.getAttribute("data-addons"));
    removeItemFromCart(name, addons);
  }
});

//REMOVENDO ITEMS DO FROM CART
function removeItemFromCart(name, addons) {
  const index = cart.findIndex(
    (item) =>
      item.name === name &&
      JSON.stringify(item.addons) === JSON.stringify(addons)
  );

  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    updateCartModal();
  }
}

checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }
  //ENVIAR PEDIDO PRO WHASTZAP
  const cartItems = cart.map(
    (item) => `${item.name}
    ADCS: ${item.addons.map((addon) => addon.name).join(", ")}
    (Qtd: ${item.quantity})`
  ).join(`
    `);

  const message = encodeURIComponent(`Pedido:
     ${cartItems}


    Endereço: ${addressInput.value}`);
  const phone = "+5588997482968";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = [];
  updateCartModal();
  addressInput.value = "";
});

addressInput.addEventListener("input", function (event) {
  if (event.target.value !== "") {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

// VERIFICAR A HORA E MANUPULAR O CARD HORARIO
function chekRestauranteOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18.3 && hora < 22.3; //true = restaurante esta aberto !!
}

const spanItem = document.getElementById("data-span");
const isOpen = chekRestauranteOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
