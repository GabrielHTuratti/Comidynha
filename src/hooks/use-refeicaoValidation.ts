import { useEffect, useState } from "react";
import {z} from "zod"
import type { extraCampo, IRefeicao, nutridesc } from "@/model/refeicao";

export const extraCampoSchema = z.object({
    campoid: z.string(),
    nome: z.string().min(1, { message: "Nome do campo é obrigatório" }),
    valor: z.string().min(1, { message: "Valor do campo é obrigatório" })
  });
  
export const nutridescSchema = z.object({
proteinas: z.string()
    .max(10, { message: "Proteínas não pode exceder 10 caracteres" })
    .regex(/^\d*$/, { message: "Proteínas deve conter apenas números" })
    .default("0"),
carboidratos: z.string()
    .max(10, { message: "Carboidratos não pode exceder 10 caracteres" })
    .regex(/^\d*$/, { message: "Carboidratos deve conter apenas números" })
    .default("0"),
gorduras: z.string()
    .max(10, { message: "Gorduras não pode exceder 10 caracteres" })
    .regex(/^\d*$/, { message: "Gorduras deve conter apenas números" })
    .default("0"),
extra: z.array(extraCampoSchema).optional()
});

export const refeicaoTipoSchema = z.enum([
'cafe-da-manha', 
'almoco', 
'lanche-da-tarde', 
'janta'
]);
  
export const refeicaoSchema = z.object({
useremail: z.string().email(),
refid: z.string().optional(),
nome: z.string().max(50, { message: "Nome não pode exceder 50 caracteres" }),
favorito: z.boolean().default(false),
desc: nutridescSchema,
calorias: z.number().min(0),
tipo: refeicaoTipoSchema
});

type ValidationErrors = { [key: string]: string | undefined};

export function useRefeicaoValidation() {
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validateField = (field: string, value: string) => {
        try{
            if (field.includes('desc.')) {
                const descField = field.replace('desc.', '');
                nutridescSchema.shape[descField as keyof typeof nutridescSchema.shape].parse(value);
              } else {
                refeicaoSchema.shape[field as keyof typeof refeicaoSchema.shape].parse(value);
              }
              setErrors(prev => ({ ...prev, [field]: undefined }));
            } catch (error) {
              if (error instanceof z.ZodError) {
                setErrors(prev => ({ ...prev, [field]: error.errors[0].message }));
              }
            }
    };

    const validateForm = (formData: Partial<IRefeicao>) => {
        try{
            refeicaoSchema.parse(formData);
            setErrors({});
            return true;
        }catch(error){
            if (error instanceof z.ZodError){
                const newErrors:ValidationErrors = {};
                error.errors.forEach(err => {
                    const path = err.path.join('.');
                    newErrors[path] = err.message;
                })
                setErrors(newErrors);
            }
            return false;
        }
    }

    const validateExtraField = (field: extraCampo, index: number) => {
        try {
          extraCampoSchema.parse(field);
          setErrors(prev => ({
            ...prev,
            [`extra.${index}.nome`]: undefined,
            [`extra.${index}.valor`]: undefined
          }));
          return true;
        } catch (error) {
          if (error instanceof z.ZodError) {
            const newErrors: ValidationErrors = {};
            error.errors.forEach(err => {
              const path = `extra.${index}.${err.path[0]}`;
              newErrors[path] = err.message;
            });
            setErrors(prev => ({ ...prev, ...newErrors }));
            return false;
          }
          return false;
        }
      };
    
      const validateAllExtras = (extras: extraCampo[] = []) => {
        let allValid = true;
        extras.forEach((field, index) => {
          if (!validateExtraField(field, index)) {
            allValid = false;
          }
        });
        return allValid;
      };

    return { errors, validateField, validateForm, validateExtraField, validateAllExtras};
}