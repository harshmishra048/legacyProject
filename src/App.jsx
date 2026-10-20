import { lazy, Suspense } from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';

import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';

import {
  ProtectedRoute,
  GuestRoute,
} from './routes/ProtectedRoute';

import { PageLoader } from './components/ui';

/* =========================================================
   AUTH
   ========================================================= */

const LoginPage = lazy(
  () => import('./pages/auth/LoginPage')
);

const SignupPage = lazy(
  () => import('./pages/auth/SignupPage')
);

const OnboardingPage = lazy(
  () => import('./pages/auth/OnboardingPage')
);

/* =========================================================
   DASHBOARDS
   ========================================================= */

const StudentDashboard = lazy(
  () => import('./pages/student/StudentDashboard')
);

const AlumniDashboard = lazy(
  () => import('./pages/alumni/AlumniDashboard')
);

const ProfessorDashboard = lazy(
  () => import('./pages/professor/ProfessorDashboard')
);

const AdminDashboard = lazy(
  () => import('./pages/admin/AdminDashboard')
);

/* =========================================================
   CONTRIBUTIONS
   ========================================================= */

const ContributionsPage = lazy(
  () =>
    import(
      './pages/contributions/ContributionsPage'
    )
);

const ContributionDetailPage = lazy(
  () =>
    import(
      './pages/contributions/ContributionDetailPage'
    )
);

const CreateContributionPage = lazy(
  () =>
    import(
      './pages/contributions/CreateContributionPage'
    )
);

/* =========================================================
   STUDENT / ALUMNI
   ========================================================= */

const AlumniDirectoryPage = lazy(
  () =>
    import(
      './pages/student/AlumniDirectoryPage'
    )
);

/* =========================================================
   COMMUNITY / COMMUNICATION
   ========================================================= */

const CommunityPage = lazy(
  () => import('./pages/community/CommunityPage')
);

const MessagesPage = lazy(
  () => import('./pages/messages/MessagesPage')
);

/* =========================================================
   OTHER MODULES
   ========================================================= */

const OpportunitiesPage = lazy(
  () =>
    import(
      './pages/opportunities/OpportunitiesPage'
    )
);

const MentorshipPage = lazy(
  () =>
    import(
      './pages/mentorship/MentorshipPage'
    )
);

const EventsPage = lazy(
  () => import('./pages/events/EventsPage')
);

const AchievementsPage = lazy(
  () =>
    import(
      './pages/profile/AchievementsPage'
    )
);

const EarningsPage = lazy(
  () => import('./pages/alumni/EarningsPage')
);

const ProfilePage = lazy(
  () => import('./pages/profile/ProfilePage')
);

/* =========================================================
   LANDING / 404
   ========================================================= */

const LandingPage = lazy(
  () => import('./pages/LandingPage')
);

const NotFoundPage = lazy(
  () => import('./pages/NotFoundPage')
);

/* =========================================================
   APP
   ========================================================= */

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* =================================================
            PUBLIC
            ================================================= */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* =================================================
            AUTH
            ================================================= */}

        <Route
          element={
            <GuestRoute>
              <AuthLayout />
            </GuestRoute>
          }
        >
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/signup"
            element={<SignupPage />}
          />
        </Route>

        {/* =================================================
            ONBOARDING
            ================================================= */}

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            AUTHENTICATED APP
            ================================================= */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          {/* ================= STUDENT ================= */}

          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="/student/discover"
            element={<ContributionsPage />}
          />

          <Route
            path="/student/alumni"
            element={<AlumniDirectoryPage />}
          />

          <Route
            path="/student/learning"
            element={<AchievementsPage />}
          />

          {/* ================= ALUMNI ================= */}

          <Route
            path="/alumni/dashboard"
            element={<AlumniDashboard />}
          />

          <Route
            path="/alumni/network"
            element={<AlumniDirectoryPage />}
          />

          <Route
            path="/alumni/sessions"
            element={<ContributionsPage />}
          />

          <Route
            path="/alumni/earnings"
            element={<EarningsPage />}
          />

          {/* ================= PROFESSOR ================= */}

          <Route
            path="/professor/dashboard"
            element={<ProfessorDashboard />}
          />

          <Route
            path="/professor/sessions"
            element={<ContributionsPage />}
          />

          <Route
            path="/professor/earnings"
            element={<EarningsPage />}
          />

          <Route
            path="/professor/students"
            element={<AlumniDirectoryPage />}
          />

          <Route
            path="/professor/announcements"
            element={<CommunityPage />}
          />

          <Route
            path="/professor/research"
            element={<ContributionsPage />}
          />

          {/* ================= ADMIN ================= */}

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/alumni"
            element={<AlumniDirectoryPage />}
          />

          <Route
            path="/admin/professors"
            element={<AlumniDirectoryPage />}
          />

          <Route
            path="/admin/students"
            element={<AlumniDirectoryPage />}
          />

          <Route
            path="/admin/contributions"
            element={<ContributionsPage />}
          />

          <Route
            path="/admin/sessions"
            element={<ContributionsPage />}
          />

          <Route
            path="/admin/announcements"
            element={<CommunityPage />}
          />

          <Route
            path="/admin/transactions"
            element={<EarningsPage />}
          />

          <Route
            path="/admin/reports"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/analytics"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/badges"
            element={<AchievementsPage />}
          />

          <Route
            path="/admin/settings"
            element={<ProfilePage />}
          />

          {/* ================= RECRUITER ================= */}

          <Route
            path="/recruiter/dashboard"
            element={<OpportunitiesPage />}
          />

          <Route
            path="/recruiter/discover"
            element={<AlumniDirectoryPage />}
          />

          {/* ================= SHARED ================= */}

          <Route
            path="/contributions"
            element={<ContributionsPage />}
          />

          <Route
            path="/contributions/create"
            element={<CreateContributionPage />}
          />

          <Route
            path="/contributions/:id"
            element={<ContributionDetailPage />}
          />

          <Route
            path="/community"
            element={<CommunityPage />}
          />

          <Route
            path="/messages"
            element={<MessagesPage />}
          />

          <Route
            path="/opportunities"
            element={<OpportunitiesPage />}
          />

          <Route
            path="/mentorship"
            element={<MentorshipPage />}
          />

          <Route
            path="/events"
            element={<EventsPage />}
          />

          <Route
            path="/achievements"
            element={<AchievementsPage />}
          />

          <Route
            path="/notifications"
            element={<AchievementsPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/settings"
            element={<ProfilePage />}
          />

        </Route>

        {/* =================================================
            404
            ================================================= */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>
    </Suspense>
  );
}