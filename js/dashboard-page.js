// --- User Management (admin-only) ---
// This file should only be loaded by admin.html
function renderUserTable() {
    const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const tbody = document.getElementById('userTable').querySelector('tbody');
    tbody.innerHTML = '';
    users.forEach((user, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.email}</td>
            <td>
                <select data-idx="${idx}" class="roleSelect">
                    <option value="user"${user.role === 'user' ? ' selected' : ''}>User</option>
                    <option value="admin"${user.role === 'admin' ? ' selected' : ''}>Admin</option>
                </select>
            </td>
            <td>${user.batch || ''}</td>
            <td>
                <button data-idx="${idx}" class="deleteUserBtn">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    // Role change
    tbody.querySelectorAll('.roleSelect').forEach(sel => {
        sel.onchange = function() {
            users[this.dataset.idx].role = this.value;
            localStorage.setItem('allUsers', JSON.stringify(users));
            renderUserTable();
        };
    });
    // Delete user
    tbody.querySelectorAll('.deleteUserBtn').forEach(btn => {
        btn.onclick = function() {
            users.splice(this.dataset.idx, 1);
            localStorage.setItem('allUsers', JSON.stringify(users));
            renderUserTable();
        };
    });
}

// --- Batch Management (admin-only) ---
function renderBatchTable() {
    const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const batches = {};
    users.forEach(u => {
        if (u.batch) {
            if (!batches[u.batch]) batches[u.batch] = [];
            batches[u.batch].push(u.email);
        }
    });
    const tbody = document.getElementById('batchTable').querySelector('tbody');
    tbody.innerHTML = '';
    Object.keys(batches).forEach(batch => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${batch}</td>
            <td>${batches[batch].join(', ')}</td>
            <td>
                <button data-batch="${batch}" class="deleteBatchBtn">Delete Batch</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    // Delete batch
    tbody.querySelectorAll('.deleteBatchBtn').forEach(btn => {
        btn.onclick = function() {
            const batch = this.dataset.batch;
            users.forEach(u => { if (u.batch === batch) u.batch = null; });
            localStorage.setItem('allUsers', JSON.stringify(users));
            renderBatchTable();
            renderUserTable();
        };
    });
}

// --- Post Moderation (admin-only) ---
function renderPostTable() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const tbody = document.getElementById('postTable').querySelector('tbody');
    tbody.innerHTML = '';
    messages.forEach((msg, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${msg.username}</td>
            <td>${msg.batch || ''}</td>
            <td>${msg.content}</td>
            <td>${msg.datetime}</td>
            <td>
                <button data-idx="${idx}" class="deletePostBtn">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    // Delete post
    tbody.querySelectorAll('.deletePostBtn').forEach(btn => {
        btn.onclick = function() {
            messages.splice(this.dataset.idx, 1);
            localStorage.setItem('messages', JSON.stringify(messages));
            renderPostTable();
        };
    });
}

// --- Upload Management (admin-only) ---
function renderUploadTable() {
    const uploads = JSON.parse(localStorage.getItem('uploads') || '[]');
    const tbody = document.getElementById('uploadTable').querySelector('tbody');
    tbody.innerHTML = '';
    uploads.forEach((up, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${up.user}</td>
            <td>${up.name}</td>
            <td>${(up.size/1024).toFixed(1)} KB</td>
            <td>${up.datetime}</td>
            <td>
                <a href="${up.url || '#'}" target="_blank" rel="noopener">Download</a>
                <button data-idx="${idx}" class="deleteUploadBtn">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    // Delete upload
    tbody.querySelectorAll('.deleteUploadBtn').forEach(btn => {
        btn.onclick = function() {
            uploads.splice(this.dataset.idx, 1);
            localStorage.setItem('uploads', JSON.stringify(uploads));
            renderUploadTable();
        };
    });
}

// --- Sync users from signup/login for demo ---
function syncAllUsers() {
    // Collect all users from current session and store in allUsers
    let allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const current = JSON.parse(localStorage.getItem('user') || 'null');
    if (current && !allUsers.some(u => u.email === current.email)) {
        allUsers.push(current);
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
}

// --- Admin-only UI init ---
function initAdminManagement() {
    syncAllUsers();
    renderUserTable();
    renderBatchTable();
    renderPostTable();
    renderUploadTable();
}

// --- On DOMContentLoaded, if admin, show management tables ---
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.role === 'admin') {
        initAdminManagement();
    }
});
