import { Fragment, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateStatus } from '@/api/TaskAPI';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/utils';
import { statusTranslations } from '@/locales/es';
import { TaskStatus } from '@/types/index';
import NotesPanel from '../notes/NotesPanel';

export default function TaskModalDetails() {
  const params = useParams(); // useParams: Hook que retorna un objeto de parámetros de la URL
  const projectId = params.projectId!;
  
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // API que retorna un objeto con la cantidad de parámetros de la URL
  const taskId = queryParams.get('viewTask')!; // Retorna su valor si encuentra el parámetro. Caso contrario retorna null
  const show = taskId ? true : false;

  /* Tanstack Query */
  const { data, isError, error } = useQuery({
    queryKey: ['viewTask', taskId],
    queryFn: () => getTaskById({projectId, taskId}),
    enabled: !!taskId, // !!: Retorna un booleano si la variable tiene o no un valor
    retry: false
  });

  const queryClient = useQueryClient();
  
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({queryKey: ['project', projectId]}); // Elimina los datos en caché
      queryClient.invalidateQueries({queryKey: ['viewTask', taskId]}); // Elimina los datos en caché
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TaskStatus;
    const data = {projectId, taskId, status}
    mutate(data);
  }

  /* if(isError) {
    toast.error(error.message, {toastId: 'error'});
    return <Navigate to={`/projects/${projectId}`} />
  } */

  useEffect(() => {
    if (isError) {
      toast.error(error.message, { toastId: "error" })
      return navigate(`/projects/${projectId}`)
    }
  }, [isError]);

  if(data) return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog className="relative z-10" as="div" onClose={() => navigate(location.pathname, {replace: true})}>
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
                  <p className='text-sm text-slate-500 font-bold'>Creación: <span className='font-normal'>{formatDate(data.createdAt)}</span></p>
                  <p className='text-sm text-slate-500 font-bold'>Última actualización: <span className='font-normal'>{formatDate(data.updatedAt)}</span></p>
                  <DialogTitle
                    className="font-black text-4xl text-slate-600 my-5"
                    as="h3"
                  >{data.name}</DialogTitle>
                  <p className='text-lg text-slate-500 mb-2 font-bold'>Descripción: <span className='font-normal'>{data.description}</span></p>
                  
                  {data.completedBy.length
                    ? (
                      <>
                        <p className='text-lg text-slate-500 mb-2 font-bold'>Historial de cambios</p>
                        <ul className='list-decimal pl-4'>
                          {data.completedBy.map((activityLog) => (
                            <li className='text-sm text-slate-500 font-bold' key={activityLog._id}>{statusTranslations[activityLog.status]}: <span className='font-normal'>{activityLog.user.name}</span></li>))
                          }
                        </ul>
                      </>
                    )
                    : null
                  }

                  <div className='my-5 space-y-3'>
                    <label className='text-lg text-slate-500 font-bold'>Estado:</label>
                    <select
                      className='w-full p-3 bg-white border border-gray-300'
                      defaultValue={data.status}
                      onChange={handleChange}
                    >
                      {Object.entries(statusTranslations).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <NotesPanel notes={data.notes} /> {/* Renderiza el componente */}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}