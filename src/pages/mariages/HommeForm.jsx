import React from 'react'
import { Form, Input, DatePicker, InputNumber, Select } from 'antd'
//import dayjs from 'dayjs'

export default function HommeForm({ data, setData, formRefs }) {
  const [form] = Form.useForm()

  const onValuesChange = (_, allValues) => {
    setData(prev => ({ ...prev, infos_homme: allValues }))
  }

  return (
    <Form
      form={form}
      layout="vertical"
      ref={ref => { formRefs.current['homme'] = form }}
      onValuesChange={onValuesChange}
      initialValues={data.infos_homme}
    >
      <Form.Item name="nom" label="Nom" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="date_naissance" label="Date de naissance">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="age" label="Âge">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="sexe" label="Sexe">
        <Select>
          <Select.Option value="masculin">Masculin</Select.Option>
          <Select.Option value="féminin">Féminin</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="lieu_naissance" label="Lieu de naissance">
        <Input />
      </Form.Item>
      <Form.Item name="Arrondoissement_naissance" label="Arrondissement de naissance">
        <Input />
      </Form.Item>
      <Form.Item name="Departement_naissance" label="Departement de naissance">
        <Input />
      </Form.Item>
      <Form.Item name="nationalité" label="Nationalité">
        <Select>
          <Select.Option value="Camerounais">Camerounaise</Select.Option>
          <Select.Option value="Congolais">Congolaise</Select.Option>
          <Select.Option value="Gabonais">Gabonaise</Select.Option>
          <Select.Option value="Equato-Guinéen">Equato-Guinéen</Select.Option>
          <Select.Option value="Centrafricain">Centreafricain</Select.Option>
          <Select.Option value="Tchadien">Tchadien</Select.Option>
          <Select.Option value="Nigerien">Nigérien</Select.Option>
          <Select.Option value="Nigérian">Nigérian</Select.Option>
          <Select.Option value="Français">Français</Select.Option>
          <Select.Option value="Autre">Autre</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="profession" label="Profession">
        <Input />
      </Form.Item>
      <Form.Item name="domicile" label="Domicile">
        <Input />
      </Form.Item>
      <Form.Item name="nom_père" label="Nom du père">
        <Input />
      </Form.Item>
      <Form.Item name="nom_mère" label="Nom de la mère">
        <Input />
      </Form.Item>
      <Form.Item name="chef_famille_marié" label="Chef de famille">
        <Input />
      </Form.Item>
      <Form.Item name="nom_temoin_epoux" label="Nom du témoin de l’époux">
        <Input />
      </Form.Item>
      <Form.Item name="telephone_epoux" label="Téléphone">
        <Input />
      </Form.Item>
    </Form>
  )
}
