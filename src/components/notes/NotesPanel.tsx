import { Task } from "@/types/index";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";

type NotesPanelProps = {
  notes: Task['notes']
}

const NotesPanel = ({notes}: NotesPanelProps) => {
  return (
    <>
      <AddNoteForm /> {/* Renderiza el componente */}

      <div className="divide-y divide-gray-100 mt-10">
        {notes.length
          ? (
            <>
              <p className="text-lg text-slate-500 font-bold">Notas:</p>
              {notes.map(note => <NoteDetail key={note._id} note={note} />)} {/* Renderiza el componente */}
            </>
          )
          : <p className="text-gray-500 text-center pt-3">No hay notas</p>
        }
      </div>
    </>
  )
}

export default NotesPanel;