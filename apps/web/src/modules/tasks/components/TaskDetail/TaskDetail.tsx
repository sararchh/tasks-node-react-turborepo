import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Edit,
  Trash2,
  Clock,
  User,
  MessageCircle,
  Calendar,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  FileText,
  Users,
  History,
  Plus,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task, TaskPriority, TaskStatus } from "../../types/task.types";
import { useGetComments, useAddComment } from "../../hooks/useTasks";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../../utils/task-configs";

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
    taskId: task?.id || "",
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
      },
    );
  };

  if (!task) return null;

  const getHistoryConfig = (action: string) => {
    switch (action) {
      case "CREATED":
        return {
          icon: <Plus className="w-4 h-4 text-green-600" />,
          bgColor: "from-green-100 to-green-200"
        };
      case "STATUS_CHANGED":
        return {
          icon: <RotateCcw className="w-4 h-4 text-blue-600" />,
          bgColor: "from-blue-100 to-blue-200"
        };
      case "PRIORITY_CHANGED":
        return {
          icon: <ArrowUp className="w-4 h-4 text-orange-600" />,
          bgColor: "from-orange-100 to-orange-200"
        };
      case "UPDATED":
        return {
          icon: <Edit className="w-4 h-4 text-purple-600" />,
          bgColor: "from-purple-100 to-purple-200"
        };
      case "ASSIGNED":
        return {
          icon: <User className="w-4 h-4 text-indigo-600" />,
          bgColor: "from-indigo-100 to-indigo-200"
        };
      case "UNASSIGNED":
        return {
          icon: <User className="w-4 h-4 text-gray-600" />,
          bgColor: "from-gray-100 to-gray-200"
        };
      case "COMMENT_ADDED":
        return {
          icon: <MessageCircle className="w-4 h-4 text-teal-600" />,
          bgColor: "from-teal-100 to-teal-200"
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-slate-600" />,
          bgColor: "from-slate-100 to-slate-200"
        };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 gap-0">
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="flex-shrink-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200 !p-4">
            <div className="flex items-start justify-between ">
              <div className="flex-1 min-w-0 gap-6">
                <DialogTitle className="text-2xl !font-bold text-slate-900 leading-tight break-words ">
                  {task.title}
                </DialogTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className={`${STATUS_CONFIG[task.status].color} border-0 font-medium px-3 py-1`}
                  >
                    {React.createElement(STATUS_CONFIG[task.status].icon, {
                      className: "w-3.5 h-3.5 mr-1.5",
                    })}
                    {STATUS_CONFIG[task.status].label}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`${PRIORITY_CONFIG[task.priority].color} border-0 font-medium px-3 py-1`}
                  >
                    {React.createElement(PRIORITY_CONFIG[task.priority].icon, {
                      className: "w-3.5 h-3.5 mr-1.5",
                    })}
                    {PRIORITY_CONFIG[task.priority].label}
                  </Badge>
                  {task.deadline && (
                    <Badge
                      variant="secondary"
                      className="bg-white/80 border-slate-200 text-slate-700 px-3 py-1"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {format(new Date(task.deadline), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(task)}
                  className="bg-white/80 border border-slate-200 hover:bg-white hover:border-slate-300 transition-colors"
                >
                  <Edit className="w-4 h-4 !mr-2" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                  className="bg-white/80 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4 !mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto !p-4 bg-slate-50/30">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="border-slate-200 shadow-sm !mb-4 !p-4">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg text-slate-900">
                    <FileText className="w-5 h-5 !mr-2 text-slate-600" />
                    Descrição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {task.description || "Nenhuma descrição fornecida."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {task.assignments.length > 0 && (
                <Card className="border-slate-200 shadow-sm !mb-4 !p-4">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg text-slate-900">
                      <Users className="w-5 h-5 !mr-2 text-slate-600" />
                      Usuários Atribuídos ({task.assignments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {task.assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center gap-3 !p-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-100/60 hover:border-blue-200 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {assignment.userName}
                            </p>
                            <p className="text-xs text-slate-500">
                              Atribuído em{" "}
                              {format(
                                new Date(assignment.assignedAt),
                                "dd/MM",
                                { locale: ptBR },
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-slate-200 shadow-sm !mb-4 !p-4">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg text-slate-900">
                    <MessageCircle className="w-5 h-5 !mr-2 text-slate-600" />
                    Atividades & Comentários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="comments" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="comments"
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Comentários ({task.comments.length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="history"
                        className="flex items-center gap-2"
                      >
                        <History className="w-4 h-4" />
                        Histórico ({task.history.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="comments" className="!mt-2 !space-y-2">
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => setShowCommentForm(!showCommentForm)}
                          disabled={addCommentLoading}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4 !mr-2" />
                          {showCommentForm ? "Cancelar" : "Comentar"}
                        </Button>
                      </div>

                      {showCommentForm && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 !mt-2 rounded-lg border border-blue-100 !p-4">
                          <form
                            onSubmit={handleSubmit(handleAddComment)}
                            className="space-y-4"
                          >
                            <Textarea
                              {...register("content", {
                                required: "Comentário é obrigatório",
                                minLength: {
                                  value: 1,
                                  message: "Comentário não pode estar vazio",
                                },
                              })}
                              placeholder="Escreva seu comentário..."
                              rows={4}
                              className={`resize-none border-slate-200  ${errors.content ? "border-red-300 focus:border-red-500" : ""}`}
                            />
                            {errors.content && (
                              <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.content.message}
                              </p>
                            )}
                            <div className="flex gap-3">
                              <Button
                                type="submit"
                                size="sm"
                                isLoading={addCommentLoading}
                                disabled={addCommentLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Enviar Comentário
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowCommentForm(false)}
                                className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className="!space-y-3 !max-h-60 overflow-y-auto">
                        {commentsLoading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white"
                            >
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
                            <div
                              key={comment.id}
                              className="border border-slate-200 rounded-lg !p-3 bg-white hover:bg-slate-50 transition-colors shadow-sm "
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className="font-semibold text-slate-900">
                                      {comment.authorName}
                                    </span>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                      <Calendar className="w-3 h-3" />
                                      {format(
                                        new Date(comment.createdAt),
                                        "dd/MM/yyyy HH:mm",
                                        { locale: ptBR },
                                      )}
                                    </div>
                                  </div>
                                  <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed m-0">
                                      {comment.content}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                            <h3 className="text-lg font-medium text-slate-900 mb-2">
                              Nenhum comentário ainda
                            </h3>
                            <p className="text-slate-500 text-sm">
                              Seja o primeiro a comentar nesta tarefa!
                            </p>
                          </div>
                        )}

                        {commentsData &&
                          commentsData.totalPages > commentsPage && (
                            <div className="text-center pt-4">
                              <Button
                                variant="ghost"
                                onClick={() =>
                                  setCommentsPage((prev) => prev + 1)
                                }
                                disabled={commentsLoading}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200"
                              >
                                Carregar mais comentários
                              </Button>
                            </div>
                          )}
                      </div>
                    </TabsContent>

                    <TabsContent value="history" className="!mt-4">
                      {task.history.length > 0 ? (
                        <div className="!space-y-3 max-h-60 overflow-y-auto pr-2 border border-slate-100 rounded-lg p-4 bg-slate-50/50">
                          {task.history
                            .slice()
                            .reverse()
                            .map((entry, index) => {
                              const historyConfig = getHistoryConfig(entry.action);
                              return (
                                <div
                                  key={entry.id}
                                  className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors shadow-sm"
                                >
                                  <div
                                    className={`w-8 h-8 bg-gradient-to-r ${historyConfig.bgColor} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}
                                  >
                                    {historyConfig.icon}
                                  </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 leading-relaxed">
                                    {entry.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs font-medium text-slate-700">
                                      {entry.changedByName}
                                    </span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="text-xs text-slate-500">
                                      {format(
                                        new Date(entry.createdAt),
                                        "dd/MM/yyyy HH:mm",
                                        { locale: ptBR },
                                      )}
                                    </span>
                                  </div>
                                </div>
                                {index === 0 && (
                                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    Recente
                                  </div>
                                )}
                              </div>
                            );
                            })}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                          <h3 className="text-lg font-medium text-slate-900 mb-2">
                            Nenhuma atividade ainda
                          </h3>
                          <p className="text-slate-500 text-sm">
                            O histórico de atividades aparecerá aqui conforme as
                            alterações forem feitas.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
