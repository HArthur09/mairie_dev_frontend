// src/pages/mariages/MariageEdit.jsx
import React, { useEffect, useState, useRef } from 'react'
import { Steps, Button, message, Spin } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import DocumentsForm from './mariages/DocumentForm'
import HommeForm from './mariages/HommeForm'
import FemmeForm from './mariages/FemmeForm'
import MariageDetailsForm from './mariages/MariageDetailsForm'
import RecapitulatifMariage from './mariages/RecapitulatifMariage'
import dayjs from 'dayjs'

const fetchMariageById = async (id) => {
  const { data } = await api.get(`/mairie/mariages/${id}/`)
  return data
}

export default function MariageEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const formRefs = useRef({})

  const [current, setCurrent] = useState(0)
  const [formData, setFormData] = useState(null)

  // 🧩 Étapes du formulaire
  const steps = [
    { title: 'Documents', content: <DocumentsForm data={formData?.id_dossier || {}} setData={(v) => setFormData((p) => ({ ...p, id_dossier: v }))} formRefs={formRefs} /> },
    { title: 'Époux', content: <HommeForm data={formData?.infos_homme || {}} setData={(v) => setFormData((p) => ({ ...p, infos_homme: v }))} formRefs={formRefs} /> },
    { title: 'Épouse', content: <FemmeForm data={formData?.infos_femme || {}} setData={(v) => setFormData((p) => ({ ...p, infos_femme: v }))} formRefs={formRefs} /> },
    { title: 'Mariage', content: <MariageDetailsForm data={formData || {}} setData={setFormData} formRefs={formRefs} /> },
    { title: 'Récapitulatif', content: <RecapitulatifMariage data={formData} /> },
  ]
  console.log('Données soumises :', formData)

  // 🧠 Requête pour charger le mariage existant
  const { data, isLoading, isError } = useQuery({
    queryKey: ['mariage', id],
    queryFn: () => fetchMariageById(id),
    enabled: !!id,
  })

  // 🛠️ Mutation pour mettre à jour le mariage
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      await api.put(`/mairie/mariages/${id}/`, payload)
    },
    onSuccess: () => {
      message.success('Mariage mis à jour avec succès 🎉')
      queryClient.invalidateQueries({ queryKey: ['mariages'] })
      navigate(`/mariages/${id}`)
    },
    onError: () => {
      message.error('Erreur lors de la mise à jour du mariage ❌')
    },
  })

  // ⚙️ Initialisation du formData après le chargement
  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        date_celebration: data.date_celebration ? dayjs(data.date_celebration) : null,
        heure_celebration: data.heure_celebration ? dayjs(data.heure_celebration, 'HH:mm:ss') : null,
      })
    }
  }, [data])

  const next = () => setCurrent(current + 1)
  const prev = () => setCurrent(current - 1)

  const handleSubmit = async () => {
    if (!formData) return
    const payload = {
      ...formData,
      date_celebration: formData.date_celebration
        ? dayjs(formData.date_celebration).format('YYYY-MM-DD')
        : null,
      heure_celebration: formData.heure_celebration
        ? dayjs(formData.heure_celebration).format('HH:mm:ss')
        : null,
    }
    updateMutation.mutate(payload)
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (isError) {
    return <p style={{ textAlign: 'center', color: 'red' }}>Erreur de chargement des données.</p>
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: 'auto' }}>
      <Steps
        current={current}
        items={steps.map((s) => ({ title: s.title }))}
        style={{ marginBottom: 24 }}
      />
      <div style={{ marginBottom: 24 }}>{steps[current].content}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {current > 0 && (
          <Button onClick={prev}>
            Précédent
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Suivant
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleSubmit} loading={updateMutation.isPending}>
            Enregistrer les modifications
          </Button>
        )}
      </div>
    </div>
  )
}
