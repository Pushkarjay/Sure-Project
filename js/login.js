document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        // Simulate login (replace with AuthService if available)
        if (email && password) {
            const role = email.includes('admin') ? 'admin' : 'user';
            const user = { email, role, batch: null };
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (err) {
        document.getElementById('loginError').textContent = err.message;
    }
};
