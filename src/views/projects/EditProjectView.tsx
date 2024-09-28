import { Navigate, useParams } from "react-router-dom";
import { getProjectsById } from "@/api/ProjectAPI";
import { useQuery } from "@tanstack/react-query";
import EditProjectForm from "@/components/projects/EditProjectForm";

const EditProjectView = () => {
  // useParams: Hook que retorna un objeto de parámetros de la URL
  const params = useParams(); // {projectId: 66dfc42ba2d30ef82867d72a}

  // !: Indicar a TS que el valor no es null o undefined
  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['editProject', projectId], // Keys únicos para cada proyecto
    queryFn: () => getProjectsById(projectId), // Callback cuando la función tiene parámetros
    retry: false // Intentos de consulta
  });

  if(isLoading) return 'Cargando...';
  if(isError) return <Navigate to="/404" />
  if(data) return <EditProjectForm data={data} projectId={projectId} /> // Llenar la data en el formulario
}

export default EditProjectView;