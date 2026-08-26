'use client'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
}

interface NoteListProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  loading: boolean
}

export function NoteList({ notes, onEdit, onDelete, loading }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No notes yet. Create your first note!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
            {note.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {note.content}
          </p>
          <p className="text-gray-400 text-xs mb-4">
            {new Date(note.created_at).toLocaleDateString()}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(note)}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(note.id)}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
