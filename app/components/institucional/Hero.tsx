export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-brand-dark overflow-hidden">
      <div className="absolute inset-0 bg-brand-dark/70 z-10"></div>
      <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat opacity-50"></div>

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-20">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-6">
          Eleve seu nível
          <br />
          <span className="text-brand-cyan">Otimize</span> seu corpo
        </h1>
        <p className="text-brand-gray text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          A primeira academia desenhada para quem busca alta performance física
          aliada à precisão tecnológica.
        </p>
        <a
          href="#planos"
          className="inline-block bg-brand-cyan text-brand-dark font-bold text-lg px-10 py-4 uppercase tracking-wider rounded-sm hover:scale-105 transition-transform"
        >
          Começar agora
        </a>
      </div>
    </section>
  )
}
