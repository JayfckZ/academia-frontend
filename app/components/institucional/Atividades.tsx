'use client'

import { useState } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined'

const gradeHorarios = {
  Segunda: [
    { horario: '06:00', modalidade: 'Funcional', professor: 'Carlos Silva' },
    { horario: '18:00', modalidade: 'Muay Thai', professor: 'Mestre Bruno' },
    { horario: '19:00', modalidade: 'Pilates', professor: 'Ana Clara' },
    {
      horario: '20:00',
      modalidade: 'Musculação (Avançado)',
      professor: 'Equipe'
    }
  ],
  Terça: [
    { horario: '07:00', modalidade: 'Spinning', professor: 'Beto Costa' },
    {
      horario: '18:30',
      modalidade: 'Cross Training',
      professor: 'Carlos Silva'
    },
    { horario: '19:30', modalidade: 'Jiu Jitsu', professor: 'Mestre João' }
  ],
  Quarta: [
    { horario: '06:00', modalidade: 'Funcional', professor: 'Carlos Silva' },
    { horario: '18:00', modalidade: 'Muay Thai', professor: 'Mestre Bruno' },
    { horario: '19:00', modalidade: 'Yoga', professor: 'Marina Leão' },
    {
      horario: '20:00',
      modalidade: 'Musculação (Iniciante)',
      professor: 'Equipe'
    }
  ],
  Quinta: [
    { horario: '07:00', modalidade: 'Spinning', professor: 'Beto Costa' },
    {
      horario: '18:30',
      modalidade: 'Cross Training',
      professor: 'Carlos Silva'
    },
    { horario: '19:30', modalidade: 'Jiu Jitsu', professor: 'Mestre João' }
  ],
  Sexta: [
    { horario: '06:00', modalidade: 'Funcional', professor: 'Carlos Silva' },
    {
      horario: '18:00',
      modalidade: 'Muay Thai (Sparring)',
      professor: 'Mestre Bruno'
    },
    { horario: '19:00', modalidade: 'Pilates', professor: 'Ana Clara' }
  ],
  Sábado: [
    {
      horario: '09:00',
      modalidade: 'Cross Training',
      professor: 'Carlos Silva'
    },
    { horario: '10:30', modalidade: 'Aulão Aberto', professor: 'Equipe' }
  ]
}

type DiaDaSemana = keyof typeof gradeHorarios

export default function Atividades() {
  const [diaAtivo, setDiaAtivo] = useState<DiaDaSemana>('Segunda')
  const dias = Object.keys(gradeHorarios) as DiaDaSemana[]

  return (
    <section id="atividades" className="py-24 bg-brand-dark text-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black uppercase mb-4">
            Grade de <span className="text-brand-cyan">Horários</span>
          </h2>
          <p className="text-brand-gray">
            Programe sua rotina de treinos na Codefit.
          </p>
        </div>

        {/* Navegação dos Dias da Semana */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2 border-b border-white/10 justify-start md:justify-center">
          {dias.map((dia) => (
            <button
              key={dia}
              onClick={() => setDiaAtivo(dia)}
              className={`px-6 py-3 font-bold uppercase text-sm whitespace-nowrap cursor-pointer transition-all rounded-t-sm ${
                diaAtivo === dia
                  ? 'text-brand-cyan border-b-2 border-brand-cyan bg-white/5'
                  : 'text-brand-gray hover:text-white hover:bg-white/5'
              }`}
            >
              {dia}
            </button>
          ))}
        </div>

        <div className="bg-[#151515] border border-white/5 rounded-sm p-4 md:p-8 min-h-75">
          {gradeHorarios[diaAtivo].length > 0 ? (
            <div className="flex flex-col gap-4">
              {gradeHorarios[diaAtivo].map((aula, index) => (
                <div
                  key={index}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-brand-dark border border-white/5 hover:border-brand-cyan/50 transition-colors rounded-sm"
                >
                  <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <div className="flex items-center gap-2 text-brand-cyan font-mono text-xl font-bold">
                      <AccessTimeIcon fontSize="small" />
                      {aula.horario}
                    </div>

                    <div className="text-lg font-bold uppercase tracking-wider text-white">
                      {aula.modalidade}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 border-t border-white/10 md:border-t-0 pt-4 md:pt-0">
                    <div className="flex items-center gap-2 text-brand-gray text-sm">
                      <PersonOutlineIcon fontSize="small" />
                      {aula.professor}
                    </div>

                    <button className="text-xs font-mono cursor-pointer text-brand-cyan uppercase border border-brand-cyan px-3 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-cyan hover:text-brand-dark">
                      Agendar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-brand-gray">
              Nenhuma aula programada para este dia.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
