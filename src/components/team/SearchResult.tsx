import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamMember } from "@/types/index";
import { addUserToProject } from "@/api/TeamAPI";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

type SearchResultProps = {
  user: TeamMember
  reset: () => void
}

const SearchResult = ({user, reset}: SearchResultProps) => {
  // useParams: Hook que retorna un objeto de parámetros de la URL
  const params = useParams();
  const projectId = params.projectId!;
  const navigate = useNavigate();

  /* Tanstack Query */
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      toast.error(error.message);
      reset(); // Reiniciar el formulario
    },
    onSuccess: (data) => {
      toast.success(data);
      reset(); // Reiniciar el formulario
      navigate(location.pathname, {replace: true}); // Cerrar el modal
      queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]});
    }
  })

  const handleAddUserProject = () => {
    const data = {
      projectId,
      id: user._id
    }
    mutate(data);
  }

  return (
    <>
      <p className="mt-10 text-center font-bold">Resultado:</p>
      <div className="flex justify-between items-center">
        <p>{user.name}</p>
        <button
          className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
          onClick={handleAddUserProject}
        >Agregar al proyecto</button>
      </div>
    </>
  )
}

export default SearchResult;