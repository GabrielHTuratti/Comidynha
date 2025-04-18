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
import type { SetStateAction } from "react"

interface EditMealDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onEditMeal: () => void
  refeicaoAtual: IRefeicao | null
  updateRefeicaoAtual: (updates: SetStateAction<IRefeicao | null>) => void
  updateRefeicaoAtualDesc: (updates: nutridesc) => void
  updateRefeicaoAtualExtra: (id:string, newkey: string, newvalue: string) => void
  removeRefeicaoAtualExtra: (key: string) => void
  addCurrentExtraField: () => void
}


export function EditMealDialog({
  isOpen,
  onOpenChange,
  onEditMeal,
  refeicaoAtual,
  updateRefeicaoAtual,
  updateRefeicaoAtualDesc,
  removeRefeicaoAtualExtra,
  updateRefeicaoAtualExtra,
  addCurrentExtraField,
}: EditMealDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Editar Refeição</DialogTitle>
          <DialogDescription>Atualize os detalhes da sua refeição.</DialogDescription>
        </DialogHeader>
        {refeicaoAtual && (
          <div className="grid gap-4 py-4 overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={refeicaoAtual.nome}
                onChange={(e) => updateRefeicaoAtual({ ...refeicaoAtual, nome: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-desc">Descrição Nutricional</Label>
              <Label htmlFor="edit-gordura">Gordura</Label>
              <Input
                id="edit-gordura"
                type="number"
                value={refeicaoAtual.desc.gorduras}
                onChange={(e) => updateRefeicaoAtualDesc({ gorduras: e.target.value })}
              />
              <Label htmlFor="edit-prot">Proteina</Label>
              <Input
                id="edit-prot"
                type="number"
                value={refeicaoAtual.desc.proteinas}
                onChange={(e) => updateRefeicaoAtualDesc({ proteinas: e.target.value })}
              />
              <Label htmlFor="edit-carb">Carboidrato</Label>
              <Input
                id="edit-carb"
                type="number"
                value={refeicaoAtual.desc.carboidratos}
                onChange={(e) => updateRefeicaoAtualDesc({ carboidratos: e.target.value })}
              />
            </div>
            {refeicaoAtual.desc.extra?.map((campo) => (
              <div key={campo.campoid} className="grid grid-cols-3 gap-2 items-end">
                <div className="grid gap-2">
                  <Label>Nome</Label>
                  <Input
                    value={campo.nome}
                    onChange={(e) => {
                      updateRefeicaoAtualExtra(campo.campoid, e.target.value, campo.valor)
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Valor</Label>
                  <Input value={campo.valor} onChange={(e) => {
                    updateRefeicaoAtualExtra(campo.campoid, campo.nome, e.target.value);
                  }}
                />
                </div>
                <Button variant="destructive" onClick={() => removeRefeicaoAtualExtra(campo.campoid)}>
                  Remover
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={addCurrentExtraField}>
              Adicionar Campo Extra
            </Button>
            <div className="grid gap-2">
              <Label htmlFor="edit-calorias">Calorias</Label>
              <Input
                id="edit-calorias"
                type="number"
                value={refeicaoAtual.calorias || ""}
                onChange={(e) =>
                  updateRefeicaoAtual({ ...refeicaoAtual, calorias: Number.parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-datetime">Data e Hora</Label>
              <Input
                id="edit-datetime"
                type="datetime-local"
                value={IsoStringToDate(refeicaoAtual.data)}
                onChange={(e) => updateRefeicaoAtual({ ...refeicaoAtual, data: dateToIsoString(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Tipo de Refeição</Label>
              <Select
                value={refeicaoAtual.tipo}
                onValueChange={(value) => updateRefeicaoAtual({ ...refeicaoAtual, tipo: value as RefeicaoTipo })}
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
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={onEditMeal}
            disabled={!refeicaoAtual?.nome || !refeicaoAtual?.calorias}
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
