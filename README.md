# Conference Management System (CMS)

A full-stack Conference Management System built with React (Vite), Django REST Framework, PostgreSQL (Supabase), and Supabase Storage.

## Project Overview

This system manages conferences, paper submissions, registrations, and payments with role-based access control for admins, organisers, authors, and attendees.

### Tech Stack

#### Backend
- **Framework**: Django 4.2
- **API**: Django REST Framework (DRF)
- **Authentication**: SimpleJWT (JSON Web Tokens)
- **Database**: PostgreSQL (Supabase)
- **File Storage**: Supabase Storage
- **Email**: Django Email Backend (configurable)
- **CORS**: django-cors-headers

#### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Style**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Form Validation**: React Hook Form + Zod
- **HTTP Client**: Axios with JWT interceptors
- **Notifications**: react-hot-toast

## Project Structure

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── cms_backend/          # Django project settings
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
└── api/                  # Main API app
    ├── models.py         # User, Conference, Session, Paper, Registration, Payment
    ├── serializers.py    # DRF serializers with validation
    ├── views.py          # ViewSets with CRUD operations
    ├── urls.py           # API endpoints
    ├── permissions.py    # Custom permission classes
    ├── utils.py          # Supabase & email utilities
    ├── admin.py          # Django admin configuration
    └── migrations/       # Database migrations

frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
    ├── main.jsx           # Entry point
    ├── App.jsx            # Root component
    ├── index.css          # Global styles
    ├── api/               # API integrations
    │   ├── axiosClient.js # Axios with JWT interceptors
    │   ├── auth.js        # Authentication endpoints
    │   ├── conference.js  # Conference endpoints
    │   ├── papers.js      # Paper endpoints
    │   └── registration.js # Registration endpoints
    ├── context/           # React Context
    │   └── AuthContext.jsx
    ├── hooks/             # Custom hooks
    │   ├── useAuth.js
    │   └── useAPI.js
    ├── components/        # Reusable components
    │   ├── Navbar.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── RoleGuard.jsx
    │   ├── Modal.jsx
    │   ├── Badge.jsx
    │   └── FileUpload.jsx
    ├── pages/             # Page components
    │   ├── auth/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── admin/
    │   ├── organiser/
    │   ├── author/
    │   ├── attendee/
    │   └── shared/
    └── routes/            # Route configuration
        └── AppRouter.jsx
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (via Supabase)
- Supabase account

### Backend Setup

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in:
   - `DJANGO_SECRET_KEY` - Generate a strong secret key
   - `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Supabase credentials
   - `SUPABASE_URL`, `SUPABASE_KEY` - Supabase API credentials
   - Email settings (optional)

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a superuser (admin)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect static files**
   ```bash
   python manage.py collectstatic --noinput
   ```

8. **Run the development server**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at `http://localhost:8000`
   Admin panel at `http://localhost:8000/admin`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment configuration**
   Create `.env.local`:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/token/refresh/` - Refresh access token

### Users
- `GET /api/users/` - List all users (admin only)
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user (own or admin)
- `DELETE /api/users/{id}/` - Delete user (admin only)
- `GET/PUT /api/users/me/` - Get/update own profile

### Conferences
- `GET /api/conferences/` - List conferences
- `POST /api/conferences/` - Create conference (organiser only)
- `GET /api/conferences/{id}/` - Get conference details
- `PUT /api/conferences/{id}/` - Update conference (organiser only)
- `DELETE /api/conferences/{id}/` - Delete conference (organiser only)
- `GET /api/conferences/{id}/sessions/` - List conference sessions
- `GET /api/conferences/{id}/registrations/` - List registrations (organiser only)

### Sessions
- `GET /api/sessions/` - List sessions
- `POST /api/sessions/` - Create session (organiser only)
- `GET /api/sessions/{id}/` - Get session details
- `PUT /api/sessions/{id}/` - Update session (organiser only)
- `DELETE /api/sessions/{id}/` - Delete session (organiser only)

### Papers
- `GET /api/papers/` - List papers
- `POST /api/papers/` - Submit paper (multipart/form-data, author only)
- `GET /api/papers/{id}/` - Get paper details
- `GET /api/papers/mine/` - Get own papers
- `PATCH /api/papers/{id}/update_status/` - Update paper status (organiser only)

### Registrations
- `GET /api/registrations/` - List registrations
- `POST /api/registrations/` - Register for conference
- `GET /api/registrations/{id}/` - Get registration details
- `GET /api/registrations/mine/` - Get own registrations

### Payments
- `GET /api/payments/` - List payments
- `POST /api/payments/` - Create payment record
- `GET /api/payments/{id}/` - Get payment details

## User Roles & Permissions

### Admin
- Manage all users
- View all conferences, papers, registrations, payments
- Update any paper status
- Deactivate user accounts

### Organiser
- Create and manage own conferences
- Add sessions to conferences
- View registrations for own conferences
- Update paper status for own conferences
- View payment records

### Author
- Submit papers to conferences
- View own papers and their status
- Register for conferences as attendee
- Make payments

### Attendee
- View all conferences
- Register for conferences
- Make payments
- View own registrations

## Authentication Flow

1. **Registration**: User selects role during signup
2. **Login**: Returns JWT access + refresh tokens
3. **Auto-refresh**: Axios interceptor automatically refreshes token on 401
4. **Storage**: Tokens stored in localStorage; user data in AuthContext

## Email Notifications

The system sends automated emails for:
- Registration confirmation
- Paper submission confirmation
- Paper accepted/rejected status
- Payment confirmation

Configure email in `.env`:
```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

