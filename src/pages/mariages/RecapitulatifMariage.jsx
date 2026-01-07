import React from 'react'
import { Descriptions, Divider } from 'antd'
import dayjs from 'dayjs'

export default function RecapitulatifMariage({ data }) {
  const { infos_homme = {}, infos_femme = {}, id_dossier = {} } = data

  // Formatage date + heure si objets dayjs
  const NH = infos_homme.date_naissance
    ? dayjs.isDayjs(infos_homme.date_naissance)
      ? infos_homme.date_naissance.format('YYYY-MM-DD')
      : infos_homme.date_naissance
    : '—'
  data.infos_homme.date_naissance = NH

  const NF = infos_femme.date_naissance
    ? dayjs.isDayjs(infos_femme.date_naissance)
      ? infos_femme.date_naissance.format('YYYY-MM-DD')
      : infos_femme.date_naissance
    : '—'

  data.infos_femme.date_naissance = NF

  const dateStr = data.date_celebration
    ? dayjs.isDayjs(data.date_celebration)
      ? data.date_celebration.format('YYYY-MM-DD')
      : data.date_celebration
    : '—'

  data.date_celebration = dateStr

  const heureStr = data.heure_celebration
    ? dayjs.isDayjs(data.heure_celebration)
      ? data.heure_celebration.format('HH:mm:ss')
      : data.heure_celebration
    : '—'

  data.heure_celebration = heureStr

  const trueDocs = Object.keys(id_dossier).filter(key => id_dossier[key])

  return (
    <div>
      <Divider orientation="left">👨 Informations sur l’époux</Divider>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Nom">{infos_homme.nom}</Descriptions.Item>
        <Descriptions.Item label="Prénom">{infos_homme.prenom}</Descriptions.Item>
        <Descriptions.Item label="Date de naissance">{NH}</Descriptions.Item>
        <Descriptions.Item label="Profession">{infos_homme.profession}</Descriptions.Item>
        <Descriptions.Item label="Téléphone">{infos_homme.telephone_epoux}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">👩 Informations sur l’épouse</Divider>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Nom">{infos_femme.nom}</Descriptions.Item>
        <Descriptions.Item label="Prénom">{infos_femme.prenom}</Descriptions.Item>
        <Descriptions.Item label="Date de naissance">{NF}</Descriptions.Item>
        <Descriptions.Item label="Profession">{infos_femme.profession}</Descriptions.Item>
        <Descriptions.Item label="Téléphone">{infos_femme.telephone_epouse}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">📄 Documents fournis</Divider>
      <ul>
        {trueDocs.length > 0 ? (
          trueDocs.map(key => <li key={key}>{key.replaceAll('_', ' ')}</li>)
        ) : (
          <p>Aucun document coché</p>
        )}
      </ul>

      <Divider orientation="left">💍 Détails du mariage</Divider>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Date">{dateStr}</Descriptions.Item>
        <Descriptions.Item label="Heure">{heureStr}</Descriptions.Item>
        <Descriptions.Item label="Lieu">{data.lieu_celebration}</Descriptions.Item>
        <Descriptions.Item label="Maire célébrant">{data.nom_maire}</Descriptions.Item>
        <Descriptions.Item label="Fait à">{data.fait_à}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}
