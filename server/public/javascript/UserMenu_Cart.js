document.addEventListener("DOMContentLoaded", function () {
    const cart = {
        items: [],
        subtotal: 0,
        tax: 0,
    };



    const deliveryFee = 3; // Fixed delivery fee

    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    const cartWrapper = document.querySelector(".cart-wrapper");
    const closeCartButton = document.getElementById("close-cart");
    const checkoutButton = document.querySelector(".checkout");
    const orderItemsContainer = document.querySelector(".order-items-container");
    const subtotalElement = document.querySelector(".subtotal");
    const taxElement = document.querySelector(".tax");
    const grandTotalElement = document.getElementById("grand-total");

    function updateLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");
            const price = parseFloat(button.getAttribute("data-price"));
            const img = button.getAttribute("data-img");

            // Calculate the tax for this item
            const tax = price * 0.10; // 10% tax
            cart.items.push({ name, price, tax, img });
            cart.subtotal += price;
            cart.tax += tax;

            updateLocalStorage();
            // Update the cart display
            updateCartDisplay();
        });
    });

    closeCartButton.addEventListener("click", () => {
        cartWrapper.style.display = "none";
    });

    // checkoutButton.addEventListener("click", () => {
    //     // Handle the checkout logic here, e.g., processing the order
    //     alert("Order processed. Thank you!");
    // });

    function updateCartDisplay() {
        orderItemsContainer.innerHTML = "";

        cart.items.forEach((item) => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item", "added-food");

            const itemImage = document.createElement("img");
            itemImage.src = item.img;
            itemImage.classList.add("cart-item-image", "added-food");

            const itemName = document.createElement("span");
            itemName.textContent = item.name;
            itemName.classList.add("item-name", "added-food");

            const itemPrice = document.createElement("span");
            itemPrice.textContent = `$${item.price.toFixed(2)}`;
            itemPrice.classList.add("item-price", "added-food");

            const closeButton = document.createElement("button");
            closeButton.textContent = "Remove";
            closeButton.classList.add("close-food-button");
            closeButton.addEventListener("click", () => {
                removeItemFromCart(item);
            });

            itemElement.appendChild(itemImage);
            itemElement.appendChild(itemName);
            itemElement.appendChild(itemPrice);
            itemElement.appendChild(closeButton);
            orderItemsContainer.appendChild(itemElement);
        });

        subtotalElement.textContent = `$${cart.subtotal.toFixed(2)}`;
        taxElement.textContent = `$${cart.tax.toFixed(2)}`;
        const total = cart.subtotal + cart.tax + deliveryFee;
        grandTotalElement.textContent = `$${total.toFixed(2)}`;

        cartWrapper.style.display = "block";
    }

    function removeItemFromCart(item) {
        const itemIndex = cart.items.indexOf(item);
        if (itemIndex !== -1) {
            cart.subtotal -= item.price;
            cart.tax -= item.tax;
            cart.items.splice(itemIndex, 1);
            updateLocalStorage();
            updateCartDisplay();
        }
    }
});


