import api from "@/lib/axios";
import { dashboardProjectSchema, editProjectSchema, Project, ProjectFormData, projectSchema } from "../types";
import { isAxiosError } from "axios";

export async function createProject(formData: ProjectFormData) {
  try {
    const { data } = await api.post('/projects', formData); // URL base + enlace
    return data; // Mensaje de la respuesta del controllador
  } catch (error) {
    // Verificar si el error es de Axios y si hay una respuesta del servidor con detalles de error
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjects() {
  
  try {
    const { data } = await api('/projects'); // URL base + enlace
    const response = dashboardProjectSchema.safeParse(data);

    if(response.success) {
      return response.data;
    }
  } catch (error) {
    // Verificar si el error es de Axios y si hay una respuesta del servidor con detalles de error
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectsById(id: Project['_id']) {
  try {
    const { data } = await api(`/projects/${id}`); // URL base + enlace
    const response = editProjectSchema.safeParse(data);
    if(response.success) {
      return response.data;
    }
  } catch (error) {
    // Verificar si el error es de Axios y si hay una respuesta del servidor con detalles de error
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getFullProject(id: Project['_id']) {
  try {
    const { data } = await api(`/projects/${id}`); // URL base + enlace
    const response = projectSchema.safeParse(data);
    if(response.success) {
      return response.data;
    }
  } catch (error) {
    // Verificar si el error es de Axios y si hay una respuesta del servidor con detalles de error
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

type ProjectAPIType = {
  formData: ProjectFormData
  projectId: Project['_id']
}

export async function updateProject({formData, projectId}: ProjectAPIType) {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}`, formData); // URL base + enlace
    return data;
  } catch (error) {
    // Verificar si el error es de Axios y si hay una respuesta del servidor con detalles de error
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteProject(id: Project['_id']) {
  try {
    const { data } = await api.delete<string>(`/projects/${id}`); // URL base + enlace
    return data;
  } catch (error) {
    // Verificar si el error es de Axios y si hay una respuesta del servidor con detalles de error
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}