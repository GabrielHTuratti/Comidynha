"use client"

import { useState } from "react"
import { z } from "zod"
import type { extraCampo, IRefeicao } from "@/model/refeicao"

export const extraCampoSchema = z.object({
  campoid: z.string(),
  nome: z.string().min(1, { message: "Nome do campo é obrigatório" }),
  valor: z.string().min(1, { message: "Valor do campo é obrigatório" }),
})

export const nutridescSchema = z.object({
  proteinas: z
    .string()
    .max(10, { message: "Proteínas não pode exceder 10 caracteres" })
    .regex(/^\d*\.?\d*$/, { message: "Proteínas deve conter apenas números" })
    .default("0"),
  carboidratos: z
    .string()
    .max(10, { message: "Carboidratos não pode exceder 10 caracteres" })
    .regex(/^\d*\.?\d*$/, { message: "Carboidratos deve conter apenas números" })
    .default("0"),
  gorduras: z
    .string()
    .max(10, { message: "Gorduras não pode exceder 10 caracteres" })
    .regex(/^\d*\.?\d*$/, { message: "Gorduras deve conter apenas números" })
    .default("0"),
  extra: z.array(extraCampoSchema).optional(),
})

export const refeicaoTipoSchema = z.enum(["cafe-da-manha", "almoco", "lanche-da-tarde", "janta"])

export const refeicaoSchema = z.object({
  useremail: z.string().email(),
  refid: z.string().optional(),
  nome: z
    .string()
    .min(1, { message: "Nome é obrigatório" })
    .max(50, { message: "Nome não pode exceder 50 caracteres" }),
  confidence: z.number().min(0).max(1).optional(),
  ingredients: z.array(z.string()).optional(),
  desc: nutridescSchema,
  calorias: z.union([
    z
      .string()
      .regex(/^\d+$/, { message: "Calorias deve ser um número" })
      .transform((val) => Number.parseInt(val)),
    z.number().min(0, { message: "Calorias deve ser maior que 0" }),
  ]),
  data: z.string().min(1, { message: "Data é obrigatória" }),
  suggestions: z.array(z.string()).optional(),
  tipo: refeicaoTipoSchema,
})

type ValidationErrors = { [key: string]: string | undefined }

export function useRefeicaoValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateField = (field: string, value: string | number | string[]) => {
    try {
      if (field.includes("desc.")) {
        const descField = field.replace("desc.", "")
        nutridescSchema.shape[descField as keyof typeof nutridescSchema.shape].parse(value)
      } else if (field === "calorias") {
        // Validação especial para calorias
        if (typeof value === "string") {
          if (value === "" || /^\d+$/.test(value)) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
            return
          } else {
            throw new Error("Calorias deve ser um número")
          }
        } else if (typeof value === "number" && value >= 0) {
          setErrors((prev) => ({ ...prev, [field]: undefined }))
          return
        }
      } else if (field === "nome") {
        if (typeof value === "string" && value.trim().length > 0 && value.length <= 50) {
          setErrors((prev) => ({ ...prev, [field]: undefined }))
          return
        } else {
          throw new Error("Nome é obrigatório e não pode exceder 50 caracteres")
        }
      } else if (field === "tipo") {
        if (["cafe-da-manha", "almoco", "lanche-da-tarde", "janta"].includes(value as string)) {
          setErrors((prev) => ({ ...prev, [field]: undefined }))
          return
        }
      } else if (field === "data") {
        if (typeof value === "string" && value.trim().length > 0) {
          setErrors((prev) => ({ ...prev, [field]: undefined }))
          return
        }
      } else {
        // Para outros campos, usar o schema padrão
        refeicaoSchema.shape[field as keyof typeof refeicaoSchema.shape].parse(value)
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }))
      } else if (error instanceof Error) {
        setErrors((prev) => ({ ...prev, [field]: error.message }))
      }
    }
  }

  const validateForm = (formData: Partial<IRefeicao>) => {
    const newErrors: ValidationErrors = {}

    // Validar nome
    if (!formData.nome || formData.nome.trim().length === 0) {
      newErrors.nome = "Nome é obrigatório"
    } else if (formData.nome.length > 50) {
      newErrors.nome = "Nome não pode exceder 50 caracteres"
    }

    // Validar calorias
    if (!formData.calorias && formData.calorias !== 0) {
      newErrors.calorias = "Calorias é obrigatório"
    } else if (typeof formData.calorias === "string" && !/^\d+$/.test(formData.calorias)) {
      newErrors.calorias = "Calorias deve ser um número"
    } else if (typeof formData.calorias === "number" && formData.calorias < 0) {
      newErrors.calorias = "Calorias deve ser maior que 0"
    }

    // Validar tipo
    if (!formData.tipo || !["cafe-da-manha", "almoco", "lanche-da-tarde", "janta"].includes(formData.tipo)) {
      newErrors.tipo = "Tipo de refeição é obrigatório"
    }

    // Validar data
    if (!formData.data || formData.data.trim().length === 0) {
      newErrors.data = "Data é obrigatória"
    }

    // Validar campos nutricionais
    if (formData.desc) {
      if (formData.desc.proteinas && !/^\d*\.?\d*$/.test(formData.desc.proteinas)) {
        newErrors["desc.proteinas"] = "Proteínas deve conter apenas números"
      }
      if (formData.desc.carboidratos && !/^\d*\.?\d*$/.test(formData.desc.carboidratos)) {
        newErrors["desc.carboidratos"] = "Carboidratos deve conter apenas números"
      }
      if (formData.desc.gorduras && !/^\d*\.?\d*$/.test(formData.desc.gorduras)) {
        newErrors["desc.gorduras"] = "Gorduras deve conter apenas números"
      }
    }

    // Validar campos extras
    if (formData.desc?.extra) {
      formData.desc.extra.forEach((campo, index) => {
        if (campo.nome && campo.nome.trim().length === 0) {
          newErrors[`extra.${index}.nome`] = "Nome do campo é obrigatório"
        }
        if (campo.valor && campo.valor.trim().length === 0) {
          newErrors[`extra.${index}.valor`] = "Valor do campo é obrigatório"
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateExtraField = (field: extraCampo, index: number) => {
    try {
      extraCampoSchema.parse(field)
      setErrors((prev) => ({
        ...prev,
        [`extra.${index}.nome`]: undefined,
        [`extra.${index}.valor`]: undefined,
      }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ValidationErrors = {}
        error.errors.forEach((err) => {
          const path = `extra.${index}.${err.path[0]}`
          newErrors[path] = err.message
        })
        setErrors((prev) => ({ ...prev, ...newErrors }))
        return false
      }
      return false
    }
  }

  const validateAllExtras = (extras: extraCampo[] = []) => {
    let allValid = true
    extras.forEach((field, index) => {
      if (!validateExtraField(field, index)) {
        allValid = false
      }
    })
    return allValid
  }

  return { errors, validateField, validateForm, validateExtraField, validateAllExtras }
}
