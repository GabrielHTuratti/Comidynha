
import {IRefeicao } from "@/model/refeicao"

export const authenticate = async (email: string, password: string) =>{
    const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
        credentials: 'include',
    });
    if(!response.ok){
        throw new Error(`Erro ao fazer login => ${response.json()}`)
    }
    return response.json();
}
export const registrar = async (email:string, name:string, password:string) => {
    const data = {email, name, password}
    console.log(JSON.stringify(data));
    const response = await fetch(`${process.env.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if(!response.ok){
        throw new Error(`Erro ao registrar => ${response.json()}`)
    };
    return response.json();
}
export const getServices = async () => {
  const jsonServices = await fetch(`${process.env.API_BASE_URL}/electricians/getServices`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store'
  });
  return jsonServices;
}
export const getProfile = async () => {
  const profile = await fetch(`${process.env.API_BASE_URL}/auth/user`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  if(!profile.ok) throw new Error(`Erro ao buscar perfil => ${profile.json()}`)
    const data = await profile.json()
    console.log("testando" + data)
    return data.user;
}

export const createMeal = async (meals: IRefeicao) => {
  console.log("testando:" + meals);

  const response = await fetch(`${process.env.API_BASE_URL}/refeicao`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meals),
    credentials: 'include',
  })
  if(!response.ok){
    throw new Error(`Erro ao salvar refeição => ${response.json()}`)
  }
  return response.json();
}
export const updateMeal = async (meals: IRefeicao) => {
  console.log("testando edit:" + meals.tipo);
  const response = await fetch(`${process.env.API_BASE_URL}/refeicao`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meals),
    credentials: 'include',
  })
  if(!response.ok){
    throw new Error(`Erro ao salvar refeição => ${response.json()}`)
  }
  return response.json();
}

export const deleteMeal = async (meals: IRefeicao) => {
  console.log("testando:" + meals);
  const response = await fetch(`${process.env.API_BASE_URL}/refeicao`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meals),
    credentials: 'include',
  })
  if(!response.ok){
    throw new Error(`Erro ao salvar refeição => ${response.json()}`)
  }
  return response.json();
}

export const getMeals = async () => {
  const response = await fetch(`${process.env.API_BASE_URL}/refeicao`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: 'include'
  })
  if(!response.ok) throw new Error(`Erro ao salvar refeição => ${response.json()}`)
  
  return response.json();

}