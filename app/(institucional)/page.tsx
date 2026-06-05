import Header from '@/app/components/institucional/Header'
import Hero from '@/app/components/institucional/Hero'
import Diferenciais from '@/app/components/institucional/Diferenciais'
import Atividades from '@/app/components/institucional/Atividades'
import Espaco from '@/app/components/institucional/Espaco'
import Planos from '@/app/components/institucional/Planos'
import Contato from '@/app/components/institucional/Contato'
import Footer from '@/app/components/institucional/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Diferenciais />
      <Atividades />
      <Espaco />
      <Planos />
      <Contato />
      <Footer />
    </main>
  )
}
