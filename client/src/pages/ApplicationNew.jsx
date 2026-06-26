import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import ApplicationForm from './ApplicationForm'

export default function ApplicationNew() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const { data: created } = await api.post('/api/applications', data)
      navigate(`/applications/${created._id}`)
    } catch (err) {
      alert(err.response?.data?.error ?? 'Failed to create application.')
      setIsSubmitting(false)
    }
  }

  return (
    <ApplicationForm
      title="New Application"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
