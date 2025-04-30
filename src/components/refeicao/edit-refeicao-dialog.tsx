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
import { useRefeicaoValidation } from "@/hooks/use-refeicaoValidation"

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

  const { errors, validateField, validateForm, validateAllExtras, validateExtraField} = useRefeicaoValidation();

  const handleEditMeal = () => {
    if (refeicaoAtual && validateForm(refeicaoAtual)) {
      onEditMeal();
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!refeicaoAtual) return;
    updateRefeicaoAtual({ ...refeicaoAtual, [field]: value });
    validateField(field, value);
  };

  const handleDescChange = (field: string, value: any) => {
    if (!refeicaoAtual) return;
    const newDesc = { ...refeicaoAtual.desc, [field]: value };
    updateRefeicaoAtualDesc(newDesc);
    validateField(`desc.${field}`, value);
  };
  
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
                maxLength={51}
                placeholder={refeicaoAtual.nome}
                onChange={(e) => handleFieldChange('nome', e.target.value)}
              />
              {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}

            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-desc">Descrição Nutricional</Label>
              <Label htmlFor="edit-gordura">Gordura</Label>
              <Input
                id="edit-gordura"
                value={refeicaoAtual.desc.gorduras}
                max={99999999999}
                type="number"
                onKeyDown={(e) => {
                  if (!/[0-9]|Backspace|Tab|Delete|ArrowLeft|ArrowRight/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputMode="numeric"
                onChange={(e) =>{
                  const value = e.target.value;
                  if (value.length <= 11) { 
                    handleDescChange('gorduras', value);
                  }
                }}
              />
              {errors['desc.gorduras'] && <p className="text-sm text-red-500">{errors['desc.gorduras']}</p>}
              <Label htmlFor="edit-prot">Proteina</Label>
              <Input
                value={refeicaoAtual.desc.proteinas}
                max={99999999999}
                type="number"
                onKeyDown={(e) => {
                  if (!/[0-9]|Backspace|Tab|Delete|ArrowLeft|ArrowRight/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputMode="numeric"
                onChange={(e) =>{
                  const value = e.target.value;
                  if (value.length <= 11) { 
                    handleDescChange('proteinas', value);
                  }
                }}
              />
              {errors['desc.proteinas'] && <p className="text-sm text-red-500">{errors['desc.proteinas']}</p>}
              <Label htmlFor="edit-carb">Carboidrato</Label>
              <Input
                value={refeicaoAtual.desc.carboidratos}
                max={99999999999}
                type="number"
                onKeyDown={(e) => {
                  if (!/[0-9]|Backspace|Tab|Delete|ArrowLeft|ArrowRight/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputMode="numeric"
                onChange={(e) =>{
                  const value = e.target.value;
                  if (value.length <= 11) { 
                    handleDescChange('carboidratos', value);
                  }}}
              />
              {errors['desc.carboidratos'] && <p className="text-sm text-red-500">{errors['desc.carboidratos']}</p>}
            </div>
            {refeicaoAtual.desc.extra?.map((campo, index) => (
              <div key={campo.campoid} className="grid grid-cols-3 gap-2 items-end">
                <div className="grid gap-2">
                  <Label>Nome</Label>
                  <Input
                    value={campo.nome}
                    onChange={(e) => {
                      updateRefeicaoAtualExtra(campo.campoid, e.target.value, campo.valor)
                      validateExtraField(
                        { ...campo, nome: e.target.value },
                        index
                      );
                    }}
                  />
                  {errors[`extra.${index}.nome`] && (
                      <p className="text-sm text-red-500">{errors[`extra.${index}.nome`]}</p>
                    )}
                </div>
                <div className="grid gap-2">
                  <Label>Valor</Label>
                  <Input value={campo.valor} onChange={(e) => {
                    updateRefeicaoAtualExtra(campo.campoid, campo.nome, e.target.value);
                    validateExtraField(
                      { ...campo, valor: e.target.value },
                      index
                    );
                  }} 
                />
                {errors[`extra.${index}.valor`] && (
                    <p className="text-sm text-red-500">{errors[`extra.${index}.valor`]}</p>
                  )}
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
                id="calorias"
                value={refeicaoAtual.calorias || ""}
                placeholder="Ex: 350"
                max={99999999999}
                type="number"
                onKeyDown={(e) => {
                  if (!/[0-9]|Backspace|Tab|Delete|ArrowLeft|ArrowRight/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputMode="numeric"
                onChange={(e) =>{
                  const value = e.target.value;
                  if (value.length <= 11) { 
                    handleFieldChange('calorias', parseInt(value));
                  }
              }}
              />
              {errors.calorias && <p className="text-sm text-red-500">{errors.calorias}</p>}
              </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-datetime">Data e Hora</Label>
              <Input
                id="edit-datetime"
                type="datetime-local"
                value={IsoStringToDate(refeicaoAtual.data)}
                onChange={(e) => handleFieldChange('data', dateToIsoString(e.target.value))}
              />
              {errors.data && <p className="text-sm text-red-500">{errors.data}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Tipo de Refeição</Label>
              <Select
                value={refeicaoAtual.tipo}
                onValueChange={(value) => handleFieldChange('tipo', value)}
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
              {errors.tipo && <p className="text-sm text-red-500">{errors.tipo}</p>}
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleEditMeal}
            disabled={Object.values(errors).some(error => error !== undefined)}
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
