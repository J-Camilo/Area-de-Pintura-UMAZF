import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

/* --------------- Dependecias ------------------ */
import { BrowserRouter, Routes, Route, Navigate, useNavigate} from "react-router-dom";
import axios from "axios";

/*----------------------- Components ---------------------- */
import { Home } from "./Components/page/Home/Home";
import { Login } from './Components/page/Login/Login';
import { Register } from './Components/page/Register/Register';
import { Data } from './Components/page/Data/Data';
import { Error_404 } from "./Components/page/Error_404/Error_404";





function App() {
 
  // const valiLoginAdmin = localStorage.getItem("CodeValid_A");
  const valiLogin = localStorage.getItem("CodeVerifycation");
  // let navigate = useNavigate(); 

  // /*----------------------------------------------------------------------- encrypted password ----------------------------------------------------------*/
        const bufferABase64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));
        const base64ABuffer = buffer => Uint8Array.from(atob(buffer), c => c.charCodeAt(0));
        const LONGITUD_SAL = 16;
        const LONGITUD_VECTOR_INICIALIZACION = LONGITUD_SAL;
        const contraseñaEncriptar = "lfjdnd193016"
        const contraseñaDesencriptar = "lfjdnd193016"
  
        const derivacionDeClaveBasadaEnContraseña = async (contraseña, sal, iteraciones, longitud, hash, algoritmo = 'AES-CBC') => {
          const encoder = new TextEncoder();
          let keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(contraseña),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
          );
          return await window.crypto.subtle.deriveKey(
            {
              name: 'PBKDF2',
              salt: encoder.encode(sal),
              iterations: iteraciones,
              hash
            },
            keyMaterial,
            { name: algoritmo, length: longitud },
            false,
            ['encrypt', 'decrypt']
          );
        }
        const encriptar = async (contraseña, textoPlano) => {
          const encoder = new TextEncoder();
          const sal = window.crypto.getRandomValues(new Uint8Array(LONGITUD_SAL));
          const vectorInicializacion = window.crypto.getRandomValues(new Uint8Array(LONGITUD_VECTOR_INICIALIZACION));
          const bufferTextoPlano = encoder.encode(textoPlano);
          const clave = await derivacionDeClaveBasadaEnContraseña(contraseña, sal, 100000, 256, 'SHA-256');
          const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-CBC", iv: vectorInicializacion },
            clave,
            bufferTextoPlano
          );
          return bufferABase64([
            ...sal,
            ...vectorInicializacion,
            ...new Uint8Array(encrypted)
          ]);
        };
  
        const desencriptar = async (contraseña, encriptadoEnBase64) => {
          const decoder = new TextDecoder();
          const datosEncriptados = base64ABuffer(encriptadoEnBase64);
          const sal = datosEncriptados.slice(0, LONGITUD_SAL);
          const vectorInicializacion = datosEncriptados.slice(0 + LONGITUD_SAL, LONGITUD_SAL + LONGITUD_VECTOR_INICIALIZACION);
          const clave = await derivacionDeClaveBasadaEnContraseña(contraseña, sal, 100000, 256, 'SHA-256');
          const datosDesencriptadosComoBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-CBC", iv: vectorInicializacion },
            clave,
            datosEncriptados.slice(LONGITUD_SAL + LONGITUD_VECTOR_INICIALIZACION)
          );
          return decoder.decode(datosDesencriptadosComoBuffer);
        }
        
  
        /*fin datos*/
  // /*------------------------------------------------- Finish encrypted password ----------------------------------------------------------*/
  






  /*------------------------------------------------------------------ Login ----------------------------------------------------------------------------*/


  /*validaciones login*/
  const [messagesLogin, setmessagesLogin] = useState("")
  const [alertUserLogin, setalertUserLogin] = useState(false)
  const [alertUserLoginPassword, setalertUserLoginPassword] = useState(false)
  const [alertHome, setalertHome] = useState(false)
  const [alertConexionLogin, setalertConexionLogin] = useState(false)
  // const [valiLogin, setvaliLogin] = useState(false)
  // const [valiLoginAdmin, setvaliLoginAdmin] = useState(false)

  const [userLogin, setuserLogin] = useState("")
  const [passwordUser, setpasswordUser] = useState("")

  const onChangeUserLogin = ({ currentTarget }) => setuserLogin(currentTarget.value.toLowerCase());
  const onChangePasswordLogin = ({ currentTarget }) => setpasswordUser(currentTarget.value);

  /*datos de usuario*/
  // const [idUser, setidUser] = useState(null)
  // const [usernameUser, setusernameUser] = useState("")
  // const [emailUser, setemailUser] = useState("")
  // const [password, setpassword] = useState("")


  const getApi = async() => {
   
    axios.get('https://apisupervisor-production.up.railway.app/Api/users' )
    // , {
    //   headers: {
    //     "Access-Control-Allow-Origin" : true
    //   }})
      .then(function (response) {
        // handle success
        response.data.map(async (data) => {
          
          const desencriptado = await desencriptar(contraseñaDesencriptar, data.password);
          // console.log(desencriptado);
          if (userLogin === data.email && passwordUser === desencriptado) {
            
            setalertHome(true);
            localStorage.setItem("idCode", data._id);
            localStorage.setItem("CodePs", data.password);
            localStorage.setItem("CodeVerifycation", true)


            // localStorage.setItem("NameUser", data.name);
            // setusernameUser(data.name);
            // setemailUser(data.email);
            // setpassword(data.password);
            setmessagesLogin("bienvenido " + data.name)

          } else if (userLogin !== data.email && passwordUser !== desencriptado) {
            setmessagesLogin("usuario no registrado")
            setalertConexionLogin(false)

          }else if (userLogin !== data.email || passwordUser !== desencriptado) {
            setmessagesLogin("contraseña o email incorrectos")
            setalertConexionLogin(false)
          }

          return console.log("data obtenida");
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setmessagesLogin(error.message);
      })
  }

  const ClickLogin = (e) => {
    e.preventDefault()
    if (userLogin === "admin@gmail.com" && passwordUser === "admin1234") {
      setalertHome(true);
      setmessagesLogin("Bienvenido admin")
      localStorage.setItem("CodeValid_A", true);
      // setvaliLoginAdmin(true)

    } else if (userLogin !== "admin@gmail.com" || passwordUser !== "admin1234") {
      getApi()
    }


  }

  const [shown2, setShown2] = useState(false);
  const switchShown2 = (event) => {
    setShown2(!shown2)
    event.preventDefault()
  };

  const onClick2 = () => {
    setalertUserLogin(false)
    setmessagesLogin("")
    setuserLogin("")
    setpasswordUser("")
    // navigate('register')
  }

  /*------------------------------------------------------------------ Finish Login ----------------------------------------------------------------------------*/
  
  
  
  /*------------------------------------------------------------------ Register ----------------------------------------------------------------------------*/
 /*inicio validaciones register*/
 const [alertUser, setalertUser] = useState(false)
 const [alertConexion, setalertConexion] = useState(false)
 const [validUsername, setvalidUsername] = useState('');
 const [messages, setmessages] = useState("")
 const [validemail, setvalidemail] = useState('.@');
 const [usernameRegister, setusernameRegister] = useState("")
 const [passwordRegister, setpasswordRegister] = useState("")
 const [confrimPasword, setconfrimPasword] = useState("")
 const [emailRegister, setemailRegister] = useState("")
 const onChangeusernameRegister = ({ currentTarget }) => setusernameRegister(currentTarget.value);
 const onChangepasswordRegister = ({ currentTarget }) => setpasswordRegister(currentTarget.value);
 const onChangeemailRegister = ({ currentTarget }) => setemailRegister(currentTarget.value.toLowerCase());
 const onChangeconfrimPasword = ({ currentTarget }) => setconfrimPasword(currentTarget.value);



 const postApi = async(e) => {
   e.preventDefault()

   const encriptado = await encriptar(contraseñaEncriptar, passwordRegister);

   if ((usernameRegister.indexOf('`') !== -1 || usernameRegister.indexOf('.') !== -1 || usernameRegister.indexOf('@') !== -1 || usernameRegister.indexOf('!') !== -1 || usernameRegister.indexOf('%') !== -1 || usernameRegister.indexOf('$') !== -1 || /\s/.test(usernameRegister)) || (emailRegister.indexOf('.') === -1 || emailRegister.indexOf('@') === -1 || /\s/.test(emailRegister))) {
     console.log("error");
   } else {
     axios.post('https://apisupervisor-production.up.railway.app/Api/users', {
       "name": usernameRegister,
       "email": emailRegister,
       "password": encriptado
     })
       .then(function (response) {
         // handle success
         console.log(response.data);

        //  navigate('login')

         response.data.map((data => console.log(data)));
       })
       .catch(function (error) {
        //  handle error
         setmessages(error.message)

       });
     setusernameRegister("")
     setpasswordRegister("")
     setconfrimPasword("")
     setemailRegister("")
     setmessages("")
     setalertUser(false)
     setalertConexion(false)


   }

   setvalidUsername(usernameRegister)
   setvalidemail(emailRegister)
   console.log(messages);
 }
 
 
  /*------------------------------------------------------------------ Finish Register ----------------------------------------------------------------------------*/
  
//   useEffect(() => {
//     const URL = 'https://rickandmortyapi.com/api/character'

//     const asyncFetchData = async() =>{
//         const res = await fetch(URL)
//         const data = await res.json()
//         console.log(data);
//     }
//     asyncFetchData();
// }, [])


  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/All-options/r/oWncaso2" element={<Data />} />

        {/* logic Props */}
        <Route path="/login/r/owncaso" element={valiLogin ? <Navigate replace to="/All-options/r/oWncaso2" /> : <Login alertUserLoginPassword={alertUserLoginPassword} setalertUserLoginPassword={setalertUserLoginPassword} setalertConexionLogin={setalertConexionLogin} alertConexionLogin={alertConexionLogin} alertUserLogin={alertUserLogin} setalertUserLogin={setalertUserLogin} messagesLogin={messagesLogin} onClick2={onClick2} switchShown2={switchShown2} shown2={shown2} userLogin={userLogin} ClickLogin={ClickLogin} passwordUser={passwordUser} onChangePasswordLogin={onChangePasswordLogin} onChangeUserLogin={onChangeUserLogin} />} />
        <Route path="/Register/r/R3gcaso" element={<Register alertConexion={alertConexion} setalertConexion={setalertConexion} alertUser={alertUser} setalertUser={setalertUser} setmessages={setmessages} messages={messages} validemail={validemail} validUsername={validUsername} confrimPasword={confrimPasword} onChangeconfrimPasword={onChangeconfrimPasword} postApi={postApi} emailRegister={emailRegister} passwordRegister={passwordRegister} usernameRegister={usernameRegister} onChangeemailRegister={onChangeemailRegister} onChangepasswordRegister={onChangepasswordRegister} onChangeusernameRegister={onChangeusernameRegister}  />} />

        {/* Protect routers */}
        <Route path="/*" element={<Error_404 />} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;
