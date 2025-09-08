import { Dashboard } from './Dashboard';
import { AppPage } from '../../../shared/core/Page';
import { ProtectedRoute } from '../../../routes/ProtectedRoute';
import PATHS from '@/routes/paths';

export function DashboardPageViewElement() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

export const DashboardPageRoute = new AppPage({
  path: PATHS.dashboard.index,
  element: <DashboardPageViewElement />,
});
