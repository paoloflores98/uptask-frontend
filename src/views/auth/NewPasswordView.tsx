import NewPasswordFormulario from "@/components/auth/NewPasswordForm";
import NewPasswordToken from "@/components/auth/NewPasswordToken";
import { ConfirmToken } from "@/types/index";
import { useState } from "react";

const NewPasswordView = () => {
  const [token, setToken] = useState<ConfirmToken['token']>('');
  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <>
      <h1 className="text-5xl font-black text-white">Restablecer contraseña</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingrese el código que recibiste {''}
        <span className=" text-fuchsia-500 font-bold">por correo</span>
      </p>

      {!isValidToken
        ? <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} />
        : <NewPasswordFormulario token={token} />
      }
    </>
  )
}

export default NewPasswordView;