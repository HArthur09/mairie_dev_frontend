// src/pages/mariages/MariageDetail.jsx
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Descriptions, Divider, Spin, Button, Space, Tag, message, Grid } from 'antd'
import api from '../api/axios'
import dayjs from 'dayjs'

const { useBreakpoint } = Grid

const fetchMariageById = async (id) => {
  const { data } = await api.get(`/mairie/mariages/${id}/`)
  return data
}

export default function MariageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const screens = useBreakpoint()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['mariage', id],
    queryFn: () => fetchMariageById(id),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (isError) {
    message.error("Erreur lors du chargement du mariage")
    return <p style={{ textAlign: 'center' }}>Impossible de charger les données.</p>
  }

  const mariage = data || {}
  const homme = mariage.infos_homme || {}
  const femme = mariage.infos_femme || {}
  const docs = mariage.id_dossier || {}

  const trueDocs = Object.keys(docs).filter(
    (key) => typeof docs[key] === 'boolean' && docs[key]
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'terminé':
        return 'green'
      case 'annule':
        return 'red'
      default:
        return 'orange'
    }
  }

  // ✅ Responsive: 1 colonne sur mobile, 2 sur desktop
  const colCount = screens.xs ? 1 : 2

  return (
    <div style={{ padding: screens.xs ? '16px' : '40px 60px' }}>
      <Space style={{ marginBottom: 24 }}>
        <Button onClick={() => navigate(-1)}>⬅️ Retour</Button>
        <Button type="primary" onClick={() => navigate(`/mariages/${id}/edit`)}>Modifier</Button>
      </Space>

      <Divider orientation="left">💍 Informations générales</Divider>
      <Descriptions bordered column={colCount} size={screens.xs ? 'small' : 'middle'}>
        <Descriptions.Item label="Date de célébration">
          {mariage.date_celebration ? dayjs(mariage.date_celebration).format('DD/MM/YYYY') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Heure">{mariage.heure_celebration || '-'}</Descriptions.Item>
        <Descriptions.Item label="Lieu">{mariage.lieu_celebration || '-'}</Descriptions.Item>
        <Descriptions.Item label="Maire célébrant">{mariage.nom_maire}</Descriptions.Item>
        <Descriptions.Item label="Statut">
          <Tag color={getStatusColor(mariage.status)}>{mariage.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Fait à">{mariage.fait_à}</Descriptions.Item>
        <Descriptions.Item label="Fait le">
          {mariage.fait_le ? dayjs(mariage.fait_le).format('DD/MM/YYYY') : '-'}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">👨 Informations sur l’époux</Divider>
      <Descriptions bordered column={colCount} size={screens.xs ? 'small' : 'middle'}>
        <Descriptions.Item label="Nom">{homme.nom}</Descriptions.Item>
        <Descriptions.Item label="Prénom">{homme.prenom}</Descriptions.Item>
        <Descriptions.Item label="Date de naissance">
          {homme.date_naissance ? dayjs(homme.date_naissance).format('DD/MM/YYYY') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Lieu de naissance">{homme.lieu_naissance}</Descriptions.Item>
        <Descriptions.Item label="Arrondissement de naissance">{homme.Arrondoissement_naissance}</Descriptions.Item>
        <Descriptions.Item label="Département de naissance">{homme.Departement_naissance}</Descriptions.Item>
        <Descriptions.Item label="Âge">{homme.age}</Descriptions.Item>
        <Descriptions.Item label="Profession">{homme.profession}</Descriptions.Item>
        <Descriptions.Item label="Nationalité">{homme.nationalité}</Descriptions.Item>
        <Descriptions.Item label="Domicile">{homme.domicile}</Descriptions.Item>
        <Descriptions.Item label="Nom du père">{homme.nom_père}</Descriptions.Item>
        <Descriptions.Item label="Nom de la mère">{homme.nom_mère}</Descriptions.Item>
        <Descriptions.Item label="Chef de famille">{homme.chef_famille_marié}</Descriptions.Item>
        <Descriptions.Item label="Témoin">{homme.nom_temoin_epoux}</Descriptions.Item>
        <Descriptions.Item label="Téléphone">{homme.telephone_epoux}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">👩 Informations sur l’épouse</Divider>
      <Descriptions bordered column={colCount} size={screens.xs ? 'small' : 'middle'}>
        <Descriptions.Item label="Nom">{femme.nom}</Descriptions.Item>
        <Descriptions.Item label="Prénom">{femme.prenom}</Descriptions.Item>
        <Descriptions.Item label="Date de naissance">
          {femme.date_naissance ? dayjs(femme.date_naissance).format('DD/MM/YYYY') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Lieu de naissance">{femme.lieu_naissance}</Descriptions.Item>
        <Descriptions.Item label="Arrondissement de naissance">{femme.Arrondoissement_naissance}</Descriptions.Item>
        <Descriptions.Item label="Département de naissance">{femme.Departement_naissance}</Descriptions.Item>
        <Descriptions.Item label="Âge">{femme.age}</Descriptions.Item>
        <Descriptions.Item label="Profession">{femme.profession}</Descriptions.Item>
        <Descriptions.Item label="Nationalité">{femme.nationalité}</Descriptions.Item>
        <Descriptions.Item label="Domicile">{femme.domicile}</Descriptions.Item>
        <Descriptions.Item label="Nom du père">{femme.nom_père}</Descriptions.Item>
        <Descriptions.Item label="Nom de la mère">{femme.nom_mère}</Descriptions.Item>
        <Descriptions.Item label="Chef de famille">{femme.chef_famille_mariée}</Descriptions.Item>
        <Descriptions.Item label="Témoin">{femme.nom_temoin_epouse}</Descriptions.Item>
        <Descriptions.Item label="Téléphone">{femme.telephone_epouse}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">📄 Documents fournis</Divider>
      {trueDocs.length > 0 ? (
        <ul style={{ paddingLeft: '25px' }}>
          {trueDocs.map((key) => (
            <li key={key}>{key.replaceAll('_', ' ')}</li>
          ))}
        </ul>
      ) : (
        <p>Aucun document joint.</p>
      )}
    </div>
  )
}