For development, use console backend:
```
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

## Supabase Configuration

### PostgreSQL Database Setup
1. Create Supabase project
2. Get connection credentials from Settings → Database
3. Update `.env` with `DB_*` variables

### Storage Setup
1. Create storage bucket named `papers`
2. Set bucket to public
3. Get API URL and key from Settings → API
4. Update `.env` with `SUPABASE_URL` and `SUPABASE_KEY`

## Development Tips

### Backend
- Use Django admin at `/admin` to manage data
- API documentation available at `/api/` (browsable API)
- Run tests: `python manage.py test`
- Check migrations: `python manage.py showmigrations`

### Frontend
- Hot reload enabled in Vite dev server
- Use React DevTools browser extension for debugging
- TanStack Query DevTools can be added for debugging queries
- Tailwind CSS IntelliSense extension recommended in VS Code

## Deployment

### Backend (Django)
```bash
# Set DEBUG=False in production
# Configure ALLOWED_HOSTS
# Use environment-specific settings
# Set up proper database backups
# Configure Supabase Storage security rules

python manage.py collectstatic
gunicorn cms_backend.wsgi:application
```

### Frontend (React)
```bash
# Build production bundle
npm run build

# Deploy to Vercel, Netlify, or your server
# Update VITE_API_URL to production backend URL
```

## Troubleshooting

### jwt_required error on refresh endpoint
- Ensure SimpleJWT is properly installed
- Check `SIMPLE_JWT` settings in `settings.py`
- Verify token expiration settings

### CORS errors
- Check `CORS_ALLOWED_ORIGINS` in `settings.py`
- Ensure frontend URL is whitelisted
- Verify `CORS_ALLOW_CREDENTIALS=True` for cookie-based auth

### Supabase connection errors
- Verify database credentials
- Check firewall settings in Supabase dashboard
- Ensure psycopg2-binary is installed: `pip install psycopg2-binary`

### File upload issues
- Verify Supabase Storage bucket is public
- Check file size limit (max 10MB)
- Ensure PDF files only
- Verify Supabase credentials

## Contributing

1. Follow existing code style
2. Create feature branches: `git checkout -b feature/feature-name`
3. Commit with clear messages
4. Submit pull requests with description

## License

MIT License - feel free to use this project as a template

## Support

For issues or questions:
- Check documentation in code comments
- Review API endpoint specifications
- Check environment configuration
- Review error messages in server logs
