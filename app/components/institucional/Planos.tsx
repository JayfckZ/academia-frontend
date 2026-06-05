import CheckIcon from '@mui/icons-material/Check'
import { getPlans, PlanDurationType } from '../../services/plans'

const formatDuration = (duration: number, type: PlanDurationType) => {
  if (type === 'MONTHS' && duration === 1) return '/mês'
  if (type === 'MONTHS') return `/${duration} meses`
  if (type === 'YEARS') return '/ano'
  if (type === 'WEEKS') return `/${duration} semanas`
  return `/${duration} dias`
}

export default async function Planos() {
  const plans = await getPlans()
  const activePlans = Array.isArray(plans)
    ? plans.filter((plan) => plan.active)
    : []

  return (
    <section id="planos" className="py-24 bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-black uppercase text-center mb-16">
          Escolha seu <span className="text-brand-cyan">Plano</span>
        </h2>

        {activePlans.length === 0 && (
          <div className="text-center text-brand-gray bg-white/5 p-8 rounded-sm">
            Nenhum plano disponível no momento.
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto items-center">
          {activePlans.map((plan, index) => {
            const isHighlighted = index === 1
            const numericPrice =
              typeof plan.price === 'string'
                ? parseFloat(plan.price)
                : plan.price
            const [inteiro, centavos] = (numericPrice || 0)
              .toFixed(2)
              .split('.')
            const benefitsList = plan.description
              ? String(plan.description)
                  .split(',')
                  .map((b) => b.trim())
              : []

            return (
              <div
                key={plan.id}
                className={`flex-1 min-w-75 max-w-87.5 p-8 rounded-sm relative transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-[#151515] border-2 border-brand-cyan md:-translate-y-4 shadow-[0_0_30px_rgba(0,180,216,0.15)] py-10'
                    : 'bg-[#151515] border border-white/5'
                }`}
              >
                {isHighlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-cyan text-brand-dark text-xs font-bold px-4 py-1 uppercase tracking-widest rounded-full shadow-lg">
                    Mais Popular
                  </div>
                )}

                <h3
                  className={`text-xl font-bold mb-2 ${isHighlighted ? 'text-brand-cyan' : 'text-brand-gray'}`}
                >
                  {plan.name}
                </h3>

                <div className="font-mono mb-6 flex items-baseline">
                  <span className="text-xl mr-1">R$</span>
                  <span className="text-4xl font-bold">{inteiro}</span>
                  <span className="text-lg">,{centavos}</span>
                  <span className="text-sm text-brand-gray ml-1">
                    {formatDuration(plan.duration, plan.durationType)}
                  </span>
                </div>

                <ul className="space-y-4 mb-8 min-h-40">
                  {benefitsList.map((benefit, i) => (
                    <li
                      key={i}
                      className={`flex gap-3 text-sm ${isHighlighted ? 'text-white' : 'text-gray-300'}`}
                    >
                      <CheckIcon
                        className={
                          isHighlighted ? 'text-brand-cyan' : 'text-brand-gray'
                        }
                        fontSize="small"
                      />
                      <span className="leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 uppercase font-bold text-sm cursor-pointer transition-colors rounded-sm ${
                    isHighlighted
                      ? 'bg-brand-cyan text-brand-dark hover:bg-white'
                      : 'border border-brand-gray text-brand-gray hover:text-white hover:border-white'
                  }`}
                >
                  Assinar {plan.name}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
