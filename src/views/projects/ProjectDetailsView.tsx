import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getFullProject } from "@/api/ProjectAPI";
import { useQuery } from "@tanstack/react-query";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetail from "@/components/tasks/TaskModalDetail";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import { useMemo } from "react";

const ProjectDetailsView = () => {
  // useParams: Hook que retorna un objeto de parámetros de la URL
  const params = useParams();
  const projectId = params.projectId!; // !: Indicar a TS que el valor no es null o undefined
  const navigate = useNavigate();

  const { data: user, isLoading: authLoading } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', projectId], // Keys únicos para cada proyecto
    queryFn: () => getFullProject(projectId), // Callback cuando la función tiene parámetros
    retry: false // Intentos de consulta
  });
  
  const canEdit = useMemo(() => data?.manager === user?._id, [data, user]);

  if(isLoading && authLoading) return 'Cargando...';
  if(isError) return <Navigate to="/404" />;
  if(data && user) return (
    <>
      <h1 className="text-5xl font-black">{data.projectName}</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>
      {isManager(data.manager, user._id) && (
        <nav className="my-5 flex gap-3">
          <button
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            type="button"
            onClick={() => navigate(location.pathname + '?newTask=true')} /* projects/projectId/?newTask=true */
          >Agregar tarea</button>
          <Link
            className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            to={'team'}
          >Colaboradores</Link>
        </nav>
      )}

      <TaskList tasks={data.tasks} canEdit={canEdit} /> {/* Renderiza el componente */}
      <AddTaskModal /> {/* Renderiza el componente */}
      <EditTaskData /> {/* Renderiza el componente */}
      <TaskModalDetail /> {/* Renderiza el componente */}
    </>
  )
}

export default ProjectDetailsView;