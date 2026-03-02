async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        // ✅ IMPORTANT FIX
        if (data.user) {

            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login Successful ✅");
            window.location.href = "index.html";

        } else {
            alert(data.message || "Login failed");
        }

    } catch (error) {
        console.error("Login Error:", error);
        alert("Server error. Please ensure backend is running.");
    }
}