"use client"

import { jsPDF } from "jspdf"
import { autoTable } from "jspdf-autotable"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { IRefeicao } from "@/model/refeicao"
import { getMealTypeName } from "./utils-refeicao"


export function generateMealsPDF(meals: IRefeicao[], userName: string) {
  const primaryColor = [180, 67, 108] 
  const textColor = [80, 80, 80] 
  const accentColor = [220, 120, 170] 
  const pageWidth = 210 
  const margin = 15 
  const contentWidth = pageWidth - margin * 2

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.data)
    mealDate.setHours(0, 0, 0, 0)
    return mealDate.getTime() === today.getTime()
  })

  const doc = new jsPDF()

  const addHeader = (pageNumber: number) => {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, pageWidth, 20, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")

    const formattedDate = format(today, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    doc.text(`Relatório de Refeições - ${formattedDate}`, margin, 13)

    const userNameWidth = doc.getTextWidth(`${userName}`)
    doc.text(`${userName}`, pageWidth - margin - userNameWidth, 13)

    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(0.5)
    doc.line(margin, 25, pageWidth - margin, 25)
  }
  const addFooter = () => {
    const pageCount = doc.internal.pages.length

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.rect(0, doc.internal.pageSize.height - 15, pageWidth, 15, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")

      const pageText = `Página ${i} de ${pageCount}`
      const pageTextWidth = doc.getTextWidth(pageText)
      doc.text(pageText, pageWidth - margin - pageTextWidth, doc.internal.pageSize.height - 6)
      doc.text("Gerado em: " + format(new Date(), "dd/MM/yyyy 'às' HH:mm"), margin, doc.internal.pageSize.height - 6)
    }
  }


  addHeader(1)


  let yPos = 35

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("Resumo Diário de Alimentação", margin, yPos)

  yPos += 10

  doc.setFillColor(245, 245, 245) 
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, "FD")
  yPos += 8
  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")

  const totalCalorias = todayMeals.reduce((total, meal) => total + meal.calorias, 0)
  doc.text(`Total de Calorias: ${totalCalorias} kcal`, margin + 5, yPos)
  doc.text(`Total de Refeições: ${todayMeals.length}`, margin + contentWidth / 2, yPos)

  yPos += 25
  const tableData = todayMeals.map((meal) => {
    const mealTime = format(new Date(meal.data), "HH:mm")
    return [
      getMealTypeName(meal.tipo),
      meal.nome,
      `${meal.calorias} kcal`,
      mealTime,
      `P: ${meal.desc.proteinas}g, C: ${meal.desc.carboidratos}g, G: ${meal.desc.gorduras}g`,
    ]
  })

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Refeições do Dia", margin, yPos)
  yPos += 5
  yPos = 45
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Detalhes Nutricionais", margin, yPos)

  yPos += 10

  todayMeals.forEach((meal, index) => {
    if (yPos > doc.internal.pageSize.height - 40) {
      doc.addPage()
      addHeader(doc.internal.pages.length)
      yPos = 35
    }
    const cardHeight = 40 + Object.keys(meal.desc.extra || {}).length * 5
    doc.setFillColor(250, 250, 250)
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setLineWidth(0.5)
    doc.roundedRect(margin, yPos, contentWidth, cardHeight, 3, 3, "FD")
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.roundedRect(margin, yPos, contentWidth, 8, 3, 3, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text(`${meal.nome} (${getMealTypeName(meal.tipo)})`, margin + 5, yPos + 5.5)

    const mealTime = format(new Date(meal.data), "HH:mm")
    const timeText = `${mealTime}`
    const timeWidth = doc.getTextWidth(timeText)
    doc.text(timeText, pageWidth - margin - 5 - timeWidth, yPos + 5.5)

    yPos += 15

    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    doc.text(`Proteínas: ${meal.desc.proteinas}g`, margin + 5, yPos)
    doc.text(`Carboidratos: ${meal.desc.carboidratos}g`, margin + contentWidth / 3, yPos)
    doc.text(`Gorduras: ${meal.desc.gorduras}g`, margin + (contentWidth / 3) * 2, yPos)

    yPos += 10

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(`Total: ${meal.calorias} kcal`, margin + 5, yPos)

    if (meal.desc.extra && Object.keys(meal.desc.extra).length > 0) {
      yPos += 8
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.setFontSize(9)
      doc.setFont("helvetica", "italic")
      doc.text("Informações adicionais:", margin + 5, yPos)

      yPos += 5
      meal.desc.extra.forEach((campo) => {
        doc.text(`• ${campo.nome}: ${campo.valor}`, margin + 10, yPos)
        yPos += 5
      })
    }
    yPos += 10
  })


  const result = autoTable(doc,{
    startY: yPos,
    head: [["Tipo", "Nome", "Calorias", "Horário", "Macronutrientes"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [180, 67, 108],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [200, 200, 200],
    },
    columnStyles: {
      0: { cellWidth: 30 },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 20, halign: "center" },
    },
    margin: { left: margin, right: margin },
  })



  addFooter()

  doc.save(`refeicoes_${format(today, "dd-MM-yyyy")}.pdf`)
}
