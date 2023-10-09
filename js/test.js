import { supa } from "/supabase.js";

console.log("super es funktioniert")
async function ex_1() {
    const { data, error } = await supa.from("Fragen").select();
  
    return data;
  }

console.log('ex_1', ex_1());