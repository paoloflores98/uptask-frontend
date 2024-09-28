import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ProjectForm from './ProjectForm';
import { Project, ProjectFormData } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '@/api/ProjectAPI';
import { toast } from 'react-toastify';

type EditProjectFormProps = {
  data: ProjectFormData
  projectId: Project['_id']
}

const EditProjectForm = ({data, projectId}: EditProjectFormProps) => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: {errors}} = useForm({defaultValues: {
    projectName: data.projectName,
    clientName: data.clientName,
    description: data.description
  }});

  /* Tanstack Query */
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['projects']}); // Elimina los datos en caché
      queryClient.invalidateQueries({queryKey: ['editProject', projectId]}); // Elimina los datos en caché

      toast.success(data);
      navigate('/')
    }
  });

  const handleForm = (formData: ProjectFormData) => {
    const data = {
      formData,
      projectId
    }

    mutate(data);
  }
  
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Editar proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para editar el proyecto</p>
        <nav className="my-5">
          <Link
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            to='/'
          >Volver a Proyectos</Link>
        </nav>

        <form className="mt-10 bg-white shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <ProjectForm // Renderiza el componente
            register={register}
            errors={errors}
          />

          <input
            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase footer-block font-bold cursor-pointer transition-colors"
            type="submit"
            value="Guardar cambios"
          />
        </form>
      </div>
    </>
  )
}

export default EditProjectForm;