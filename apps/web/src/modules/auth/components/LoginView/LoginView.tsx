import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogin } from "../../hooks/useLogin";
import { PAGE_PATH_DASHBOARD } from "../../constants/AuthPathUrl";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FiSettings } from "react-icons/fi";
import { useState } from "react";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginView() {
  const { login, isLoading } = useLogin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await login(data);
      toast.success("Login realizado com sucesso!");
      void navigate(PAGE_PATH_DASHBOARD);
    } catch {
      toast.error("Falha no login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-12 sm:px-6 lg:px-8 items-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-45">
          <FiSettings className="text-white text-2xl transform -rotate-45" />
        </div>
      </div>

      <Card className="bg-white shadow sm:rounded-lg sm:px-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md !p-4">
        <form
          className="gap-4 flex items-center flex-col [&>div]:w-[95%] [&>div]:flex [&>div]:flex-col [&>div]:gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Label htmlFor="usernameOrEmail">Usuário</Label>
            <Input
              id="usernameOrEmail"
              type="text"
              autoComplete="username"
              placeholder="Digite seu usuário"
              {...register("usernameOrEmail")}
            />
            {errors.usernameOrEmail && (
              <p className="text-red-500 text-xs mt-1">
                {errors.usernameOrEmail.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading || loading}
            className="w-full font-semibold"
            size="lg"
          >
            {isLoading || loading ? (
              <>
                <span className="animate-spin mr-2">
                  <FiSettings />
                </span>
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <div className="!mt-2 text-center flex items-center justify-center">
          <span className="text-sm text-gray-600 !mr-2">
            Ainda não tem uma conta?
          </span>
          <Button
            type="button"
            variant="secondary"
            className="!h-4 !text-sm hover:underline font-semibold"
            onClick={() => navigate("/register")}
          >
            Cadastre-se
          </Button>
        </div>
      </Card>
    </div>
  );
}
