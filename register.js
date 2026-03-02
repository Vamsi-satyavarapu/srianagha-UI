async function handleRegister(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!firstName || !lastName || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    const name = `${firstName} ${lastName}`.trim();

    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();                                                             

        if (response.ok) {
            // Save user info
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert('Registration Successful!');
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please ensure the backend server is running.');
    }
}
