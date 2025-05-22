# BlogKing

BlogKing is a platform for managing batches, posts, uploads, and users, with a role-based dashboard for both users and admins. It uses Google Sheets as a backend for analytics and supports file uploads, batch joining, and message posting.

## Features

- **User Authentication:** Login, signup, and logout with session management (localStorage-based demo).
- **Role-Based Access:** Guest, User, and Admin roles with different dashboard views and permissions.
- **Batch Management:** Users can join batches; admins can manage all batches.
- **Post Messages:** Users can post messages to their batch; admins can moderate all posts.
- **File Uploads:** Users can upload files (PDF, DOCX, PNG, JPG, ZIP, up to 20MB); admins can manage all uploads.
- **Google Sheets Integration:** Posts and analytics are synced to a Google Sheet via the Sheets API.
- **Admin Dashboard:** Analytics, batch-wise activity chart, recent messages, file logs, CSV export, and management tables for users, batches, posts, and uploads.
- **Search & Pagination:** Admin tables support search/filter and pagination.
- **Accessibility:** ARIA labels, focus management, and responsive design.

## Getting Started

### Prerequisites

- Modern web browser
- Internet connection
- (Optional) Google Cloud project with Sheets API enabled

### Setup

1. **Clone or Download the Repository**

2. **Google Sheets API**
   - Replace `YOUR_GOOGLE_SHEETS_API_KEY_HERE` in `js/dashboard.js` with your actual API key.
   - Set your Sheet ID in the same file.

3. **Run Locally**
   - Open `index.html` for the user dashboard.
   - Open `admin.html` for the admin dashboard.
   - Use `login.html` and `signup.html` for authentication.

4. **Demo Accounts**
   - Any email containing "admin" will be treated as an admin.
   - Other emails are regular users.

### File Structure

- `index.html` - User dashboard
- `admin.html` - Admin dashboard
- `dashboard.html` - Dashboard landing page
- `users.html`, `batches.html`, `posts.html`, `uploads.html` - Section pages
- `login.html`, `signup.html`, `logout.html` - Authentication pages
- `js/` - JavaScript files for dashboard logic and authentication
- `styles/` - CSS files for styling

### Customization

- **Batches:** Edit the batch list in `js/dashboard.js` (`populateBatchOptions`).
- **Google Sheets:** Adjust the range and columns as needed.
- **Authentication:** Replace the localStorage-based logic with your preferred auth provider (Firebase/Auth0/etc).

## Security Notes

- This demo uses localStorage for user/session data. For production, use a secure backend and authentication provider.
- File uploads are simulated; in production, use secure cloud storage with signed URLs.
- All sensitive operations should be handled server-side.

## License

MIT License

---

**BlogKing** &copy; 2024
