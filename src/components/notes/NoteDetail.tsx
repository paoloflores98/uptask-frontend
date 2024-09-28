import { deleteNote } from "@/api/NoteAPI";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatDate } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type NoteDetailProps = {
  note: Note
}

const NoteDetail = ({ note }: NoteDetailProps) => {
  const { data, isLoading } = useAuth();
  
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);

  const params = useParams(); // useParams: Hook que retorna un objeto de parámetros de la URL
  const projectId = params.projectId!; // Retorna su valor si encuentra el parámetro. Caso contrario retorna null

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // API que retorna un objeto con la cantidad de parámetros de la URL
  const taskId = queryParams.get('viewTask')!; // Retorna su valor si encuentra el parámetro. Caso contrario retorna null

  /* Tanstack query */
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['viewTask', taskId]}); // Elimina los datos en caché
    }
  })

  if (isLoading) return 'Cargando...';

  return (
    <div className="p-3 flex justify-between items-center">
      <div>
        <p>{note.content} por: <span className="font-bold">{note.createdBy.name}</span></p>
        <p className="text-xs text-slate-500">
          {formatDate(note.createdAt)}
        </p>
      </div>

      {canDelete && (
        <button
          className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
          type="button"
          onClick={() => mutate({ projectId, taskId, noteId: note._id })}
        >Eliminar</button>
      )}
    </div>
  )
}

export default NoteDetail;