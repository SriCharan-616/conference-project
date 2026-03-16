import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleGuard } from "./components/RoleGuard";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Shared Pages
import ConferencesList from "./pages/shared/ConferencesList";
import ConferenceDetail from "./pages/shared/ConferenceDetail";
import RegisterConference from "./pages/shared/RegisterConference";

// Author Pages
import PaperList from "./pages/author/PaperList";
import PaperSubmit from "./pages/author/PaperSubmit";
import PaperDetail from "./pages/author/PaperDetail";
import AuthorDashboard from "./pages/author/Dashboard";

// Organiser Pages
import ConferenceForm from "./pages/organiser/ConferenceForm";
import OrganiserConferences from "./pages/organiser/ConferencesList";
import SessionForm from "./pages/organiser/SessionForm";
import RegistrationList from "./pages/organiser/RegistrationList";
import PaymentList from "./pages/organiser/PaymentList";
import OrganiserDashboard from "./pages/organiser/Dashboard";

// Attendee Pages
import MyRegistrations from "./pages/attendee/MyRegistrations";
import PaymentForm from "./pages/attendee/PaymentForm";
import AttendeeDashboard from "./pages/attendee/Dashboard";

// Admin Pages
import UserList from "./pages/admin/UserList";
import UserDetail from "./pages/admin/UserDetail";
import AdminDashboard from "./pages/admin/Dashboard";

// Other Pages
import Profile from "./pages/Profile";

// Error Pages
import NotFound from "./pages/error/NotFound";
import Unauthorized from "./pages/error/Unauthorized";

// Home redirect based on role
function Home() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return <Navigate to="/conferences" />;
  }

  try {
    const userData = JSON.parse(user);
    switch (userData.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" />;
      case "organiser":
        return <Navigate to="/organiser/dashboard" />;
      case "author":
        return <Navigate to="/author/dashboard" />;
      case "attendee":
        return <Navigate to="/attendee/dashboard" />;
      default:
        return <Navigate to="/conferences" />;
    }
  } catch (error) {
    return <Navigate to="/conferences" />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Home Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/conferences" element={<ConferencesList />} />
          <Route path="/conferences/:id" element={<ConferenceDetail />} />
          <Route
            path="/conferences/:id/register"
            element={
              <ProtectedRoute>
                <RegisterConference />
              </ProtectedRoute>
            }
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Author Routes */}
          <Route
            path="/author/dashboard"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["author"]}>
                  <AuthorDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/author/papers"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["author"]}>
                  <PaperList />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/author/papers/submit"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["author"]}>
                  <PaperSubmit />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/author/papers/:id"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["author", "organiser"]}>
                  <PaperDetail />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Organiser Routes */}
          <Route
            path="/organiser/dashboard"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["organiser"]}>
                  <OrganiserDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organiser/conferences"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["organiser"]}>
                  <OrganiserConferences />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organiser/conferences/new"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["organiser"]}>
                  <ConferenceForm />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organiser/conferences/:id/edit"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["organiser"]}>
                  <ConferenceForm />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organiser/conferences/:conferenceId/sessions/new"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["organiser"]}>
                  <SessionForm />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organiser/registrations"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["organiser"]}>
                  <RegistrationList />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organiser/payments"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["organiser"]}>
                  <PaymentList />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Attendee Routes */}
          <Route
            path="/attendee/dashboard"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["attendee"]}>
                  <AttendeeDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendee/registrations"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["attendee"]}>
                  <MyRegistrations />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendee/registrations/:registrationId/payment"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["attendee"]}>
                  <PaymentForm />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["admin"]}>
                  <UserList />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["admin"]}>
                  <UserDetail />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;