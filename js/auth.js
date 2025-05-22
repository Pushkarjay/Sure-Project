const AUTH_CONFIG = {
    apiEndpoint: '/api/auth',
    storageKey: 'user_session'
};

class AuthService {
    static async login(email, password) {
        // Implement actual login logic
        const mockUser = {
            id: '123',
            email: email,
            role: 'admin',
            avatar: 'images/default-avatar.png'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        return mockUser;
    }

    static async logout() {
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }

    static getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static isAdmin(user) {
        return user && user.role === 'admin';
    }
}

export default AuthService;
