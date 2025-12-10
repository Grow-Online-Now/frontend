import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import './i18n'
import { Landing } from './pages/Landing.tsx'
import { TermsOfService } from './pages/TermsOfService.tsx'
import { PrivacyPolicy } from './pages/PrivacyPolicy.tsx'
import { CookiePolicy } from './pages/CookiePolicy.tsx'
import { AlternativePage } from './pages/AlternativePage.tsx'
import { Blog } from './pages/Blog.tsx'
import { BlogArticle } from './pages/BlogArticle.tsx'
import { Platforms } from './pages/Platforms.tsx'
import { PlatformPage } from './pages/PlatformPage.tsx'
import { FreeToolsHub } from './pages/FreeToolsHub.tsx'
import { LinkedInPreviewTool } from './pages/LinkedInPreviewTool.tsx'
import { BestTimeToPostTool } from './pages/BestTimeToPostTool.tsx'
import { SignUp } from './pages/SignUp.tsx'
import { SignIn } from './pages/SignIn.tsx'
import { NotFound } from './pages/NotFound.tsx'
import OAuthCallback from './pages/OAuthCallback.tsx'
import RootLayout from './layout/RootLayout.tsx'
import { LanguageLayout } from './layout/LanguageLayout.tsx'
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx'
import { PublicOnlyRoute } from './components/auth/PublicOnlyRoute.tsx'
import { DashboardPageLoader } from './components/common/DashboardPageLoader.tsx'

// Lazy load dashboard pages for performance
const DashboardLayout = lazy(() => import('./components/dashboard/layout/DashboardLayout.tsx'))
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview.tsx'))
const PostsPage = lazy(() => import('./pages/dashboard/PostsPage.tsx'))
const SchedulerPage = lazy(() => import('./pages/dashboard/SchedulerPage.tsx'))
const CreatePostPage = lazy(() => import('./pages/dashboard/CreatePostPage.tsx'))
const AccountsPage = lazy(() => import('./pages/dashboard/AccountsPage.tsx'))
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage.tsx'))

// Define routes that will be used with language prefix
const localizedRoutes = [
  // Public-only routes (redirect to dashboard if authenticated)
  {
    path: '',
    element: (
      <PublicOnlyRoute>
        <Landing />
      </PublicOnlyRoute>
    ),
  },
  {
    path: 'signup',
    element: (
      <PublicOnlyRoute>
        <SignUp />
      </PublicOnlyRoute>
    ),
  },
  {
    path: 'login',
    element: (
      <PublicOnlyRoute>
        <SignIn />
      </PublicOnlyRoute>
    ),
  },
  // Public routes (accessible to everyone)
  { path: 'blog', element: <Blog /> },
  { path: 'blog/:slug', element: <BlogArticle /> },
  { path: 'terms', element: <TermsOfService /> },
  { path: 'privacy', element: <PrivacyPolicy /> },
  { path: 'cookies', element: <CookiePolicy /> },
  { path: 'alternatives/:competitor', element: <AlternativePage /> },
  { path: 'platforms', element: <Platforms /> },
  { path: 'platforms/:platform', element: <PlatformPage /> },
  { path: 'free-tools', element: <FreeToolsHub /> },
  { path: 'free-tools/linkedin-post-preview-tool', element: <LinkedInPreviewTool /> },
  { path: 'free-tools/best-time-to-post-calculator', element: <BestTimeToPostTool /> },
  // Dashboard routes (protected)
  {
    path: 'dashboard',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<DashboardPageLoader />}>
          <DashboardLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<DashboardPageLoader />}>
            <DashboardOverview />
          </Suspense>
        ),
      },
      {
        path: 'posts',
        element: (
          <Suspense fallback={<DashboardPageLoader />}>
            <PostsPage />
          </Suspense>
        ),
      },
      {
        path: 'scheduler',
        element: (
          <Suspense fallback={<DashboardPageLoader />}>
            <SchedulerPage />
          </Suspense>
        ),
      },
      {
        path: 'posts/create',
        element: (
          <Suspense fallback={<DashboardPageLoader />}>
            <CreatePostPage />
          </Suspense>
        ),
      },
      {
        path: 'accounts',
        element: (
          <Suspense fallback={<DashboardPageLoader />}>
            <AccountsPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<DashboardPageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
]

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      // Redirect root to default language
      { path: '/', element: <Navigate to="/en" replace /> },
      // OAuth callback (no language prefix - called from backend)
      { path: '/oauth/callback', element: <OAuthCallback /> },
      // Language-prefixed routes
      {
        path: '/:lang',
        element: <LanguageLayout />,
        children: localizedRoutes,
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
