import React, { useState, useRef } from 'react'
import { Steps, Button, Card, App as AntdApp } from 'antd'
import HommeForm from './HommeForm'
import FemmeForm from './FemmeForm'
import DocumentsForm from './DocumentForm'
import MariageDetailsForm from './MariageDetailsForm'
import RecapitulatifMariage from './RecapitulatifMariage'
import { createMariage } from '../../api/mariage'
import { useNavigate } from 'react-router-dom'

const { Step } = Steps

export default function MariageCreate() {
  const [current, setCurrent] = useState(0)
  const [formData, setFormData] = useState({
    infos_homme: {},
    infos_femme: {},
    id_dossier: {},
  })
  const [loading, setLoading] = useState(false)
  const formRefs = useRef({}) // référence à chaque sous-formulaire
  const { message } = AntdApp.useApp() // ✅ Hook officiel
  const navigate = useNavigate()

  const steps = [
    { title: 'Époux', key: 'homme', component: HommeForm },
    { title: 'Épouse', key: 'femme', component: FemmeForm },
    { title: 'Documents', key: 'documents', component: DocumentsForm },
    { title: 'Détails', key: 'details', component: MariageDetailsForm },
    { title: 'Récapitulatif', key: 'recap', component: RecapitulatifMariage },
  ]

  const next = async () => {
    // 🔍 validation du formulaire courant (sauf pour le récap)
    const key = steps[current].key
    if (key !== 'recap' && formRefs.current[key]) {
      try {
        await formRefs.current[key].validateFields()
      } catch {
        message.error('Veuillez remplir correctement tous les champs requis')
        return
      }
    }
    setCurrent(current + 1)
  }

  const prev = () => setCurrent(current - 1)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await createMariage(formData)
      message.success('Mariage enregistré avec succès 🎉')
      setCurrent(0)
      setFormData({})
      navigate('/mariages', { replace: true })
    } catch (err) {
      console.error(err)
      message.error("Échec de l'enregistrement du mariage")
    } finally {
      setLoading(false)
    }
  }

  const StepComponent = steps[current].component

  return (
    <Card style={{ margin: 24, padding: 24, borderRadius: 12 }}>
      <Steps current={current} items={steps.map(s => ({ title: s.title }))} />
      <div style={{ marginTop: 32, minHeight: 360 }}>
        <StepComponent
          data={formData}
          setData={setFormData}
          formRefs={formRefs}
        />
      </div>

      <div style={{ marginTop: 24, textAlign: 'right' }}>
        {current > 0 && current < steps.length && (
          <Button style={{ marginRight: 8 }} onClick={prev}>
            Précédent
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Suivant
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Enregistrer
          </Button>
        )}
      </div>
    </Card>
  )
}
