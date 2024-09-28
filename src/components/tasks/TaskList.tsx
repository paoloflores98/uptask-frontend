import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";
import DropTask from "./DropTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

type TaskListProps = {
  tasks: TaskProject[]
  canEdit: boolean
}

type GroupTask = {
  [key: string]: TaskProject[]
}

const initialStatusGroups: GroupTask = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: []
}

const statusStyles: {[key: string]: string} = {
  pending: 'border-t-slate-500',
  onHold: 'border-t-red-500',
  inProgress: 'border-t-blue-500',
  underReview: 'border-t-amber-500',
  completed: 'border-t-emerald-500'
}

const TaskList = ({tasks, canEdit}: TaskListProps) => {
  const params = useParams(); // useParams: Hook que retorna un objeto de parámetros de la URL
  const projectId = params.projectId!;
  
  /* Tanstack Query */
  const queryClient = useQueryClient();
  
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({queryKey: ['project', projectId]}); // Elimina los datos en caché
    },
  });

  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  /* DND Kit - Drag & Drop */
  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;

    if(over && over.id) {
      const taskId = active.id.toString();
      const status = over.id as TaskStatus;
      mutate({projectId, taskId, status});

      // Optimizar el Drag & Drop
      queryClient.setQueryData(['project', projectId], (prevData: Project) => {
        const updatedTasks = prevData.tasks.map((task) => {
          if(task._id === taskId) {
            return {
              ...task,
              status
            }
          }
          return task;
        })
        return {
          ...prevData,
          tasks: updatedTasks
        }
      });
    }
  }

  return (
    <>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
        {/* DND Kit - Drag & Drop */}
        <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5' key={status}>
              <h3
                className={`capitalize text-xl font-light border border-slate-600 bg-white p-3 border-t-8 ${statusStyles[status]}`}
              >{statusTranslations[status]}</h3>

              <DropTask status={status} /> {/* Renderiza el componente */}

              <ul className='mt-5 space-y-5'>
                {tasks.length === 0
                  ? <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                  : tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />) // Renderiza el componente
                }
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  )
}

export default TaskList;