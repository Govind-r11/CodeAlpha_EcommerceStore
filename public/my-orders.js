const message = document.getElementById("message");
const ordersList = document.getElementById("ordersList");
const accountLink = document.getElementById("accountLink");

async function loadMyOrders() {
    message.textContent = "Loading your orders...";
    ordersList.replaceChildren();

    try {
        const response = await fetch("/api/customer/orders", {
            method: "GET",
            credentials: "same-origin"
        });

        const data = await response.json();

        if (response.status === 401) {
            message.replaceChildren();

            const text = document.createTextNode(
                "Please login to view your orders. "
            );

            const loginLink = document.createElement("a");
            loginLink.href = "/login.html";
            loginLink.textContent = "Login here";
            message.append(text, loginLink);
            return;
        }

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to load your orders."
            );
        }

        if (accountLink) {
            accountLink.href = "/login.html";
            accountLink.textContent = "My Account";
        }

        const orders = Array.isArray(data.orders)
            ? data.orders
            : [];

        if (orders.length === 0) {
            message.textContent =
                "You haven't placed any orders yet. Start shopping to see your orders here.";
            return;
        }

        message.textContent =
            `You have ${orders.length} order(s).`;

        orders.forEach((order) => {
            const card = document.createElement("article");
            card.className = "order-card";

            const header = document.createElement("div");
            header.className = "order-card-header";

            const details = document.createElement("div");

            const title = document.createElement("h2");
            title.textContent = `Order #${order._id}`;

            const date = document.createElement("p");
            date.className = "order-date";

            const parsedDate = new Date(order.orderDate);

            date.textContent = "Placed on: " +
                (
                    Number.isNaN(parsedDate.getTime())
                        ? "Date unavailable"
                        : parsedDate.toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        })
                );

            details.append(title, date);

            const badge = document.createElement("span");
            badge.className = "order-badge";
            badge.textContent = "Order Placed";

            header.append(details, badge);
            card.appendChild(header);

            const itemsContainer = document.createElement("div");
            itemsContainer.className = "order-items";

            if (Array.isArray(order.items)) {
                order.items.forEach((item) => {
                    const row = document.createElement("div");
                    row.className = "order-item";

                    const name = document.createElement("span");
                    name.className = "order-item-name";
                    name.textContent =
                        `${item.name} × ${item.quantity}`;

                    const price = document.createElement("span");
                    price.className = "order-item-price";
                    price.textContent =
                        "₹" + (
                            Number(item.price) *
                            Number(item.quantity)
                        ).toLocaleString("en-IN");

                    row.append(name, price);
                    itemsContainer.appendChild(row);
                });
            }
            card.appendChild(itemsContainer);

            const total = document.createElement("div");
            total.className = "order-total";

            const totalLabel = document.createElement("span");
            totalLabel.textContent = "Total Amount";

            const totalValue = document.createElement("span");
            totalValue.textContent =
                "₹" + Number(order.total).toLocaleString("en-IN");

            total.append(totalLabel, totalValue);
            card.appendChild(total);

            ordersList.appendChild(card);
        });
    } catch (error) {
        console.error("My Orders error:", error);

        message.textContent =
            "Unable to load orders. Please refresh and try again.";
    }
}
loadMyOrders();
