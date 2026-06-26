import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api'
import ApplicationForm from './ApplicationForm'

export default function ApplicationEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    api
      .get(`/api/applications/${id}`)
      .then(({ data }) => setApplication(data))
      .catch(() => setError('Failed to load application.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await api.put(`/api/applications/${id}`, data)
      navigate(`/applications/${id}`)
    } catch (err) {
      alert(err.response?.data?.error ?? 'Failed to update application.')
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <ApplicationForm
      title="Edit Application"
      initialData={application}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
