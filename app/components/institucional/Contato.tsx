import WhatsAppIcon from '@mui/icons-material/WhatsApp'

export default function Contato() {
  return (
    <section id="contato" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-black uppercase text-brand-dark mb-6">
            Venha Treinar <br />
            Com A Gente
          </h2>
          <p className="text-brand-gray mb-8">
            Nossa equipe está pronta para apresentar o espaço e alinhar seus
            objetivos.
          </p>

          <div className="space-y-4 mb-8">
            <p>
              <strong>Endereço:</strong> Rua Venceslau, 192 - Méier, Rio de
              Janeiro - RJ
            </p>
            <p>
              <strong>Horário:</strong> Seg a Sex: 05h às 22h | Sáb, Dom e
              Feriados: 08h às 14h
            </p>
          </div>

          <a
            href=""
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded font-bold hover:bg-[#20bd5a] transition-colors"
          >
            <WhatsAppIcon /> Chamar no WhatsApp
          </a>
        </div>

        <div className="bg-gray-200 rounded-sm w-full h-80 md:h-full min-h-87.5 overflow-hidden shadow-inner border border-black/5 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d738.2236464259094!2d-43.2846120224198!3d-22.901629997568783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9962ffb27c3cbb%3A0x2b19ce434a8b927f!2sUniCarioca!5e1!3m2!1spt-BR!2sbr!4v1780679281256!5m2!1spt-BR!2sbr"
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Codefit"
          ></iframe>
        </div>
      </div>
    </section>
  )
}
