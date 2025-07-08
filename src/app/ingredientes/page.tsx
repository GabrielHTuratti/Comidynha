import IngredientDetector from "@/components/ingredientes/ingredient-detector"

export default function IngredientesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Ingredientes</h1>
          <p className="text-gray-600 mt-2">
            Detecte e cadastre ingredientes automaticamente usando inteligência artificial
          </p>
        </div>

        <IngredientDetector />
      </div>
    </div>
  )
}
