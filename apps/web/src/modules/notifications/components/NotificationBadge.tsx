import { Bell } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

interface NotificationBadgeProps {
  count: number;
  onClick?: () => void;
}

export const NotificationBadge = ({ count, onClick }: NotificationBadgeProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative p-2"
      onClick={onClick}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <Badge
          variant="danger"
          size="sm"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-5"
        >
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </Button>
  );
};
