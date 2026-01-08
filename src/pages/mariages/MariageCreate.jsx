import React, { useState, useRef } from 'react'
import { Steps, Button, Card, App as AntdApp } from 'antd'
import HommeForm from './HommeForm'
import FemmeForm from './FemmeForm'
import DocumentsForm from './DocumentForm'
import MariageDetailsForm from './MariageDetailsForm'
import RecapitulatifMariage from './RecapitulatifMariage'
import { createMariage } from '../../api/mariage'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

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
      // formatage des dates avant l'envoi pour correspondre au format attendu par l'API
      const payload = {...formData,
        date_celebration: formData.date_celebration 
          ? dayjs(formData.date_celebration).format('YYYY-MM-DD') 
          : null,
        heure_celebration: formData.heure_celebration 
          ? dayjs(formData.heure_celebration).format('HH:mm:ss') 
          : null,
        
        infos_homme: {
          ...formData.infos_homme,
          date_naissance: formData.infos_homme?.date_naissance 
            ? dayjs(formData.infos_homme.date_naissance).format('YYYY-MM-DD') 
            : null,
        },
        infos_femme: {
          ...formData.infos_femme,
          date_naissance: formData.infos_femme?.date_naissance 
            ? dayjs(formData.infos_femme.date_naissance).format('YYYY-MM-DD') 
            : null,
        }
      }
      await createMariage(payload)
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
          // On passe la branche spécifique des données
          data={
            current === 0 ? formData.infos_homme :
            current === 1 ? formData.infos_femme :
            current === 2 ? formData.id_dossier :
            formData
          }
          // On passe une fonction qui met à jour seulement sa branche
          setData={(values) => {
            const key = steps[current].key;
            if (key === 'recap') return;
            
            setFormData(prev => {
              if (key === 'details') return { ...prev, ...values }; // MariageDetails est à la racine
              const mapping = {
                homme: 'infos_homme',
                femme: 'infos_femme',
                documents: 'id_dossier'
              };

              return {
                ...prev,
                [mapping[key]]: values
              };
            });
          }}
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
