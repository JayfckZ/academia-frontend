import Link from 'next/link'
import Image from 'next/image'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FacebookIcon from '@mui/icons-material/Facebook'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-dark text-brand-gray border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="text-white font-black tracking-widest text-2xl flex items-center gap-2">
                <span className="text-brand-cyan font-mono">{'{'}</span>
                CODEFIT
                <span className="text-brand-cyan font-mono">{'}'}</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              A primeira academia desenhada para quem busca alta performance
              física aliada à precisão tecnológica. Eleve seu nível.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-cyan hover:text-brand-dark transition-colors"
              >
                <InstagramIcon fontSize="small" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-cyan hover:text-brand-dark transition-colors"
              >
                <YouTubeIcon fontSize="small" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-cyan hover:text-brand-dark transition-colors"
              >
                <FacebookIcon fontSize="small" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-6 tracking-wider text-sm">
              Navegação
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#diferenciais"
                  className="hover:text-brand-cyan transition-colors"
                >
                  Diferenciais
                </Link>
              </li>
              <li>
                <Link
                  href="#atividades"
                  className="hover:text-brand-cyan transition-colors"
                >
                  Horários
                </Link>
              </li>
              <li>
                <Link
                  href="#planos"
                  className="hover:text-brand-cyan transition-colors"
                >
                  Planos e Preços
                </Link>
              </li>
              <li>
                <Link
                  href="#contato"
                  className="hover:text-brand-cyan transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-6 tracking-wider text-sm">
              Suporte
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="hover:text-brand-cyan transition-colors"
                >
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-brand-cyan transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contato@codefit.com"
                  className="hover:text-brand-cyan transition-colors"
                >
                  contato@codefit.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p>© {currentYear} Codefit. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Desenvolvido com <span className="text-brand-cyan">{'<3'}</span> e
            alta performance.
          </p>
        </div>
      </div>
    </footer>
  )
}
