export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col">
      <header className="py-5 text-center">
        <span className="text-2xl font-bold text-indigo-700">Marki</span>
      </header>
      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  )
}
