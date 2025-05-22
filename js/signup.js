document.getElementById('signupForm').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    if (email && password) {
        // Simulate user creation
        localStorage.setItem('user', JSON.stringify({ email, role: 'user', batch: null }));
        window.location.href = 'index.html';
    } else {
        document.getElementById('signupError').textContent = 'Please fill all fields.';
    }
};
