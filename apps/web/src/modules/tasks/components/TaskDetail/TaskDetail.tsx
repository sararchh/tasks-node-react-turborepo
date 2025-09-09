import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2, Clock, User, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Task, TaskPriority, TaskStatus } from '../../types/task.types';
import { useComments, useAddComment } from '../../hooks/useTasks';

interface TaskDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

interface CommentForm {
  content: string;
}

const priorityConfig = {
  [TaskPriority.LOW]: { variant: 'default' as const, label: 'Baixa' },
  [TaskPriority.MEDIUM]: { variant: 'primary' as const, label: 'Média' },
  [TaskPriority.HIGH]: { variant: 'warning' as const, label: 'Alta' },
  [TaskPriority.URGENT]: { variant: 'danger' as const, label: 'Urgente' },
};

const statusConfig = {
  [TaskStatus.TODO]: { variant: 'default' as const, label: 'A Fazer' },
  [TaskStatus.IN_PROGRESS]: { variant: 'primary' as const, label: 'Em Progresso' },
  [TaskStatus.REVIEW]: { variant: 'warning' as const, label: 'Em Revisão' },
  [TaskStatus.DONE]: { variant: 'success' as const, label: 'Concluído' },
};

export const TaskDetail: React.FC<TaskDetailProps> = ({
  open,
  onOpenChange,
  task,
  onEdit,
  onDelete,
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);

  const { data: commentsData, isLoading: commentsLoading } = useComments({
    taskId: task?.id || '',
    page: commentsPage,
    size: 10,
  });

  const addCommentMutation = useAddComment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentForm>();

  const handleAddComment = (data: CommentForm) => {
    if (!task) return;

    addCommentMutation.mutate(
      { taskId: task.id, data },
      {
        onSuccess: () => {
          reset();
          setShowCommentForm(false);
        },
      }
    );
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">{task.title}</DialogTitle>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(task)}
              >
                <Edit size={16} className="mr-1" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} className="mr-1" />
                Excluir
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Task Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusConfig[task.status].variant}>
                {statusConfig[task.status].label}
              </Badge>
              <Badge variant={priorityConfig[task.priority].variant}>
                {priorityConfig[task.priority].label}
              </Badge>
              {task.deadline && (
                <Badge variant="secondary">
                  Prazo: {format(new Date(task.deadline), 'dd/MM/yyyy', { locale: ptBR })}
                </Badge>
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>

            {/* Assignments */}
            {task.assignments.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Usuários Atribuídos</h3>
                <div className="flex flex-wrap gap-2">
                  {task.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      <User size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">{assignment.userName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {task.history.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Histórico</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {task.history.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-3 mb-3 last:mb-0">
                      <Clock size={16} className="text-gray-400 mt-0.5" />
                      <div className="flex-1 text-sm">
                        <p className="text-gray-900">{entry.description}</p>
                        <p className="text-gray-500 text-xs">
                          {entry.changedByName} • {format(new Date(entry.changedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                Comentários ({task.comments.length})
              </h3>
              <Button
                size="sm"
                onClick={() => setShowCommentForm(!showCommentForm)}
                disabled={addCommentMutation.isPending}
              >
                <MessageCircle size={16} className="mr-1" />
                Adicionar Comentário
              </Button>
            </div>

            {/* Comment Form */}
            {showCommentForm && (
              <form onSubmit={handleSubmit(handleAddComment)} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                  <Textarea
                    {...register('content', {
                      required: 'Comentário é obrigatório',
                      minLength: { value: 1, message: 'Comentário não pode estar vazio' }
                    })}
                    placeholder="Escreva seu comentário..."
                    rows={3}
                    className={errors.content ? 'border-red-500' : ''}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-600">{errors.content.message}</p>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      size="sm"
                      isLoading={addCommentMutation.isPending}
                      disabled={addCommentMutation.isPending}
                    >
                      Enviar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowCommentForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {commentsLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))
              ) : commentsData && commentsData.comments.length > 0 ? (
                commentsData.comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-500" />
                        <span className="font-medium text-gray-900">{comment.authorName}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhum comentário ainda.</p>
              )}

              {/* Load more comments */}
              {commentsData && commentsData.totalPages > commentsPage && (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setCommentsPage(prev => prev + 1)}
                    disabled={commentsLoading}
                  >
                    Carregar mais comentários
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
