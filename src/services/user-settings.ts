const API_BASE = "/api/user"

export async function updateUserProfile(data: {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}) {
  const response = await fetch(`${API_BASE}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Erro ao atualizar perfil")
  }

  return response.json()
}

// export async function updateUserPreferences(type: "notifications" | "privacy" | "general", preferences: JSON) {
//   const response = await fetch(`${API_BASE}/preferences`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ type, preferences }),
//   })

//   if (!response.ok) {
//     const error = await response.json()
//     throw new Error(error.error || "Erro ao atualizar preferências")
//   }

//   return response.json()
// }

export async function exportUserData(type: "meals" | "profile" | "all") {
  const response = await fetch(`${API_BASE}/export`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Erro ao exportar dados")
  }

  const result = await response.json()

  // Criar e baixar arquivo
  const blob = new Blob([JSON.stringify(result.data, null, 2)], {
    type: "application/json",
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `comidynha-${type}-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  return result
}
