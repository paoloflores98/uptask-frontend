import { isAxiosError } from "axios";
import { UpdateCurrentPasswordForm, UserProfileForm } from "../types";
import api from "@/lib/axios";

export async function updateProfile(formdata: UserProfileForm) {
  try {
    const { data } = await api.put<string>('/auth/profile', formdata); // URL base + enlace
    return data;
  } catch (error) {
    // Verificar si el error es de Axios y si hay una respuesta del servidor con detalles de error
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function changePassword(formdata: UpdateCurrentPasswordForm) {
  try {
    const { data } = await api.post<string>('/auth/update-password', formdata); // URL base + enlace
    return data;
  } catch (error) {
    // Verificar si el error es de Axios y si hay una respuesta del servidor con detalles de error
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}