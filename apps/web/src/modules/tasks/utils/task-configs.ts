import { TaskPriority, TaskStatus } from '../types/task.types';
import { AlertCircle, CheckCircle, PlayCircle, FileText, Clock } from 'lucide-react';

export interface PriorityConfig {
  variant: 'secondary' | 'default' | 'warning' | 'danger';
  label: string;
  icon: any;
  color: string;
  badgeColor: string;
}

export interface StatusConfig {
  variant: 'secondary' | 'primary' | 'warning' | 'success';
  label: string;
  icon: any;
  color: string;
  columnColor: string;
  headerColor: string;
  columnTitle: string;
}

export const PRIORITY_CONFIG: Record<TaskPriority, PriorityConfig> = {
  [TaskPriority.LOW]: {
    variant: 'secondary' as const,
    label: 'Baixa',
    icon: AlertCircle,
    color: 'text-slate-600 bg-slate-50 border-slate-200',
    badgeColor: 'bg-green-100 text-green-800 border-green-200'
  },
  [TaskPriority.MEDIUM]: {
    variant: 'default' as const,
    label: 'Média',
    icon: Clock,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  [TaskPriority.HIGH]: {
    variant: 'warning' as const,
    label: 'Alta',
    icon: AlertCircle,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  [TaskPriority.URGENT]: {
    variant: 'danger' as const,
    label: 'Urgente',
    icon: AlertCircle,
    color: 'text-red-600 bg-red-50 border-red-200',
    badgeColor: 'bg-red-100 text-red-800 border-red-200'
  },
};

export const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  [TaskStatus.TODO]: {
    variant: 'secondary' as const,
    label: 'A Fazer',
    icon: FileText,
    color: 'text-slate-600 bg-slate-50 border-slate-200',
    columnColor: 'bg-gray-100 border-gray-300',
    headerColor: 'bg-gray-50',
    columnTitle: 'A Fazer'
  },
  [TaskStatus.IN_PROGRESS]: {
    variant: 'primary' as const,
    label: 'Em Progresso',
    icon: PlayCircle,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    columnColor: 'bg-blue-100 border-blue-300',
    headerColor: 'bg-blue-50',
    columnTitle: 'Em Andamento'
  },
  [TaskStatus.REVIEW]: {
    variant: 'warning' as const,
    label: 'Em Revisão',
    icon: Clock,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    columnColor: 'bg-yellow-100 border-yellow-300',
    headerColor: 'bg-yellow-50',
    columnTitle: 'Revisão'
  },
  [TaskStatus.DONE]: {
    variant: 'success' as const,
    label: 'Concluído',
    icon: CheckCircle,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    columnColor: 'bg-green-100 border-green-300',
    headerColor: 'bg-green-50',
    columnTitle: 'Concluído'
  },
};

export const getPriorityBadgeColor = (priority: TaskPriority): string => {
  return PRIORITY_CONFIG[priority].badgeColor;
};

export const getStatusColumnConfig = (status: TaskStatus) => {
  return {
    id: status,
    title: STATUS_CONFIG[status].columnTitle,
    color: STATUS_CONFIG[status].columnColor,
    headerColor: STATUS_CONFIG[status].headerColor,
    tasks: [] as any[],
  };
};

export const getAllStatusColumns = () => {
  return Object.values(TaskStatus).map(status => getStatusColumnConfig(status));
};
