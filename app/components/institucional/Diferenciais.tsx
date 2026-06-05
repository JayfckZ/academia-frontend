'use client'

import SpeedIcon from '@mui/icons-material/Speed'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import WifiIcon from '@mui/icons-material/Wifi'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import StorefrontIcon from '@mui/icons-material/Storefront'
import WeekendIcon from '@mui/icons-material/Weekend'
import LockIcon from '@mui/icons-material/Lock'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import SpaIcon from '@mui/icons-material/Spa'
import FaceIcon from '@mui/icons-material/Face'
import DryCleaningIcon from '@mui/icons-material/DryCleaning'

const listaDiferenciais = [
  {
    titulo: 'Equipamentos High-End',
    descricao: 'Maquinário importado com biomecânica perfeita.',
    icone: <SpeedIcon className="text-brand-cyan text-5xl mb-4" />
  },
  {
    titulo: 'Métricas e Dados',
    descricao: 'Acompanhe sua evolução direto no app integrado.',
    icone: <MonitorHeartIcon className="text-brand-cyan text-5xl mb-4" />
  },
  {
    titulo: 'Wi-Fi',
    descricao: 'Conexão ultrarrápida em todos os ambientes.',
    icone: <WifiIcon className="text-brand-cyan text-5xl mb-4" />
  },
  {
    titulo: 'Playlist Colaborativa',
    descricao: 'Adicione suas músicas na rádio da academia pelo app.',
    icone: <QueueMusicIcon className="text-brand-cyan text-5xl mb-4" />
  },
  {
    titulo: 'Codefit Store',
    descricao: 'Loja exclusiva com suplementos e vestuário premium.',
    icone: <StorefrontIcon className="text-brand-cyan text-5xl mb-4" />
  },
  {
    titulo: 'Lounge e Descanso',
    descricao: 'Área climatizada para relaxar ou fazer networking.',
    icone: <WeekendIcon className="text-brand-cyan text-5xl mb-4" />
  },
  {
    titulo: 'Armários Inteligentes',
    descricao: 'Tranque e destranque seu armário usando o celular.',
    icone: <LockIcon className="text-brand-cyan text-5xl mb-4" />
  },
  {
    titulo: 'Acesso Facial',
    descricao: 'Entrada liberada por biometria facial, sem catracas.',
    icone: <FaceIcon className="text-brand-cyan text-5xl mb-4" />
  }
]

export default function Diferenciais() {
  return (
    <section id="diferenciais" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase text-brand-dark mb-4">
            A Experiência <span className="text-brand-cyan">Codefit</span>
          </h2>
          <p className="text-brand-gray max-w-2xl mx-auto">
            Muito mais que uma academia. Um ecossistema completo pensado para o
            seu conforto e performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 text-center">
          {listaDiferenciais.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-6">
              {item.icone}
              <h3 className="text-lg font-bold uppercase mb-2 text-brand-dark">
                {item.titulo}
              </h3>
              <p className="text-brand-gray leading-relaxed">
                {item.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
