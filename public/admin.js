const loginPanel = document.getElementById("loginPanel");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const ordersContainer = document.getElementById("orders");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "Logging in...";

    try {
        const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({
                username: document.getElementById("username").value,
                password: document.getElementById("password").value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed.");
        }
        loginForm.reset();
        loginPanel.classList.add("hidden");
        dashboard.classList.remove("hidden");
        message.textContent = "Login successful!";
        await loadOrders();
    } catch (error) {
        message.textContent = error.message;
    }
});

async function loadOrders() {
    message.textContent = "Loading orders...";
    ordersContainer.replaceChildren();
    try {
        const response = await fetch("/api/admin/orders", {
            credentials: "same-origin"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not load orders.");
        }

        if (!Array.isArray(data.orders)) {
            throw new Error(
                data.message || "Orders data format is incorrect. Check the admin API."
            );
        }

        if (data.orders.length === 0) {
            message.textContent = "No orders found.";
            return;
        }

        for (const order of data.orders) {
            const card = document.createElement("article");
            card.className = "order";

            const heading = document.createElement("h3");
            heading.textContent = "Order: " + order._id;
            card.appendChild(heading);

            const details = [
                "Customer: " + order.customerName,
                "Email: " + order.customerEmail,
                "Address: " + order.customerAddress,
                "Total: ₹" + order.total,
                "Date: " + (
                    order.orderDate
                        ? new Date(order.orderDate).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata"
                        })
                        : "Not available"
                )
            ];

            for (const detail of details) {
                const paragraph = document.createElement("p");
                paragraph.textContent = detail;
                card.appendChild(paragraph);
            }

            const itemsHeading = document.createElement("strong");
            itemsHeading.textContent = "Items:";
            card.appendChild(itemsHeading);

            const itemList = document.createElement("ul");

            for (const item of order.items) {
                const listItem = document.createElement("li");
                listItem.textContent =
                    `${item.name} — ₹${item.price} × ${item.quantity}`;
                itemList.appendChild(listItem);
            }
            card.appendChild(itemList);
            ordersContainer.appendChild(card);
        }
        message.textContent = "Orders loaded successfully.";
    } catch (error) {
        message.textContent = error.message;
    }
}

document.getElementById("refreshButton").addEventListener("click", loadOrders);
document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
        const response = await fetch("/api/admin/logout", {
            method: "POST",
            credentials: "same-origin"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Logout failed.");
        }
        dashboard.classList.add("hidden");
        loginPanel.classList.remove("hidden");
        ordersContainer.replaceChildren();
        message.textContent = "Logged out successfully.";
    } catch (error) {
        message.textContent = error.message;
    }
});