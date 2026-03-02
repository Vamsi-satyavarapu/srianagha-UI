// DOM Elements
const stepEmail = document.getElementById('step-email');
const stepOtp = document.getElementById('step-otp');
const stepPassword = document.getElementById('step-password');
const displayEmailSpan = document.getElementById('display-email');
const resendBtn = document.querySelector('.btn-secondary-link');

let userEmail = '';
let otpTimer = null;

// Show a specific step
function showStep(stepElement) {
    document.querySelectorAll('.forgot-password-step').forEach(step => {
        step.classList.remove('active');
    });
    stepElement.classList.add('active');
}

// Validate email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Disable a button temporarily
function disableButton(btn, duration = 3000) {
    btn.disabled = true;
    setTimeout(() => btn.disabled = false, duration);
}

// STEP 1: Send OTP
async function handleEmailSubmit(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');

    userEmail = document.getElementById('email').value.trim();

    if (!isValidEmail(userEmail)) {
        alert("Please enter a valid email address");
        return;
    }

    disableButton(submitBtn);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
        });

        const data = await response.json();

        if (!response.ok) {
            alert("Server Error: " + data.message);
            return;
        }

        alert(data.message);

        if (data.message.includes("OTP sent")) {
            displayEmailSpan.textContent = userEmail;
            showStep(stepOtp);
            startOtpCountdown();
        }

    } catch (err) {
        console.error("FETCH ERROR:", err);
        alert("Connection problem. Backend not reachable.");
    }
}

// STEP 2: Verify OTP
async function handleOtpSubmit(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const otp = document.getElementById('otp').value.trim();

    if (!otp) {
        alert("Please enter the OTP");
        return;
    }

    disableButton(submitBtn);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, otp })
        });

        const data = await response.json();

        if (data.message === "OTP verified") {
            showStep(stepPassword);
        } else {
            alert("Invalid OTP. Please try again.");
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
    }
}

// STEP 3: Reset Password
async function handlePasswordSubmit(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!newPassword || !confirmPassword) {
        alert("Please fill in both password fields");
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    disableButton(submitBtn);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, newPassword })
        });

        const data = await response.json();
        alert(data.message);

        if (data.message === "Password reset successful") {
            window.location.href = "login.html";
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
    }
}

// Resend OTP handler
async function resendOtp() {
    if (!userEmail) return;

    disableButton(resendBtn, 30000); // Disable resend for 30s

    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
        });

        const data = await response.json();
        alert(data.message);
        startOtpCountdown();
    } catch (err) {
        console.error(err);
        alert("Could not resend OTP. Try again later.");
    }
}

// Optional: OTP countdown display
function startOtpCountdown() {
    let countdown = 30;
    resendBtn.textContent = `Resend OTP (${countdown}s)`;
    clearInterval(otpTimer);

    otpTimer = setInterval(() => {
        countdown--;
        resendBtn.textContent = `Resend OTP (${countdown}s)`;
        if (countdown <= 0) {
            clearInterval(otpTimer);
            resendBtn.textContent = "Resend OTP";
            resendBtn.disabled = false;
        }
    }, 1000);
}