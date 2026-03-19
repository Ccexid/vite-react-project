import { lazy, Suspense } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));

const PageLoader = () => {
  return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
};

const routes: RouteObject[] = [
  {
    path: '/',
    index: true,
    element: (
      <Suspense fallback={<PageLoader />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<PageLoader />}>
        <About />
      </Suspense>
    ),
  },
];

export const router = createBrowserRouter(routes);
