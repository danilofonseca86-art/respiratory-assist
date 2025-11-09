'use client'

import { useState } from 'react'

const diseases = {
  'Resfriado Comum': { icon: '🤧', symptoms: ['Tosse seca ou produtiva leve', 'Espirros', 'Coriza'] },
  'Bronquite': { icon: '🫁', symptoms: ['Tosse produtiva persistente', 'Fadiga', 'Febre leve'] },
  'Pneumonia': { icon: '⚠️', symptoms: ['Tosse produtiva com advento agudo', 'Febre alta', 'Falta de ar grave'] },
  'Asma': { icon: '😤', symptoms: ['Tosse seca recorrente', 'Sibilância', 'Falta de ar desencadeada por atividade'] },
  'Croup': { icon: '📢', symptoms: ['Tosse com som de foca', 'Estridor', 'Rouquidão'] },
  'Bronquiolite': { icon: '👶', symptoms: ['Tosse produtiva com sibilância', 'Falta de ar', 'Chiado'] },
  'Sinusite': { icon: '👃', symptoms: ['Tosse noturna', 'Congestão nasal', 'Espirros'] },
  'Otite Média': { icon: '👂', symptoms: ['Tosse após infecção nasal', 'Dor de ouvido', 'Congestão'] },
}

export default function Home() {
  const [patientName, setPatientName] = useState('')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [coughType, setCoughType] = useState('Seca')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [severity, setSeverity] = useState('Leve')
  const [result, setResult] = useState(null)

  const symptoms = [
    'Falta de ar', 'Sibilância', 'Estridor', 'Pele pálida ou azulada',
    'Dificuldade de alimentação', 'Letargia', 'Febre acima de 39°C', 'Vômitos'
  ]

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    )
  }

  const analyzeSymptoms = () => {
    if (!patientName || !age || !weight) {
      alert('Por favor, preencha os dados do paciente')
      return
    }

    const scoreMap = {}
    Object.keys(diseases).forEach(disease => (scoreMap[disease] = 0))

    if (coughType === 'Produtiva') { scoreMap['Bronquite']++; scoreMap['Pneumonia']++; scoreMap['Bronquiolite']++ }
    else if (coughType === 'Com chiado') { scoreMap['Asma']++; scoreMap['Bronquiolite']++ }

    if (selectedSymptoms.includes('Sibilância')) { scoreMap['Asma'] += 2; scoreMap['Bronquiolite']++ }
    if (selectedSymptoms.includes('Estridor')) scoreMap['Croup'] += 2
    if (selectedSymptoms.includes('Falta de ar')) { scoreMap['Pneumonia']++; scoreMap['Asma']++ }

    if (severity === 'Grave') { scoreMap['Pneumonia'] += 2; scoreMap['Asma']++ }

    const sorted = Object.entries(scoreMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([disease]) => disease)

    setResult({
      patientName,
      age: parseInt(age),
      weight: parseInt(weight),
      topDiseases: sorted,
      coughType,
      symptoms: selectedSymptoms,
      severity
    })
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>🫁 Assistente de Diagnóstico Respiratório Pediátrico</h1>
      
      <div style={{ backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Dados do Paciente</h3>
        <input
          placeholder="Nome do paciente"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #bdc3c7' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <input
            placeholder="Idade (anos)"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #bdc3c7' }}
          />
          <input
            placeholder="Peso (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #bdc3c7' }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Tipo de Tosse</h3>
        {['Seca', 'Produtiva', 'Com chiado'].map(type => (
          <label key={type} style={{ display: 'block', marginBottom: '8px' }}>
            <input
              type="radio"
              name="cough"
              checked={coughType === type}
              onChange={() => setCoughType(type)}
            />
            {' ' + type}
          </label>
        ))}
      </div>

      <div style={{ backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Sintomas Associados</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {symptoms.map(symptom => (
            <label key={symptom} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => toggleSymptom(symptom)}
                style={{ marginRight: '8px' }}
              />
              {symptom}
            </label>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Severidade</h3>
        {['Leve', 'Moderada', 'Grave'].map(level => (
          <label key={level} style={{ display: 'block', marginBottom: '8px' }}>
            <input
              type="radio"
              name="severity"
              checked={severity === level}
              onChange={() => setSeverity(level)}
            />
            {' ' + level}
          </label>
        ))}
      </div>

      <button
        onClick={analyzeSymptoms}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Analisar Sintomas
      </button>

      {result && (
        <div style={{ backgroundColor: '#d5f4e6', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h2>📋 Resultado da Análise</h2>
          <p><strong>Paciente:</strong> {result.patientName}, {result.age} anos, {result.weight}kg</p>
          <p><strong>Tipo de Tosse:</strong> {result.coughType}</p>
          <p><strong>Severidade:</strong> {result.severity}</p>
          
          <h3>Possíveis Diagnósticos (em ordem de probabilidade):</h3>
          {result.topDiseases.map((disease, idx) => (
            <div key={disease} style={{ backgroundColor: 'white', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
              <p><strong>{idx + 1}. {diseases[disease].icon} {disease}</strong></p>
            </div>
          ))}
          
          <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '15px' }}>
            ⚠️ <strong>Aviso:</strong> Esta análise é apenas para fins educacionais. Procure um pediatra para diagnóstico definitivo.
          </p>
        </div>
      )}
    </div>
  )
}
