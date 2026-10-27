const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");
const registerButton = document.getElementById("registerButton");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    message.textContent = "";
    registerButton.disabled = true;
    registerButton.textContent = "Creating account...";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/customer/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed.");
        }

        message.style.color = "green";
        message.textContent = "Account created successfully!";

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    } catch (error) {
        message.style.color = "red";
        message.textContent =
            error.message || "Unable to connect to server.";
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = "Create Account";
    }
});
