// Configuration
const API_KEY = 'YOUR_GOOGLE_SHEETS_API_KEY_HERE';
const SHEET_ID = '1Tc9z5ObCNPpACI-Rj3vUhjJEhCwx9PPXPIckrPeuB2g';
const RANGE = 'Sheet1!A1:H100';
const STORAGE_CONFIG = {
    type: 'firebase', // or 's3', 'drive'
    bucket: 'your-storage-bucket'
};

// User roles
const ROLES = {
    GUEST: 'guest',
    USER: 'user',
    ADMIN: 'admin'
};

let currentUser = null;

async function checkAuth() {
    // Simulated auth check - replace with actual auth system
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = '/login.html';
        return false;
    }
    currentUser = JSON.parse(user);
    return currentUser.role === ROLES.ADMIN;
}

async function fetchSheetData() {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
        );
        const data = await response.json();
        return data.values;
    } catch (error) {
        document.getElementById('error').textContent = 'Error fetching data: ' + error.message;
        return null;
    }
}

function updateDashboardCards(data) {
    const stats = {
        users: new Set(data.map(row => row[1])).size,
        batches: new Set(data.map(row => row[2])).size,
        posts: data.filter(row => row[3] === 'post').length,
        uploads: data.filter(row => row[3] === 'upload').length
    };

    document.getElementById('userStats').innerHTML = `<h3>Total Users</h3><p>${stats.users}</p>`;
    document.getElementById('batchStats').innerHTML = `<h3>Active Batches</h3><p>${stats.batches}</p>`;
    document.getElementById('postStats').innerHTML = `<h3>Total Posts</h3><p>${stats.posts}</p>`;
    document.getElementById('uploadStats').innerHTML = `<h3>Total Uploads</h3><p>${stats.uploads}</p>`;
}

async function initDashboard() {
    const isAdmin = await checkAuth();
    if (!isAdmin) {
        document.getElementById('error').textContent = 'Admin access required';
        return;
    }
    
    const data = await fetchSheetData();
    if (data) {
        updateDashboardCards(data);
        renderActivityChart(data);
        document.getElementById('userEmail').textContent = currentUser.email;
    }
}

// --- User Authentication ---
// --- Accessibility: Focus management for login ---
function focusLogin() {
    const emailInput = document.getElementById('loginEmail');
    if (emailInput) emailInput.focus();
}

function showLoginForm(show) {
    document.getElementById('loginForm').style.display = show ? 'block' : 'none';
    document.querySelector('.dashboard-content').style.display = show ? 'none' : 'block';
    if (show) focusLogin();
}

async function loginUser(email, password) {
    // Replace with real auth (Firebase/Auth0/OAuth)
    if (email && password) {
        // Simulate admin if email contains 'admin'
        const role = email.includes('admin') ? ROLES.ADMIN : ROLES.USER;
        const user = { email, role, batch: null };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    }
    throw new Error('Invalid credentials');
}

function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// --- Batch Join ---
function populateBatchOptions() {
    // Example batch list; replace with dynamic fetch if needed
    const batches = ['Alpha', 'Beta', 'Gamma', 'Delta'];
    const select = document.getElementById('batchSelect');
    batches.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b;
        opt.textContent = b;
        select.appendChild(opt);
    });
}

function joinBatch() {
    const batch = document.getElementById('batchSelect').value;
    if (!batch) return;
    let user = getCurrentUser();
    user.batch = batch;
    localStorage.setItem('user', JSON.stringify(user));
    document.getElementById('batchJoinMsg').textContent = `Joined batch: ${batch}`;
    // Optionally: send to backend for admin approval
}

// --- Post Message ---
async function postMessage() {
    const content = document.getElementById('messageInput').value.trim();
    if (!content) return;
    const user = getCurrentUser();
    const now = new Date().toISOString();
    // Store message locally (simulate DB)
    let messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const msg = { username: user.email, batch: user.batch, content, datetime: now };
    messages.push(msg);
    localStorage.setItem('messages', JSON.stringify(messages));
    document.getElementById('msgPostStatus').textContent = 'Message posted!';
    document.getElementById('messageInput').value = '';

    // Append to Google Sheet (simulate)
    await appendToGoogleSheet([user.email, user.batch, content, now]);
}

