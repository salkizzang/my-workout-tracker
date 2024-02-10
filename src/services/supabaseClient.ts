import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL and Key must be defined");
  }
export const supabase = createClient(supabaseUrl, supabaseKey);


export async function signIn(email:string, password:string){
    const {data, error} = await supabase.auth.signInWithPassword({
        email : email, password : password
    });

    if (error) throw error;
    return {data};
}

export async function signUp(email : string, password: string){
    const {data, error} = await supabase.auth.signUp({
        email : email, password : password
    });

    if(error) throw error;
    return {data};
}