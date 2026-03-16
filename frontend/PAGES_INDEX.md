# Frontend Pages Directory Index

## Quick Reference Guide

### 📱 Auth Pages
- **Login** → `src/pages/auth/Login.jsx` → Route: `/login`
- **Register** → `src/pages/auth/Register.jsx` → Route: `/register`

### 🏢 Shared Pages (All Users)
- **Conferences List** → `src/pages/shared/ConferencesList.jsx` → Route: `/conferences`
- **Conference Detail** → `src/pages/shared/ConferenceDetail.jsx` → Route: `/conferences/:id`
- **Register Conference** → `src/pages/shared/RegisterConference.jsx` → Route: `/conferences/:id/register`

### 📝 Author Pages
- **Dashboard** → `src/pages/author/Dashboard.jsx` → Route: `/author/dashboard`
- **Papers List** → `src/pages/author/PaperList.jsx` → Route: `/author/papers`
- **Submit Paper** → `src/pages/author/PaperSubmit.jsx` → Route: `/author/papers/submit`
- **Paper Detail** → `src/pages/author/PaperDetail.jsx` → Route: `/author/papers/:id`

### 🎯 Organiser Pages
- **Dashboard** → `src/pages/organiser/Dashboard.jsx` → Route: `/organiser/dashboard`
- **Conferences List** → `src/pages/organiser/ConferencesList.jsx` → Route: `/organiser/conferences`
- **Conference Form** → `src/pages/organiser/ConferenceForm.jsx` → Routes: `/organiser/conferences/new`, `/organiser/conferences/:id/edit`
- **Session Form** → `src/pages/organiser/SessionForm.jsx` → Route: `/organiser/conferences/:conferenceId/sessions/new`
- **Registrations** → `src/pages/organiser/RegistrationList.jsx` → Route: `/organiser/registrations`
- **Payments** → `src/pages/organiser/PaymentList.jsx` → Route: `/organiser/payments`

### 👥 Attendee Pages
- **Dashboard** → `src/pages/attendee/Dashboard.jsx` → Route: `/attendee/dashboard`
- **My Registrations** → `src/pages/attendee/MyRegistrations.jsx` → Route: `/attendee/registrations`
- **Payment Form** → `src/pages/attendee/PaymentForm.jsx` → Route: `/attendee/registrations/:registrationId/payment`

### 🔐 Admin Pages
- **Dashboard** → `src/pages/admin/Dashboard.jsx` → Route: `/admin/dashboard`
- **User List** → `src/pages/admin/UserList.jsx` → Route: `/admin/users`
- **User Detail** → `src/pages/admin/UserDetail.jsx` → Route: `/admin/users/:id`

### 👤 Common Pages
- **Profile** → `src/pages/Profile.jsx` → Route: `/profile`

### ⚠️ Error Pages
- **Unauthorized (403)** → `src/pages/error/Unauthorized.jsx` → Route: `/unauthorized`
- **Not Found (404)** → `src/pages/error/NotFound.jsx` → Route: `*` (wildcard)

### 🧩 Core Components
- **Navbar** → `src/components/Navbar.jsx` (Updated with role-based nav)
- **App Router** → `src/App.jsx` (Updated with 50+ route definitions)

## User Flow Testing

### Admin Flow
1. Login → `/login` (role: admin)
2. Auto-redirect → `/admin/dashboard`
3. Manage Users → `/admin/users` → `/admin/users/:id`
4. View System Stats → `/admin/dashboard`

### Organiser Flow
1. Login → `/login` (role: organiser)
2. Auto-redirect → `/organiser/dashboard`
3. Create Conference → `/organiser/conferences/new`
4. Manage Registrations → `/organiser/registrations`
5. Track Payments → `/organiser/payments`

### Author Flow
1. Login → `/login` (role: author)
2. Auto-redirect → `/author/dashboard`
3. Browse Conferences → `/conferences`
4. Submit Paper → `/author/papers/submit`
5. View My Papers → `/author/papers` → `/author/papers/:id`

### Attendee Flow
1. Login → `/login` (role: attendee)
2. Auto-redirect → `/attendee/dashboard`
3. Browse Conferences → `/conferences` → `/conferences/:id`
4. Register → `/conferences/:id/register`
5. View Registrations → `/attendee/registrations`
6. Complete Payment → `/attendee/registrations/:id/payment`

## Route Protection

### Public Routes (No Auth Required)
- `/login` - Login page
- `/register` - Registration page
- `/conferences` - Browse all conferences
- `/conferences/:id` - View conference details

### Protected Routes (ProtectedRoute wrapper)
- All `/author/*` routes
- All `/organiser/*` routes
- All `/attendee/*` routes
- All `/admin/*` routes
- `/profile` - User profile

### Role-Guarded Routes (Additional RoleGuard wrapper)
- Admin routes: restricted to `role: "admin"`
- Organiser routes: restricted to `role: "organiser"`
- Author routes: restricted to `role: "author"`
- Attendee routes: restricted to `role: "attendee"`

## Testing Checklist

### Component Functionality
- [ ] All forms submit correctly
- [ ] Loading states display proper skeletons
- [ ] Error messages appear in modals/toasts
- [ ] Navigation links work between pages
- [ ] Forms validate input properly

### Role-Based Access
- [ ] Non-authenticated users can only see public pages
- [ ] Admin users see only admin pages
- [ ] Organiser users see only organiser pages
- [ ] Author users see only author pages
- [ ] Attendee users see only attendee pages
- [ ] Unauthorized access redirects to `/unauthorized`

### API Integration
- [ ] List pages fetch and display data
- [ ] Forms submit data to API
- [ ] Errors from API display as notifications
- [ ] Token refresh works on expired tokens
- [ ] Logout clears user data

### UI/UX
- [ ] All pages are responsive (mobile/tablet/desktop)
- [ ] Navigation is intuitive
- [ ] Empty states have helpful messaging
- [ ] Success/error notifications appear
- [ ] Loading indicators show during data fetching

## Remaining Items (Optional)

- Create unit tests for components
- Create E2E tests for user flows
- Optimize images and assets
- Add advanced filtering options
- Create analytics dashboard
- Add notification center
- Implement progressive web app (PWA)
- Set up CI/CD pipeline
