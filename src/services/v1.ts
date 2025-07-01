
import {IRefeicao, RefeicaoTipo } from "@/model/refeicao"


const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authenticate = async (email: string, password: string) =>{
    const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
        credentials: 'include',
    });
    if(!response.ok){
        throw new Error(`${await response.json().then(data => {return data.error;})}`)
    }
    const retorno = await response.status;
    window.location.href = "/main";
    return retorno;
};
export const registrar = async (email:string, name:string, password:string) => {
    const data = {email, name, password}
    console.log(JSON.stringify(data));
    const response = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if(!response.ok){
        throw new Error(`${await response.json().then(data => {return data.details;})}`)
    };
    const retorno = await response.json();
    window.location.href = "/main";

    return retorno;
};
export const getProfile = async () => {
  const profile = await fetch(`${API}/auth/user`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  if(!profile.ok) throw new Error(`${await profile.json().then(data => {return data.error;})}`)
    const data = await profile.json()
    return data.user;
}
export const createMeal = async (meals: IRefeicao) => {
  const user = await getProfile();
  if(user.plan === "Basico"){
    const meals = await getMeals();
    const mealsCount = filterMealsInMonth(meals).length
    if (mealsCount >= 20){
      throw new Error(`Limite de 20 refeições mensais atingido para o plano gratuito!\n Quantidade atual:${mealsCount}`);
    }
  }  

  const response = await fetch(`${API}/refeicao`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meals),
    credentials: 'include',
  })
  if(!response.ok){
    throw new Error(`${await response.json().then(data => {return data.details;})}`)
  }
  const retorno = await response.json();
  return retorno;
}
export const updateMeal = async (meals: IRefeicao) => {
  console.log("testando edit:" + meals.tipo);
  const response = await fetch(`${API}/refeicao`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meals),
    credentials: 'include',
  })
  if(!response.ok){
    throw new Error(`${await response.json().then(data => {return data.details;})}`)
  }
  const retorno = await response.json();
  return retorno;
}
export const deleteMeal = async (meals: IRefeicao) => {
  console.log("testando:" + meals);
  const response = await fetch(`${API}/refeicao`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meals),
    credentials: 'include',
  })
  if(!response.ok){
    throw new Error(`${await response.json().then(data => {return data.details;})}`)
  }
  const retorno = await response.json();
  return retorno;
}
export const getMeals = async (): Promise<IRefeicao[]> => {
  try {
    const response = await fetch(`${API}/refeicao`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || "Erro ao buscar refeições");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Resposta da API não é um array");
    }

    const validatedMeals = data.map((item: IRefeicao) => {
      const meal: IRefeicao = {
        useremail: item.useremail || "",
        refid: item.refid || "",
        nome: item.nome || "",
        favorito: item.favorito || false,
        desc: {
          proteinas: item.desc?.proteinas || "0",
          carboidratos: item.desc?.carboidratos || "0",
          gorduras: item.desc?.gorduras || "0",
          extra: item.desc?.extra || [],
        },
        calorias: item.calorias || 0,
        data: item.data || new Date().toISOString(),
        tipo: ["cafe-da-manha", "almoco", "lanche-da-tarde", "janta"].includes(item.tipo)
          ? item.tipo as RefeicaoTipo
          : "cafe-da-manha",
      };
      return meal;
    });

    return validatedMeals;
  } catch (error) {
    console.error("Erro em getMeals:", error);
    throw error; 
  }
};

export const logout = async () => {
  const response = await fetch(`${API}/auth/logout`, {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    credentials: 'include'
  })
  if(!response.ok) throw new Error(`${await response.json().then(data => {return data.details;})}`)

    window.location.href = "/auth/customer";
  }
export const refresh = async () => {
  const response = await fetch(`${API}/auth/refresh`, {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    credentials: 'include'
  })
  if(!response.ok) throw new Error(`${await response.json().then(data => {return data.details;})}`)
}
//========================================

function filterMealsInMonth(meals:IRefeicao[]){
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return meals.filter((meal) => {
    try{
      if(!meal.data || isNaN(new Date(meal.data).getTime())){
        console.log(`Refeição com data inválida: ${meal.refid}`)
        return false;
      }
      const mealDate = new Date(meal.data);
      return (
        mealDate.getMonth() === currentMonth && mealDate.getFullYear() === currentYear
      );
    }catch (err){
      console.log(`Erro ao processar data de refeição: ${meal.refid} \n Erro: ${err}`)
      return false;
    }
  })

}