import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegister } from "../../hooks/useRegister";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FiUserPlus } from "react-icons/fi";
import { useState, useCallback } from "react";
import PATHS from "@/routes/paths";
import { useAuth } from "../../hooks/useAuth";

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  username: z
    .string()
    .min(3, "Nome de usuário deve ter pelo menos 3 caracteres")
    .max(20, "Nome de usuário deve ter no máximo 20 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterView() {
  const { register: registerUser, isLoading } = useRegister();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = useCallback(
    async (data: RegisterForm) => {
      setLoading(true);
      try {
        const result = await registerUser(data);
        if (result) {
          setUser(result.user);
          toast.success("Cadastro realizado com sucesso! Bem-vindo!");
          void navigate(PATHS.dashboard.index);
        }

        void navigate(PATHS.dashboard.index);
      } catch {
        toast.error("Falha no cadastro. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [registerUser, navigate],
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-12 sm:px-6 lg:px-8 items-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-45">
          <FiUserPlus className="text-white text-2xl transform -rotate-45" />
        </div>
      </div>

      <Card className="bg-white shadow sm:rounded-lg sm:px-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md !p-4">
        <form
          className="gap-4 flex items-center flex-col [&>div]:w-[95%] [&>div]:flex [&>div]:flex-col [&>div]:gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Digite seu email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Digite seu usuário"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
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
            isLoading={isLoading || loading}
            loadingText="Registrando..."
            leftIcon="FiUserPlus"
          >
            Registrar
          </Button>
        </form>
        <div className="!mt-2 text-center flex items-center justify-center">
          <span className="text-sm text-gray-600 !mr-2">Já tem uma conta?</span>
          <Button
            type="button"
            variant="secondary"
            className="!h-4 !text-sm hover:underline font-semibold"
            onClick={() => navigate("/login")}
          >
            Entrar
          </Button>
        </div>
      </Card>
    </div>
  );
}
