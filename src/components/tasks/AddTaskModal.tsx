import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TaskForm from './TaskForm';
import { TaskFormData } from '@/types/index';
import { createTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

export default function AddTaskModal() {
  const navigate = useNavigate();

  /* Validar si el modal existe */
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search) // API que retorna un objeto con la cantidad de parámetros de la URL
  const modalTask = queryParams.get('newTask'); // Retorna su valor si encuentra el parámetro. Caso contrario retorna null
  const show = modalTask ? true : false;

  /* Obtener el ID del proyecto */
  const params = useParams(); // useParams: Hook que retorna un objeto de parámetros de la URL
  const projectId = params.projectId!; // !: Indicar a TS que el valor no es null o undefined

  const initialValues: TaskFormData = {
    name: '',
    description: ''
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm({defaultValues: initialValues});

  /* Tanstack Query */
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['project', projectId]}) // Elimina los datos en caché
      toast.success(data);
      reset(); // Reinicia el formulario
      navigate(location.pathname, {replace: true});
    }
  });

  const handleCreateTask = (formData: TaskFormData) => {
    const data = {
      formData,
      projectId
    }

    mutate(data);
  }

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        {/* {replace: true}: Evita retrodecer a la URL con el modal activado */}
        <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true})}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                  <DialogTitle
                    as="h3"
                    className="font-black text-4xl  my-5"
                  >
                    Nueva Tarea
                  </DialogTitle>

                  <p className="text-xl font-bold">Llena el formulario y crea {''}
                    <span className="text-fuchsia-600">una tarea</span>
                  </p>

                  <form
                    className="mt-10 space-y-3"
                    onSubmit={handleSubmit(handleCreateTask)}
                    noValidate
                  >
                    <TaskForm // Renderiza el componente
                      register={register}
                      errors={errors}
                    /> 
                    <input
                      className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase footer-block font-bold cursor-pointer transition-colors"
                      type="submit"
                      value="Guardar tarea" />
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}