import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2, Clock, User, MessageCircle, Calendar, AlertCircle, CheckCircle, PlayCircle, FileText, Users, History } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, TaskPriority, TaskStatus } from '../../types/task.types';
import { useGetComments, useAddComment } from '../../hooks/useTasks';

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
  [TaskPriority.LOW]: {
    variant: 'secondary' as const,
    label: 'Baixa',
    icon: AlertCircle,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  [TaskPriority.MEDIUM]: {
    variant: 'default' as const,
    label: 'Média',
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  },
  [TaskPriority.HIGH]: {
    variant: 'warning' as const,
    label: 'Alta',
    icon: AlertCircle,
    color: 'text-orange-600 bg-orange-50 border-orange-200'
  },
  [TaskPriority.URGENT]: {
    variant: 'danger' as const,
    label: 'Urgente',
    icon: AlertCircle,
    color: 'text-red-600 bg-red-50 border-red-200'
  },
};

const statusConfig = {
  [TaskStatus.TODO]: {
    variant: 'secondary' as const,
    label: 'A Fazer',
    icon: FileText,
    color: 'text-gray-600 bg-gray-50 border-gray-200'
  },
  [TaskStatus.IN_PROGRESS]: {
    variant: 'primary' as const,
    label: 'Em Progresso',
    icon: PlayCircle,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  [TaskStatus.REVIEW]: {
    variant: 'warning' as const,
    label: 'Em Revisão',
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  },
  [TaskStatus.DONE]: {
    variant: 'success' as const,
    label: 'Concluído',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50 border-green-200'
  },
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

  const { data: commentsData, isLoading: commentsLoading } = useGetComments({
    taskId: task?.id || '',
    page: commentsPage,
    size: 10,
  });

  const { addComment, isLoading: addCommentLoading } = useAddComment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentForm>();

  const handleAddComment = (data: CommentForm) => {
    if (!task) return;

    addComment(
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
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0">
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-3 break-words">
                  {task.title}
                </DialogTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${statusConfig[task.status].color} border font-medium`}>
                    {React.createElement(statusConfig[task.status].icon, { className: "w-3 h-3 mr-1" })}
                    {statusConfig[task.status].label}
                  </Badge>
                  <Badge className={`${priorityConfig[task.priority].color} border font-medium`}>
                    {React.createElement(priorityConfig[task.priority].icon, { className: "w-3 h-3 mr-1" })}
                    {priorityConfig[task.priority].label}
                  </Badge>
                  {task.deadline && (
                    <Badge variant="secondary" className="bg-white border-gray-300">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(task.deadline), 'dd/MM/yyyy', { locale: ptBR })}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(task)}
                  className="bg-white hover:bg-gray-50"
                >
                  <Edit size={16} className="mr-2" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                  className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300"
                >
                  <Trash2 size={16} className="mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Task Description */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-gray-600" />
                  Descrição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {task.description || 'Nenhuma descrição fornecida.'}
                </p>
              </CardContent>
            </Card>

            {/* Assignments */}
            {task.assignments.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Users className="w-5 h-5 mr-2 text-gray-600" />
                    Usuários Atribuídos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {task.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-100"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{assignment.userName}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History */}
            {task.history.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <History className="w-5 h-5 mr-2 text-gray-600" />
                    Histórico de Atividades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {task.history.slice(0, 10).map((entry) => (
                      <div key={entry.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock size={14} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">{entry.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {entry.changedByName} • {format(new Date(entry.changedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <MessageCircle className="w-5 h-5 mr-2 text-gray-600" />
                    Comentários ({task.comments.length})
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    disabled={addCommentLoading}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  >
                    <MessageCircle size={16} className="mr-2" />
                    Adicionar Comentário
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Comment Form */}
                {showCommentForm && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                    <form onSubmit={handleSubmit(handleAddComment)} className="space-y-4">
                      <Textarea
                        {...register('content', {
                          required: 'Comentário é obrigatório',
                          minLength: { value: 1, message: 'Comentário não pode estar vazio' }
                        })}
                        placeholder="Escreva seu comentário..."
                        rows={3}
                        className={`resize-none ${errors.content ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      />
                      {errors.content && (
                        <p className="text-sm text-red-600 font-medium">{errors.content.message}</p>
                      )}
                      <div className="flex space-x-3">
                        <Button
                          type="submit"
                          size="sm"
                          isLoading={addCommentLoading}
                          disabled={addCommentLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Enviar Comentário
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowCommentForm(false)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {commentsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))
                  ) : commentsData && commentsData.comments.length > 0 ? (
                    commentsData.comments.map((comment) => (
                      <div key={comment.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                              <User size={14} className="text-white" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900">{comment.authorName}</span>
                              <p className="text-xs text-gray-500">
                                {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Nenhum comentário ainda.</p>
                      <p className="text-gray-400 text-sm mt-1">Seja o primeiro a comentar nesta tarefa!</p>
                    </div>
                  )}

                  {/* Load more comments */}
                  {commentsData && commentsData.totalPages > commentsPage && (
                    <div className="text-center pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setCommentsPage(prev => prev + 1)}
                        disabled={commentsLoading}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        Carregar mais comentários
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
