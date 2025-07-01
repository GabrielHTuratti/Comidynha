
import {IRefeicao } from "@/model/refeicao"


const API = process.env.NEXT_PUBLIC_API_BASE_URL

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
    const retorno = await response.json();
    window.location.href = "/main";

    return retorno;
}
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
}
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
  console.log("testando:" + meals);

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
export const getMeals = async () => {
  const response = await fetch(`${API}/refeicao`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: 'include'
  })
  if(!response.ok) throw new Error(`${await response.json().then(data => {return data.details;})}`)
  
    const retorno = await response.json();
    return retorno;

}
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