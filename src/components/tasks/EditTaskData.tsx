import { Navigate, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/api/TaskAPI";
import EditTaskModal from "./EditTaskModal";

const EditTaskData = () => {
  // useParams: Hook que retorna un objeto de parámetros de la URL
  const params = useParams();
  const projectId = params.projectId!;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // API que retorna un objeto con la cantidad de parámetros de la URL
  const taskId = queryParams.get('editTask')!; // Retorna su valor si encuentra el parámetro. Caso contrario retorna null
  
  // enable: Parámetro que controla si la consulta se debe ejecutar o no
  const { data, isError } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({projectId, taskId}),
    enabled: !!taskId, // !!: Retorna un booleano si la variable tiene o no un valor
    retry: false // Intentos de consulta
  })

  if(isError) return <Navigate to={'/404'} />
  if(data) return (
    <EditTaskModal data={data} taskId={taskId} /> // Renderiza el componente
  )
}

export default EditTaskData;