// --- Security & Scalability Notes ---
// All sensitive user data should be encrypted at rest and in transit (handled by backend/cloud).
// File uploads should be stored in cloud storage with access via signed URLs (not public).
// Admin access is enforced via role-based checks (see updateRoleUI, checkAuth).
// For scalability, migrate localStorage to a real-time DB (e.g., Firebase/Firestore) and use serverless functions for backend logic.

// --- File Upload (simulate signed URL for download) ---
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return;
    const allowed = ['pdf', 'docx', 'png', 'jpg', 'zip'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext) || file.size > 20 * 1024 * 1024) {
        document.getElementById('fileUploadStatus').textContent = 'Invalid file type or size!';
        return;
    }
    // Simulate upload
    let uploads = JSON.parse(localStorage.getItem('uploads') || '[]');
    const user = getCurrentUser();
    const now = new Date().toISOString();
    // Simulate signed URL (in production, backend returns a signed URL)
    const signedUrl = `https://storage.example.com/${encodeURIComponent(file.name)}?token=securetoken`;
    uploads.push({ user: user.email, name: file.name, size: file.size, datetime: now, url: signedUrl });
    localStorage.setItem('uploads', JSON.stringify(uploads));
    document.getElementById('fileUploadStatus').textContent = 'File uploaded!';
    fileInput.value = '';

    // Optionally: upload to cloud storage and store link
}

// --- Google Sheet Integration ---
async function appendToGoogleSheet(row) {
    // Use Sheets API with OAuth 2.0 in production
    // Simulate: no-op or log
    // Example: POST to backend which appends to Google Sheet
    // await fetch('/api/append-sheet', { method: 'POST', body: JSON.stringify({ row }) });
}

// --- MISSING FUNCTION: renderActivityChart ---
// This function should render a batch-wise activity chart using the data.
// For now, we'll just stub it out. In a real app, use Chart.js or similar.
function renderActivityChart(data) {
    // Example: Count posts per batch
    const batchCounts = {};
    data.forEach(row => {
        const batch = row[2];
        if (!batchCounts[batch]) batchCounts[batch] = 0;
        if (row[3] === 'post') batchCounts[batch]++;
    });
    // Render a simple bar chart using Chart.js if available
    if (window.Chart && document.getElementById('activityChart')) {
        const ctx = document.getElementById('activityChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(batchCounts),
                datasets: [{
                    label: 'Posts per Batch',
                    data: Object.values(batchCounts),
                    backgroundColor: '#3498db'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    } else {
        // Fallback: show as text
        const chartDiv = document.getElementById('batchChart');
        if (chartDiv) {
            let html = '<ul>';
            for (const batch in batchCounts) {
                html += `<li>${batch}: ${batchCounts[batch]} posts</li>`;
            }
            html += '</ul>';
            chartDiv.innerHTML += html;
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    initUI();

    // Login
    document.getElementById('loginBtn').onclick = async () => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        try {
            await loginUser(email, password);
            window.location.reload();
        } catch (e) {
            document.getElementById('loginError').textContent = e.message;
        }
    };

    // Join Batch
    const joinBtn = document.getElementById('joinBatchBtn');
    if (joinBtn) joinBtn.onclick = joinBatch;

    // Post Message
    const postBtn = document.getElementById('postMsgBtn');
    if (postBtn) postBtn.onclick = postMessage;

    // File Upload
    const uploadBtn = document.getElementById('uploadFileBtn');
    if (uploadBtn) uploadBtn.onclick = uploadFile;

    // Export CSV
    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) exportBtn.onclick = exportAllDataAsCSV;
});

// Add logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '/login.html';
});
