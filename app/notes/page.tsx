'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CreateNoteModal } from './components/CreateNoteModal'
import { EditNoteModal } from './components/EditNoteModal'
import { NoteList } from './components/NoteList'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/')
          return
        }

        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setNotes(data || [])

        // Subscribe to realtime changes
        const subscription = supabase
          .channel(`user:${session.user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notes',
              filter: `user_id=eq.${session.user.id}`,
            },
            (payload: any) => {
              if (payload.eventType === 'INSERT') {
                setNotes((prev) => [payload.new, ...prev])
              } else if (payload.eventType === 'UPDATE') {
                setNotes((prev) =>
                  prev.map((n) => (n.id === payload.new.id ? payload.new : n))
                )
              } else if (payload.eventType === 'DELETE') {
                setNotes((prev) => prev.filter((n) => n.id !== payload.old.id))
              }
            }
          )
          .subscribe()

        return () => {
          subscription.unsubscribe()
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }

    fetchNotes()
  }, [supabase, router])

  const handleCreateNote = async (title: string, content: string) => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const { error } = await supabase.from('notes').insert({
        user_id: session.user.id,
        title,
        content,
      })

      if (error) throw error
      setIsCreateModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateNote = async (
    id: string,
    title: string,
    content: string
  ) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('notes')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      setIsEditModalOpen(false)
      setEditingNote(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    setLoading(true)
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">QuickNote</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button
              onClick={() => setError('')}
              className="float-right text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            + Create Note
          </button>
        </div>

        <NoteList
          notes={notes}
          onEdit={(note) => {
            setEditingNote(note)
            setIsEditModalOpen(true)
          }}
          onDelete={handleDeleteNote}
          loading={loading}
        />
      </main>

      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateNote}
        loading={loading}
      />

      <EditNoteModal
        isOpen={isEditModalOpen}
        note={editingNote}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingNote(null)
        }}
        onSubmit={handleUpdateNote}
        loading={loading}
      />
    </div>
  )
}
