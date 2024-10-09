import React, { useState } from "react";
import "../App.css";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Navigate, useLocation } from "react-router-dom";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [missingPass, setMissingPass] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeCadastro, setNomeCadastro] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [erro, setErro] = useState(false);
  const [messageErro, setMessageErro] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [resetSenha, setResetSenha] = useState("");
  const [recuperarEmail, setRecuperarEmail] = useState("");

  const location = useLocation();

  const handleLogin = async () => {
    setMessageErro("");
    if (!email || !senha) {
      if (!senha) {
        setMessageErro("Por favor, insira sua senha.");
      }
      if (!email) {
        setMessageErro("Por favor, insira seu e-mail.");
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, senha);
        console.log("Login realizado");
        setRedirect(true);
        setErro(false);
      } catch (error) {
        setErro(true);
        console.log(error);
      }
    }
  };

  const handleCadastro = async () => {
    if (!nomeCadastro || !emailCadastro || !senhaCadastro) {
      setMessageErro("Preencha todos os campos para realizar o cadastro.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailCadastro, senhaCadastro);
  
      if (nomeCadastro.trim() === "") {
        setMessageErro("O campo nome não pode estar vazio.");
        return;
      }
  
      await updateProfile(auth.currentUser, {
        displayName: nomeCadastro,
      });
  
      const user = userCredential.user;
  
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nomeCadastro,  
        email: emailCadastro,
      });
  
      handleLoginClick();
    } catch (error) {
      setErro(true);
      setMessageErro(error.message);
    }
  };
  
  
  const handleResetSenha = async () => {
    setErro("");
    setResetSenha("");

    if (!recuperarEmail) {
      setErro("Por favor, insira o seu email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, recuperarEmail);
      setResetSenha("Um email de recuperação foi enviado.");
      console.log("deu certo");
    } catch (erro) {
      console.log(erro);
      console.log("deu ee");
      setErro("Erro ao enviar email de recuperação.");
    }
  };

  if (redirect) {
    return <Navigate to={"/home"} />;
  }

  const handleLoginClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsRegistering(false);
      setIsAnimating(false);
    }, 500);
  };

  const handleRegisterClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsRegistering(true);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="bg-gray-700 h-screen flex justify-center items-center relative">
      <div
        className={`bg-blue-300 h-[85vh] w-[85vw] rounded-2xl flex shadow-md transition-transform duration-500`}
      >
        {isRegistering ? (
          <>
            <div className="w-2/5 m-2 rounded-2xl">
              <div className="h-full">
                <div className="text-center flex flex-col gap-5 mt-10">
                  <h1 className="text-3xl font-serif font-semibold">
                    Crie sua Conta
                  </h1>
                  <p className="italic text-sm">
                    Preencha os dados para criar sua conta!
                  </p>
                </div>

                <div className="h-4/5 flex flex-col justify-center items-center">
                  <div className="flex flex-col items-start mb-4">
                    <label htmlFor="nome" className="mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="nome"
                      id="nome"
                      value={nomeCadastro}
                      onChange={(e) => setNomeCadastro(e.target.value)}
                      className="w-[400px] bg-blue-300 border-solid border-b-2 border-b-black outline-none rounded-md"
                    />
                  </div>

                  <div className="flex flex-col items-start mb-4">
                    <label htmlFor="email" className="mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={emailCadastro}
                      onChange={(e) => setEmailCadastro(e.target.value)}
                      className="w-[400px] bg-blue-300 border-solid border-b-2 border-b-black outline-none rounded-md"
                    />
                  </div>

                  <div className="flex flex-col items-start mb-4">
                    <label htmlFor="senha" className="mb-1">
                      Senha
                    </label>
                    <input
                      type="password"
                      name="senha"
                      id="senha"
                      value={senhaCadastro}
                      onChange={(e) => setSenhaCadastro(e.target.value)}
                      className="w-[400px] bg-blue-300 border-solid border-b-2 border-b-black outline-none rounded-md"
                    />
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        handleCadastro();
                      }}
                      className="mt-3 w-[400px] h-10 bg-gray-50 text-black rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-200"
                    >
                      Cadastrar
                    </button>
                    {messageErro && (
                      <p className="text-red-500 text-center mt-5">
                        {messageErro}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`cadastro-bg flex flex-col justify-center items-center bg-gray-50 text-gray-700 gap-7 shadow-xl transition-all duration-500 ${
                isAnimating
                  ? "w-[85vw] h-[85vh] absolute right-[109px]"
                  : "w-3/5"
              }`}
            >
              <h1 className="text-3xl font-bold">Já possui uma conta?</h1>
              <p className="w-3/4 text-center">
                Bem-vindo de volta! Acesse sua conta e continue desfrutando de
                conteúdos exclusivos, ofertas especiais e uma experiência única
                como membro da nossa comunidade!
              </p>
              <button
                onClick={handleLoginClick}
                className="border0 border-black text-white bg-gray-600 px-6 py-2 mt-4 rounded-xl hover:bg-gray-800 hover:text-white transition-all duration-300 ease-in"
              >
                Faça Login Já
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className={`login-bg flex flex-col justify-center items-center bg-gray-50 text-gray-700 gap-7 shadow-xl transition-all duration-500 ${
                isAnimating ? "w-[85vw] h-[85vh] absolute" : "w-3/5"
              }`}
            >
              <h1 className="text-3xl font-bold">Novo aqui?</h1>
              <p className="w-3/4 text-center">
                <b>Crie sua conta</b> agora e faça parte da nossa comunidade!
                Cadastre-se para ter acesso a conteúdos exclusivos, ofertas
                especiais e uma experiência única para membros.
              </p>
              <button
                onClick={handleRegisterClick}
                className="border0 border-black text-white bg-gray-600 px-6 py-2 mt-4 rounded-xl hover:bg-gray-800 hover:text-white transition-all duration-300 ease-in"
              >
                Cadastre-se já
              </button>
            </div>

            <div className="bg-blue-300 w-2/5 m-4 rounded-2xl">
              <div className="h-full">
                <div className="text-center flex flex-col gap-5 mt-10">
                  <h1 className="text-4xl font-serif font-semibold">
                    Bem Vindo de Volta!
                  </h1>
                  <p className="text-lg italic font-semibold">
                    Por favor, insira os seus dados!
                  </p>
                </div>

                <div className="h-3/4 flex flex-col justify-center items-center">
                  <div className="flex flex-col items-start mb-4">
                    <label htmlFor="email" className="mb-1 font-bold">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="w-[400px] bg-blue-300 border-solid border-b-2 border-b-black outline-none rounded-md"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </div>

                  <div className="flex flex-col items-start mb-4">
                    <label htmlFor="password" className="mb-1 font-bold">
                      Senha
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="w-[400px] bg-blue-300 border-solid border-b-2 border-b-black outline-none rounded-md"
                      onChange={(e) => setSenha(e.target.value)}
                      value={senha}
                    />
                  </div>
                  <div className="flex flex-row items-center mb-4">
                    <input
                      type="checkbox"
                      name="lembrar"
                      id="lembrar"
                      className="mr-2"
                    />
                    <label htmlFor="lembrar" className="font-semibold">
                      Lembrar usuário
                    </label>

                    <button
                      onClick={() => setMissingPass(true)}
                      className="text-sm text-gray-600 ml-5 p-4 hover:text-gray-950"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>

                  {missingPass ? (
                    <div className="absolute h-screen w-full top-0 left-0 flex justify-center items-center">
                      <div className="absolute h-screen w-full bg-gray-700 opacity-80"></div>

                      <div className="relative flex flex-col text-center bg-white h-2/4 w-[450px] z-10 rounded-2xl pt-10">
                        <h1 className="text-2xl font-semibold">
                          Esqueceu a Senha?
                        </h1>
                        <p className="text-base">
                          Digite seu e-mail para as instruções de recuperação.
                        </p>
                        <div className="flex flex-col items-start justify-center h-full mb-4 mx-auto">
                          <label
                            htmlFor="recuperarEmail"
                            className="mb-1 font-bold"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="recuperarEmail"
                            id="recuperarEmail"
                            className="w-[300px] bg-white border-solid border-b-2 border-b-black outline-none rounded-md"
                            value={recuperarEmail}
                            onChange={(e) => setRecuperarEmail(e.target.value)}
                          />
                        </div>
                        <button
                          onClick={handleResetSenha}
                          className="mb-10 transform hover:-translate-y-1 bg-gray-600 hover:bg-gray-800 text-white transition-all duration-300 w-[200px] mx-auto rounded-lg py-2"
                        >
                          Resetar Senha
                        </button>
                        <button
                          onClick={() => setMissingPass(false)}
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-gray-700 hover:bottom-1 transition-all duration-300 flex gap-2 items-center"
                        >
                          <FontAwesomeIcon icon={faLeftLong} />
                          Voltar para o login
                        </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <div>
                    <button
                      onClick={handleLogin}
                      className="mt-3 w-[400px] h-10 bg-gray-50 text-black rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-200"
                    >
                      Login
                    </button>
                    {erro && (
                      <p className="text-red-500 text-center mt-5">
                        {messageErro}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
