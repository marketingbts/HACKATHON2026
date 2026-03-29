'use client'

import { useState } from 'react'
import { AIBadge } from '@/components/ui/AIBadge'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CalendarList, CalendarRow } from '@/components/ui/CalendarRow'
import { ContentCard } from '@/components/ui/ContentCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { GeneratedContentCard } from '@/components/ui/GeneratedContentCard'
import { GoalOption } from '@/components/ui/GoalOption'
import { InputField } from '@/components/ui/InputField'
import { MarkiExplain } from '@/components/ui/MarkiExplain'
import { Multiselect } from '@/components/ui/Multiselect'
import { NavItem } from '@/components/ui/NavItem'
import { QuickAction } from '@/components/ui/QuickAction'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Select } from '@/components/ui/Select'
import { SideNavBar } from '@/components/ui/SideNavBar'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { Textarea } from '@/components/ui/Textarea'
import { TopNavBar } from '@/components/ui/TopNavBar'
import { ContentDetailModal } from '@/components/ui/ContentDetailModal'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="border-b border-border-light pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-ui-muted">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-neutral-500">{label}</span>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

const RUBRO_OPTIONS = [
  { value: 'panaderia', label: 'Panadería / Pastelería' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'moda', label: 'Moda / Indumentaria' },
  { value: 'fitness', label: 'Fitness / Bienestar' },
  { value: 'tecnologia', label: 'Tecnología' },
]

const AUDIENCE_OPTIONS = [
  { value: 'mamas', label: 'Mamás del barrio' },
  { value: 'jovenes', label: 'Jóvenes 18-25' },
  { value: 'profesionales', label: 'Profesionales 30-45' },
  { value: 'adultos', label: 'Adultos mayores' },
]

const GOAL_OPTIONS = [
  {
    value: 'vender',
    title: 'Vender más',
    description: 'Enfocado en conversión y CTA claro.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.5 5.1 17.2l.9-5.5L2 7.8l5.5-.8L10 2z"
          fill="#16a34a" />
      </svg>
    ),
  },
  {
    value: 'comunidad',
    title: 'Construir comunidad',
    description: 'Engagement, seguidores fieles y presencia.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="8" r="3" fill="#16a34a" />
        <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 'marca',
    title: 'Posicionar mi marca',
    description: 'Reconocimiento, autoridad y diferenciación.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="10" width="3" height="7" rx="1" fill="#16a34a" />
        <rect x="8.5" y="6" width="3" height="11" rx="1" fill="#16a34a" />
        <rect x="14" y="2" width="3" height="15" rx="1" fill="#16a34a" />
      </svg>
    ),
  },
]

const BOLT_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"
      fill="#4648d4" stroke="#4648d4" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)

const CALENDAR_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke="#006c49" strokeWidth="1.5" />
    <path d="M3 9h18" stroke="#006c49" strokeWidth="1.5" />
    <path d="M8 2v4M16 2v4" stroke="#006c49" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const LIST_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8 6h13M8 12h13M8 18h13" stroke="#515f74" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="3" cy="6" r="1" fill="#515f74" />
    <circle cx="3" cy="12" r="1" fill="#515f74" />
    <circle cx="3" cy="18" r="1" fill="#515f74" />
  </svg>
)

