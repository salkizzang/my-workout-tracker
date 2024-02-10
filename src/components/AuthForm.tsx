"use client"
import { useState } from "react";
import { signIn, signUp } from "../services/supabaseClient";


function AuthForm() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (isLogin) {
      try {
        const { data } = await signIn(email, password);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const { data } = await signUp(email, password);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need to create an account?' : 'Already have an account?'}
      </button>
    </div>
  );

}

export default AuthForm;