// src/pages/mariages/MariageEdit.jsx
import React, { useEffect, useState, useRef } from 'react'
import { Steps, Button, Spin, App as AntdApp, Card } from 'antd'
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
  const { message } = AntdApp.useApp()

  const [current, setCurrent] = useState(0)
  const [formData, setFormData] = useState(null)

  // 🧠 Requête pour charger le mariage existant
  const { data, isLoading, isError } = useQuery({
    queryKey: ['mariage', id],
    queryFn: () => fetchMariageById(id),
    enabled: !!id,
  })

    // ⚙️ Initialisation du formData après le chargement
  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        date_celebration: data.date_celebration ? dayjs(data.date_celebration) : null,
        heure_celebration: data.heure_celebration ? dayjs(data.heure_celebration, 'HH:mm:ss') : null,
        infos_homme: {...data.infos_homme, date_naissance: data.infos_homme?.date_naissance ? dayjs(data.infos_homme.date_naissance) : null,},
        infos_femme: {...data.infos_femme, date_naissance: data.infos_femme?.date_naissance ? dayjs(data.infos_femme.date_naissance) : null,}
      })
    }
  }, [data])


  // 🛠️ Mutation pour mettre à jour le mariage
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      await api.put(`/mairie/mariages/${id}/`, payload)
    },
    onSuccess: () => {
      message.success('Mariage mis à jour avec succès 🎉')
      queryClient.invalidateQueries({ queryKey: ['mariages'] })
      navigate(`/mariages/`)
    },
    onError: () => {
      message.error('Erreur lors de la mise à jour du mariage ❌')
    },
  })

  // 🧩 Configuration des étapes (Logique identique à MariageCreate)
  const steps = [
    { title: 'Époux', key: 'homme', component: HommeForm },
    { title: 'Épouse', key: 'femme', component: FemmeForm },
    { title: 'Documents', key: 'documents', component: DocumentsForm },
    { title: 'Détails', key: 'details', component: MariageDetailsForm },
    { title: 'Récapitulatif', key: 'recap', component: RecapitulatifMariage },
  ]

  const next = async () => {
    const key = steps[current].key
    if (key !== 'recap' && formRefs.current[key]) {
      try {
        await formRefs.current[key].validateFields()
      } catch {
        message.error('Veuillez remplir les champs obligatoires')
        return
      }
    }
    setCurrent(current + 1)
  }
  const prev = () => setCurrent(current - 1)

  const handleSubmit = async () => {
    if (!formData) return
    
    // Formatage strict pour Django avant l'envoi
    const payload = {...formData,
      date_celebration: formData.date_celebration ? dayjs(formData.date_celebration).format('YYYY-MM-DD') : null,
      heure_celebration: formData.heure_celebration ? dayjs(formData.heure_celebration).format('HH:mm:ss') : null,
      infos_homme: {...formData.infos_homme,
        date_naissance: formData.infos_homme?.date_naissance ? dayjs(formData.infos_homme.date_naissance).format('YYYY-MM-DD') : null,
      },
      infos_femme: {...formData.infos_femme,
        date_naissance: formData.infos_femme?.date_naissance ? dayjs(formData.infos_femme.date_naissance).format('YYYY-MM-DD') : null,
      }
    }
    updateMutation.mutate(payload)
  }

  if (isLoading || !formData) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (isError) {
    return <p style={{ textAlign: 'center', color: 'red' }}>Erreur de chargement des données.</p>
  }

  const StepComponent = steps[current].component

  return (
    <Card style={{ maxWidth: 1200, margin: '40px auto', padding: '20px 0' }}>
      <Steps current={current} items={steps.map(s => ({ title: s.title }))} style={{ marginBottom: 32 }} />
      <div style={{ padding: 24, maxWidth: 1000, margin: 'auto' }}>
        <StepComponent
          data={
              current === 0 ? formData.infos_homme :
              current === 1 ? formData.infos_femme :
              current === 2 ? formData.id_dossier :
              formData
          }
          setData={(values) => {
            const key = steps[current].key
            setFormData(prev => {
              if (key === 'details') return { ...prev, ...values }
              const mapping = { homme: 'infos_homme', femme: 'infos_femme', documents: 'id_dossier' }
              return { ...prev, [mapping[key]]: values }
            })
          }}
          formRefs={formRefs}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {current > 0 && (
          <Button onClick={prev}>
            Précédent
          </Button>
        )}
        {current < steps.length - 1 ? (
          <Button type="primary" onClick={next}>
            Suivant
          </Button>
        ) : (
          <Button type="primary" onClick={handleSubmit} loading={updateMutation.isPending}>
            Enregistrer les modifications
          </Button>
        )}
      </div>
    </Card>
  )
}
