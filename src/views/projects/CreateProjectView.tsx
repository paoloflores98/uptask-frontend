import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectAPI";

const CreateProjectView = () => {
  const navigate = useNavigate();

  const initialValues: ProjectFormData = {
    projectName: '',
    clientName: '',
    description: ''
  }
  
  const { register, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues});

  const { mutate } = useMutation({
    mutationFn: createProject, // No se coloca el arg
    onError: (error) => { // Si la respuesta de la petición es incorrecta
      toast.error(error.message);
    },
    onSuccess: (data) => { // Si la respuesta de la petición es correcta
      toast.success(data);
      navigate('/');      
    }
  });
  
  // La función handleForm se ejecuta después de pasar las validaciones del formulario
  
  /* Sin React Query */
  // const handleForm = async (formData: ProjectFormData) => {
  //   const data = await createProject(formData);
  //   toast.success(data);
  //   navigate('/');
  // }
 
  /* Con React Query */
  // mutate: Maneja implícitamente la asincronía
  const handleForm = (formData: ProjectFormData) => mutate(formData);
  
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Crear proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear tus proyectos</p>
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
            value="Crear proyecto"
          />
        </form>
      </div>
    </>
  )
}

export default CreateProjectView;