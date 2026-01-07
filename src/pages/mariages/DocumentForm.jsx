import React, { useEffect } from 'react'
import { Form, Checkbox } from 'antd'

const documentsList = [
  { name: 'photocopie_CNI', label: 'Photocopie CNI', required: true},
  { name: 'photocopie_acte_naissance', label: 'Acte de naissance' },
  { name: 'certificat_celibat_mairie', label: 'Certificat de célibat (Camerounais)' },
  { name: 'certificat_celibat_autorité', label: 'Certificat de célibat (Non Camerounais)' },
  { name: 'acte_déces_précedent_conjoint', label: 'Acte de décès du précédent conjoint' },
  { name: 'photocopi_ancien_acte_mariage', label: "Photocopie de l'ancien acte de mariage" },
  { name: 'attestation_divorce', label: 'Attestation de divorce' },
  { name: 'acte_mariage_polygame', label: 'Acte de mariage en cas de polygamie' },
  { name: 'certificat_capacité_mariage_français', label: 'Certificat de capacité de mariage (Français)' },
  { name: 'autorisation_mariage_militaire', label: 'Autorisation de mariage (Militaire)' },
  { name: 'dix_démi_photos_têtes_collées', label: 'Dix démi photos du couple' },
  { name: 'acte_naissance_enfants_couple', label: "Acte de naissance des enfants du couple" },
  { name: 'contrat_mariage', label: 'Contrat de mariage' },
  { name: 'cni_chef_famille', label: 'CNI des chefs de famille' },
  { name: 'cni_temoins', label: 'CNI des témoins' },
  

]

export default function DocumentsForm({ data, setData }) {
  const onChange = (_, values) => {
    setData(values)
  }
  const [form] = Form.useForm()

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    }
  }, [data, form])

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={onChange}
      initialValues={data}
    >
      {documentsList.map(doc => (
        <Form.Item key={doc.name} name={doc.name} valuePropName="checked" rules={doc.required ? [{ required: true, message: 'Ce document est requis' }] : []}>
          <Checkbox>{doc.label}</Checkbox>
        </Form.Item>
      ))}
    </Form>
  )
}
