import React from 'react'
import { useParams, Link } from 'react-router-dom'

const BoxPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()


  return (
    <div>
      <h1>Detalhes do Item {id}</h1>
      <p>Aqui você pode adicionar mais detalhes sobre o item.</p>
      <Link to="/">Voltar para a lista</Link>
    </div>
  )
}



export default BoxPage;