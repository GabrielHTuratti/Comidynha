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
import type { IRefeicao, nutridesc } from "@/model/refeicao"
import { useRefeicaoValidation } from "@/hooks/use-refeicaoValidation"

interface AddMealDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddMeal: () => void
  refeicaoNova: Omit<IRefeicao, "_id">
  updateRefeicaoNova: (updates: Omit<IRefeicao, "_id">) => void
  updateRefeicaoNovaDesc: (updates: nutridesc) => void
  updateRefeicaoNovaExtra: (id:string, key: string, value: string) => void
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

  const {errors, validateField, validateForm, validateExtraField, validateAllExtras} = useRefeicaoValidation();

  const handleAddMeal = () => {
    if(validateForm(refeicaoNova)){
      onAddMeal();
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    updateRefeicaoNova({ ...refeicaoNova, [field]: value });
    validateField(field, value);
  };

  const handleDescChange = (field: string, value: string) => {
    const newDesc = { ...refeicaoNova.desc, [field]: value };
    updateRefeicaoNovaDesc(newDesc);
    validateField(`desc.${field}`, value);
  };

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
              maxLength={51}
              value={refeicaoNova.nome}
              onChange={(e) => handleFieldChange('nome', e.target.value)}
              placeholder="Ex: Salada com frango grelhado"
            />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}

          </div>
          <div className="grid gap-2">
            <Label>Informações Nutricionais</Label>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Proteínas (g)</Label>
                <Input
                  value={refeicaoNova.desc.proteinas}
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
              </div>
              <div className="grid gap-2">
                <Label>Carboidratos (g)</Label>
                <Input
                  value={refeicaoNova.desc.carboidratos}
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
                    }
                  }}
                />
                {errors['desc.carboidratos'] && <p className="text-sm text-red-500">{errors['desc.carboidratos']}</p>}
              </div>
              <div className="grid gap-2">
                <Label>Gorduras (g)</Label>
                <Input
                  value={refeicaoNova.desc.gorduras}
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
              </div>

              {refeicaoNova.desc.extra?.map((campo, index) => (
                <div key={campo.campoid} className="grid grid-cols-3 gap-2 items-end">
                  <div className="grid gap-2">
                    <Label>Nome</Label>
                    <Input
                      value={campo.nome}
                      onChange={(e) => {
                      updateRefeicaoNovaExtra(campo.campoid, e.target.value, campo.valor);
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
                    <Input 
                      value={campo.valor} 
                      onChange={(e) => {
                        updateRefeicaoNovaExtra(campo.campoid, campo.nome, e.target.value);
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
                  <Button variant="destructive" onClick={() => {
                    removeRefeicaoNovaExtra(campo.campoid);
                    setTimeout(() => validateAllExtras(
                      refeicaoNova.desc.extra?.filter(e => e.campoid !== campo.campoid)
                    ));
                  }}>
                    Remover
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => {
                  addNewExtraField();
                  setTimeout(() => validateAllExtras(refeicaoNova.desc.extra));
                }}>
                Adicionar Campo Extra
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="calorias">Calorias</Label>
            <Input
              id="calorias"
              value={refeicaoNova.calorias || ""}
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
                  handleFieldChange('calorias', value);
                }
            }}
            />
            {errors.calorias && <p className="text-sm text-red-500">{errors.calorias}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="datetime">Data e Hora</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={IsoStringToDate(refeicaoNova.data)}
              onChange={(e) => handleFieldChange('data', dateToIsoString(e.target.value))}
            />
            {errors.data && <p className="text-sm text-red-500">{errors.data}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo de Refeição</Label>
            <Select
              value={refeicaoNova.tipo}
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
        <DialogFooter>
          <Button variant="outline" 
          onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleAddMeal}
            disabled={Object.values(errors).some(error => error !== undefined)}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
