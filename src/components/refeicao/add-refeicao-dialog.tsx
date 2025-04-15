"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IsoStringToDate, dateToIsoString } from "@/lib/utils-refeicao"
import type { IRefeicao, nutridesc, RefeicaoTipo } from "@/model/refeicao"

interface AddMealDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddMeal: () => void
  refeicaoNova: Omit<IRefeicao, "_id">
  updateRefeicaoNova: (updates: Omit<IRefeicao, "_id">) => void
  updateRefeicaoNovaDesc: (updates: nutridesc) => void
  updateRefeicaoNovaExtra: (key: string, value: string) => void
  removeRefeicaoNovaExtra: (key: string) => void
  addNewExtraField: () => void
}

export function AddMealDialog({
  isOpen,
  onOpenChange,
  onAddMeal,
  refeicaoNova,
  updateRefeicaoNova,
  updateRefeicaoNovaDesc,
  updateRefeicaoNovaExtra,
  removeRefeicaoNovaExtra,
  addNewExtraField,
}: AddMealDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Refeição</DialogTitle>
          <DialogDescription>Preencha os detalhes da sua refeição abaixo.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto pr-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={refeicaoNova.nome}
              onChange={(e) => updateRefeicaoNova({ ...refeicaoNova, nome: e.target.value })}
              placeholder="Ex: Salada com frango grelhado"
            />
          </div>
          <div className="grid gap-2">
            <Label>Informações Nutricionais</Label>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Proteínas (g)</Label>
                <Input
                  value={refeicaoNova.desc.proteinas}
                  onChange={(e) => updateRefeicaoNovaDesc({ proteinas: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Carboidratos (g)</Label>
                <Input
                  value={refeicaoNova.desc.carboidratos}
                  onChange={(e) => updateRefeicaoNovaDesc({ carboidratos: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Gorduras (g)</Label>
                <Input
                  value={refeicaoNova.desc.gorduras}
                  onChange={(e) => updateRefeicaoNovaDesc({ gorduras: e.target.value })}
                />
              </div>

              {Object.entries(refeicaoNova.desc.extra || {}).map(([key, value], index) => (
                <div key={index} className="grid grid-cols-3 gap-2 items-end">
                  <div className="grid gap-2">
                    <Label>Nome</Label>
                    <Input
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value
                        const newValue = value
                        removeRefeicaoNovaExtra(key)
                        updateRefeicaoNovaExtra(newKey, newValue)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Valor</Label>
                    <Input value={value} onChange={(e) => updateRefeicaoNovaExtra(key, e.target.value)} />
                  </div>
                  <Button variant="destructive" onClick={() => removeRefeicaoNovaExtra(key)}>
                    Remover
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addNewExtraField}>
                Adicionar Campo Extra
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="calorias">Calorias</Label>
            <Input
              id="calorias"
              type="number"
              value={refeicaoNova.calorias || ""}
              onChange={(e) => updateRefeicaoNova({ ...refeicaoNova, calorias: Number.parseInt(e.target.value) || 0 })}
              placeholder="Ex: 350"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="datetime">Data e Hora</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={IsoStringToDate(refeicaoNova.data)}
              onChange={(e) => updateRefeicaoNova({ ...refeicaoNova, data: dateToIsoString(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo de Refeição</Label>
            <Select
              value={refeicaoNova.tipo}
              onValueChange={(value) => updateRefeicaoNova({ ...refeicaoNova, tipo: value as RefeicaoTipo })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cafe-da-manha">Café da manhã</SelectItem>
                <SelectItem value="almoco">Almoço</SelectItem>
                <SelectItem value="lanche-da-tarde">Lanche da tarde</SelectItem>
                <SelectItem value="janta">Janta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={onAddMeal}
            disabled={!refeicaoNova.nome || !refeicaoNova.calorias}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
