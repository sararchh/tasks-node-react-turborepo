import { DashboardView } from '../components/DashboardView';
import { AppPage } from '../../../shared/core/Page';
import { PAGE_PATH_DASHBOARD } from '../constants/AuthPathUrl';

export function DashboardPageViewElement() {
  return <DashboardView />;
}

export const DashboardPageRoute = new AppPage({
  path: PAGE_PATH_DASHBOARD,
  element: <DashboardPageViewElement />,
});
