import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: ''
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });
  
  const { mutate } = useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset(); // Reiniciar el formulario
    },
  })

  const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData);

  return (
    <>
      <h1 className="text-5xl font-black text-white">Restablecer contraseña</h1>
      <p className="text-2xl font-light text-white mt-5">
        ¿Olvidaste tu contraseña? Coloca tu correo {''}
        <span className=" text-fuchsia-500 font-bold"> y restablece tu contraseña</span>
      </p>
      <form
        className="space-y-8 p-10 mt-10 bg-white"
        onSubmit={handleSubmit(handleForgotPassword)}
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
            htmlFor="email"
          >Correo electrónico</label>
          <input
            className="w-full p-3  border-gray-300 border"
            id="email"
            type="email"
            placeholder="Correo de registro"
            {...register("email", {
              required: "El correo de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Correo electrónico no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <input
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
          type="submit"
          value='Enviar instrucciones'
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          className="text-center text-gray-300 font-normal"
          to='/auth/login'
        >¿Ya tienes cuenta? Iniciar sesión</Link>

        <Link
          className="text-center text-gray-300 font-normal"
          to='/auth/register'
        >¿No tienes una cuenta? Crear una</Link>
      </nav>
    </>
  )
}