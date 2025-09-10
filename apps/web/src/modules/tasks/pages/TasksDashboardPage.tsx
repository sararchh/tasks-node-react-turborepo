import { TasksDashboard } from '../components/TasksDashboard';
import { AppPage } from '../../../shared/core/Page';
import PATHS from '@/routes/paths';


export function TasksDashboardPageViewElement() {
  return <TasksDashboard />;
}

export const TasksDashboardPageRoute = new AppPage({
  path: PATHS.dashboard.index,
  element: <TasksDashboardPageViewElement />,
});