export default function UiKitPage() {
  const [selectValue, setSelectValue] = useState('')
  const [multiValue, setMultiValue] = useState<string[]>([])
  const [goalValue, setGoalValue] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<any>(null)

  return (
    <main className="min-h-screen bg-[#faf4f7] px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-brand-900">UI Kit — Marki</h1>
          <p className="text-sm text-neutral-500">Vista previa de componentes del design system.</p>
        </div>

        {/* ── BUTTON ── */}
        <Section title="Button">
          <Row label="primary">
            <Button variant="primary">Continuar</Button>
          </Row>
          <Row label="secondary">
            <Button variant="secondary">Continuar</Button>
          </Row>
          <Row label="outline">
            <Button variant="outline">Continuar</Button>
          </Row>
          <Row label="ghost (disabled)">
            <Button variant="ghost">Continuar</Button>
          </Row>
          <Row label="link">
            <Button variant="link">Ver más</Button>
          </Row>
          <Row label="card-primary">
            <div className="w-48">
              <Button variant="card-primary">Ver calendario</Button>
            </div>
          </Row>
          <Row label="card-secondary">
            <div className="w-48">
              <Button variant="card-secondary">Ver detalle</Button>
            </div>
          </Row>
        </Section>

        {/* ── INPUT FIELD ── */}
        <Section title="Input Field">
          <Row label="default (vacío)">
            <div className="w-full">
              <InputField
                id="preview-input-default"
                label="Audiencia principal"
                placeholder="Ej: Madres de familia del barrio, 30–50 años"
              />
            </div>
          </Row>
          <Row label="filled (con valor)">
            <div className="w-full">
              <InputField
                id="preview-input-filled"
                label="Nombre del negocio"
                defaultValue="Café del Sur"
              />
            </div>
          </Row>
        </Section>

        {/* ── TEXTAREA ── */}
        <Section title="Textarea">
          <Row label="default (vacío)">
            <div className="w-full">
              <Textarea
                id="preview-textarea-default"
                label="¿Qué problema les resolvés?"
                placeholder="Ej: Tienen poco tiempo y quieren desayunos ricos y caseros sin cocinar"
              />
            </div>
          </Row>
          <Row label="filled (con valor)">
            <div className="w-full">
              <Textarea
                id="preview-textarea-filled"
                label="Descripción del negocio"
                defaultValue="Somos una panadería artesanal que elabora pan de masa madre todos los días desde las 6am."
              />
            </div>
          </Row>
        </Section>

        {/* ── SELECT ── */}
        <Section title="Select">
          <Row label="interactivo">
            <div className="w-full">
              <Select
                id="preview-select"
                label="Rubro"
                options={RUBRO_OPTIONS}
                value={selectValue}
                onChange={setSelectValue}
                placeholder="Seleccioná un rubro"
              />
            </div>
          </Row>
        </Section>

        {/* ── STEP INDICATOR ── */}
        <Section title="Step Indicator">
          <Row label="paso 1 de 3">
            <StepIndicator currentStep={1} totalSteps={3} />
          </Row>
          <Row label="paso 2 de 3">
            <StepIndicator currentStep={2} totalSteps={3} />
          </Row>
          <Row label="paso 3 de 3">
            <StepIndicator currentStep={3} totalSteps={3} />
          </Row>
          <Row label="interactivo">
            <div className="flex flex-col items-start gap-4">
              <StepIndicator currentStep={currentStep} totalSteps={3} />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                >
                  Anterior
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep((s) => Math.min(3, s + 1))}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </Row>
        </Section>

        {/* ── BADGE ── */}
        <Section title="Badge">
          <Row label="closeable=false">
            <Badge label="Reel" />
            <Badge label="Post" />
            <Badge label="Carrusel" />
          </Row>
          <Row label="closeable=true">
            <Badge label="Reel" closeable onClose={() => { }} />
            <Badge label="Historia" closeable onClose={() => { }} />
          </Row>
        </Section>

        {/* ── MULTISELECT ── */}
        <Section title="Multiselect">
          <Row label="interactivo">
            <div className="w-full">
              <Multiselect
                id="preview-multiselect"
                label="Audiencia"
                options={AUDIENCE_OPTIONS}
                value={multiValue}
                onChange={setMultiValue}
                onCreateNew={(label) => alert(`Crear: ${label}`)}
                placeholder="Seleccioná audiencias"
              />
            </div>
          </Row>
        </Section>

        {/* ── GOAL OPTION ── */}
        <Section title="Goal Option">
          <Row label="interactivo">
            <fieldset className="flex w-full flex-col gap-3">
              <legend className="sr-only">Objetivo de negocio</legend>
              {GOAL_OPTIONS.map((opt) => (
                <GoalOption
                  key={opt.value}
                  name="goal"
                  value={opt.value}
                  title={opt.title}
                  description={opt.description}
                  icon={opt.icon}
                  checked={goalValue === opt.value}
                  onChange={setGoalValue}
                />
              ))}
            </fieldset>
          </Row>
        </Section>

        {/* ── QUICK ACTION ── */}
        <Section title="Quick Action">
          <Row label="todas las variantes">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap">
              <QuickAction
                variant="fast-create"
                title="Generación Rápida"
                description="Crea posts, captions y hashtags en menos de 30 segundos con IA."
                ctaLabel="Empezar a crear"
                icon={BOLT_ICON}
              />
              <QuickAction
                variant="create-plan"
                title="Plan de Contenido"
                description="Diseñá un mes completo de publicaciones alineadas a tu objetivo."
                ctaLabel="Diseñar mes"
                icon={CALENDAR_ICON}
              />
              <QuickAction
                variant="view-plans"
                title="Mis Planes"
                description="Revisá y editá todos los planes de contenido que ya creaste."
                ctaLabel="Ir a mi historial"
                icon={LIST_ICON}
              />
            </div>
          </Row>
        </Section>

        {/* ── AI BADGE ── */}
        <Section title="AI Badge">
          <Row label="variantes de label">
            <AIBadge label="IA Activa" />
            <AIBadge label="Explicación de Marki" />
            <AIBadge label="Generado por IA" />
          </Row>
        </Section>

        {/* ── SECTION HEADER ── */}
        <Section title="Section Header">
          <Row label="h2 con subtítulo">
            <SectionHeader
              title="Tu plan de contenido"
              subtitle="Basado en tu objetivo y audiencia, Marki creó esto para vos."
            />
          </Row>
          <Row label="h2 sin subtítulo">
            <SectionHeader title="Resultados generados" />
          </Row>
          <Row label="h3 con subtítulo">
            <SectionHeader
              level={3}
              title="Publicaciones de la semana"
              subtitle="Revisá y editá cada pieza antes de publicar."
            />
          </Row>
        </Section>

        {/* ── MARKI EXPLAIN ── */}
        <Section title="Marki Explain">
          <Row label="con contenido">
            <MarkiExplain
              content={`Creé este plan teniendo en cuenta que tu audiencia principal son madres de 30 a 50 años que valoran los desayunos caseros.\n\nPrioritizo contenido visual (Reels y Carruseles) porque genera hasta 3x más alcance en ese segmento.`}
            />
          </Row>
        </Section>

        {/* ── CONTENT CARD ── */}
        <Section title="Content Card">
          <Row label="completa (con recomendado)">
            <ContentCard
              copy="5 razones para empezar el día con pan de masa madre y descubrir los secretos de la fermentación natural en Marki"
              description="Un carrusel pensado para generar engagement y educar a tu audiencia sobre los beneficios del pan artesanal."
              date="Lunes 31 mar · 9:00 AM"
              dateTime="2025-03-31T09:00"
              title="5 razones para empezar el día con pan de masa madre y descubrir los secretos de la fermentación natural en Marki"
              socialNetwork="Instagram"
              format="Carrusel"
              recommended
              onViewMore={() => {
                setSelectedContent({
                  date: "Lunes 31 mar · 9:00 AM",
                  title: "5 razones para empezar el día con pan de masa madre y descubrir los secretos de la fermentación natural en Marki",
                  description: "Un carrusel pensado para generar engagement y educar a tu audiencia sobre los beneficios del pan artesanal.\n\nContenido detallado para la audiencia seleccionada.",
                  socialNetwork: "Instagram",
                  format: "Carrusel"
                })
                setDetailModalOpen(true)
              }}
              onEdit={() => { }}
            />
          </Row>
          <Row label="sin imagen de overlay ni recomendado">
            <ContentCard
              copy="Croissants hojaldrados recien salidos del horno cada manana"
              description="Post educativo sobre el proceso artesanal, ideal para posicionar la marca."
              date="Miércoles 2 abr · 12:00 PM"
              dateTime="2025-04-02T12:00"
              title="¿Sabés qué tiene de especial nuestra harina?"
              onViewMore={() => { }}
              onEdit={() => { }}
            />
          </Row>
        </Section>

        {/* ── GENERATED CONTENT CARD ── */}
        <Section title="Generated Content Card">
          <Row label="con imageHint y recomendado">
            <GeneratedContentCard
              content={`🥐 Cada mañana, antes de que el barrio despierte, nuestras manos ya están en la masa.\n\nPan de masa madre, croissants hojaldrados y medialunas que salen del horno a las 6AM — para que vos empieces el día como te merecés.\n\n#PanArtesanal #MasaMadre #Panadería`}
              imageHint="Sugerencia IA: usá una foto cálida del horno o de tus manos amasando — genera más conexión emocional."
              recommended
              onRegenerate={() => { }}
              onCopy={() => { }}
              onSave={() => { }}
            />
          </Row>
          <Row label="sin imageHint ni recomendado">
            <GeneratedContentCard
              content={`¿Conocés la diferencia entre el pan común y el pan de masa madre?\n\nNuestro fermento tiene más de 2 años de vida. Eso se nota en el sabor, la textura y en cómo te hace sentir.\n\n👇 Guardá este post para compartirlo.`}
              onRegenerate={() => { }}
              onCopy={() => { }}
              onSave={() => { }}
            />
          </Row>
        </Section>

        {/* ── NAV ITEM ── */}
        <Section title="Nav Item">
          <Row label="default">
            <NavItem
              href="#"
              label="Dashboard"
              icon={
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                  <rect x="1" y="1" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="1" y="11" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="11" y="1" width="6" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="11" y="8" width="6" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
            />
          </Row>
          <Row label="active">
            <NavItem
              href="#"
              label="Generación Rápida"
              active
              icon={
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                  <path d="M10.5 1.5L2 11h7l-1.5 7.5L16 9h-7l1.5-7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              }
            />
          </Row>
        </Section>

        {/* ── SIDE NAV BAR ── */}
        <Section title="Side Nav Bar">
          <Row label="con activeItem=fast-create">
            <div className="relative h-64 w-60 overflow-hidden rounded-lg border border-border-light">
              <div className="absolute inset-0 overflow-hidden">
                <SideNavBar activeItem="fast-create" />
              </div>
            </div>
          </Row>
        </Section>

        {/* ── TOP NAV BAR ── */}
        <Section title="Top Nav Bar">
          <Row label="simulado (sin fixed)">
            <div className="relative w-full overflow-hidden rounded-lg border border-border-light">
              <header className="w-full h-[60px] px-6 flex items-center justify-between bg-utility-overlay-white-80 backdrop-blur-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <p className="text-sm font-semibold text-neutral-900 tracking-[0.7px] uppercase m-0">
                  BUENOS DÍAS, MATIAS
                </p>
                <div className="flex items-center gap-3">
                  <button type="button" aria-label="Ajustes" className="w-5 h-5 flex items-center justify-center text-neutral-600">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-surface-primary-ghost border border-brand text-xs font-semibold text-brand">
                    M
                  </div>
                </div>
              </header>
            </div>
          </Row>
        </Section>

        {/* ── CALENDAR ROW ── */}
        <Section title="Calendar Row">
          <Row label="lista de 3 filas">
            <div className="w-full">
              <CalendarList>
                <CalendarRow date="Lun 4 Ago" time="10:00 AM" title="5 razones para comer pan artesanal" contentType="Carrusel" socialNetwork="Instagram" />
                <CalendarRow date="Mié 6 Ago" time="12:00 PM" title="¿Qué hace especial a nuestra harina?" contentType="Post" socialNetwork="Instagram" />
                <CalendarRow date="Vie 8 Ago" time="9:00 AM" title="Detrás de escena: el proceso de amasado" contentType="Reel" socialNetwork="Instagram" />
              </CalendarList>
            </div>
          </Row>
        </Section>

        {/* ── CONTENT DETAIL MODAL ── */}
        <Section title="Content Detail Modal">
          <Row label="ejemplo">
            <Button variant="outline" onClick={() => {
              setSelectedContent({
                date: "Lunes 31 mar · 9:00 AM",
                title: "Título de Ejemplo para Modal",
                description: "Esta es una descripción detallada que aparece dentro del modal cuando el usuario hace clic en 'Ver más'. Permite leer todo el contenido generado sin restricciones de espacio.",
                socialNetwork: "Instagram",
                format: "Carrusel"
              })
              setDetailModalOpen(true)
            }}>
              Abrir Modal de Detalle
            </Button>
            <ContentDetailModal
              isOpen={detailModalOpen}
              onClose={() => setDetailModalOpen(false)}
              content={selectedContent}
            />
          </Row>
        </Section>

        {/* ── EMPTY STATE ── */}
        <Section title="Empty State">
          <Row label="con CTA">
            <EmptyState
              title="No tenés planes todavía"
              description="Empezá creando tu primer plan de contenido con IA."
              ctaLabel="Crear plan"
              onCta={() => { }}
            />
          </Row>
          <Row label="sin CTA">
            <EmptyState
              title="No hay resultados"
              description="Intentá con otro período o creá contenido nuevo."
            />
          </Row>
        </Section>

      </div>
    </main>
  )
}
