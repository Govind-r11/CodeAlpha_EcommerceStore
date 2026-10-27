const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/customer/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        console.log("Login response:", data);
        console.log("Session cookie:", document.cookie);
        if (!response.ok) {
            throw new Error(data.message || "Login failed.");
        }
        message.style.color = "green";
        message.textContent = "Login successful! Redirecting...";
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } catch (error) {
        message.style.color = "red";
        message.textContent =
            error.message || "Unable to connect to server.";
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});
