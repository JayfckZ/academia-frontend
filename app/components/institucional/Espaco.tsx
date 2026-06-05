import Image from 'next/image'

export default function Espaco() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-black uppercase text-center mb-16 text-brand-dark">
          Conheça o Espaço
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          <div className="relative md:col-span-2 rounded-sm overflow-hidden group">
            <Image
              src="/espaco-principal.png"
              alt="Área de Musculação"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-brand-cyan/20 transition-colors pointer-events-none"></div>
          </div>

          <div className="relative rounded-sm overflow-hidden group">
            <Image
              src="/espaco-cardio.png"
              alt="Equipamentos de Cardio"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-brand-cyan/20 transition-colors pointer-events-none"></div>
          </div>

          <div className="relative rounded-sm overflow-hidden group">
            <Image
              src="/espaco-peso.png"
              alt="Equipamentos de qualidade"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-brand-cyan/20 transition-colors pointer-events-none"></div>
          </div>

          <div className="relative rounded-sm overflow-hidden group">
            <Image
              src="/espaco-area.png"
              alt="Área"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-brand-cyan/20 transition-colors pointer-events-none"></div>
          </div>

          <div className="relative rounded-sm overflow-hidden group">
            <Image
              src="/espaco-aberto.png"
              alt="Espaço de aulas livres"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-brand-cyan/20 transition-colors pointer-events-none"></div>
          </div>

          {/* Foto 6 - Larga (Ocupa 2 colunas no desktop) */}
          <div className="relative md:col-span-2 rounded-sm overflow-hidden group">
            <Image
              src="/espaco-recepcao.png"
              alt="Recepção"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-brand-cyan/20 transition-colors pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
