import Link from 'next/link'
import Image from 'next/image'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center h-full">
          <Image
            src="/logo-3.png"
            alt="Codefit Logo"
            width={160}
            height={40}
            priority
            className="object-contain"
          />
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-brand-light uppercase tracking-wider">
          <Link
            href="#diferenciais"
            className="hover:text-brand-cyan transition-colors"
          >
            Diferenciais
          </Link>
          <Link
            href="#atividades"
            className="hover:text-brand-cyan transition-colors"
          >
            Atividades
          </Link>
          <Link
            href="#planos"
            className="hover:text-brand-cyan transition-colors"
          >
            Planos
          </Link>
          <Link
            href="#contato"
            className="hover:text-brand-cyan transition-colors"
          >
            Contato
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-block border border-brand-cyan text-brand-cyan px-6 py-2 font-bold uppercase text-sm rounded hover:bg-brand-cyan hover:text-brand-dark transition-colors"
          >
            Área do colaborador
          </Link>

          {/* <Link
            href="#planos"
            className="bg-brand-cyan text-brand-dark px-6 py-2 font-bold uppercase text-sm rounded hover:bg-white transition-colors"
          >
            Matricule-se
          </Link> */}
        </div>
      </div>
    </header>
  )
}
