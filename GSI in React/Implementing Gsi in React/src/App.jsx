import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";

function App() {
  const [count, setCount] = useState(0);

  
  // useGoogleOneTapLogin({
  //   onSuccess: (credentialResponse) => {
  //     console.log(credentialResponse);
  //   },
  //   onError: () => {
  //     console.log("Login Failed");
  //   },
  // });

  // Use this to get authorization-code this follows | auth-flow
  const login = useGoogleLogin({
    scope:'https://www.googleapis.com/auth/drive',
    onSuccess: (codeResponse) => console.log(codeResponse),
    flow: "auth-code",
  });

  return (
    <>
    // Use this to get id_Token this follows | GSI mechanism we can call it as implict login 
      <GoogleLogin
        shape="pill"
        theme="filled_blue"
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        useOneTap
      />
      <button onClick={login}>Auth-code flow for signIn</button>
    </>
  );
}

export default App;
