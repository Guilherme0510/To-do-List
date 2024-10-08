import React, { useState } from "react";
import "../App.css";

export const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLoginClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsRegistering(false);
      setIsAnimating(false);
    }, 500); // Tempo da animação
  };

  const handleRegisterClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsRegistering(true);
      setIsAnimating(false);
    }, 500); // Tempo da animação
  };

  return (
    <div className="bg-gray-700 h-screen flex justify-center items-center relative">
      <div className={`bg-blue-300 h-[85vh] w-[85vw] rounded-2xl flex shadow-md transition-transform duration-500`}>
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
                      className="w-[400px] bg-blue-300 border-solid border-b-2 border-b-black outline-none rounded-md"
                    />
                  </div>

                  <div>
                    <button className="mt-3 w-[400px] h-10 bg-gray-50 text-black rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-200">
                      Cadastrar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`cadastro-bg flex flex-col justify-center items-center bg-gray-50 text-gray-700 gap-7 shadow-xl transition-all duration-500 ${isAnimating ? 'w-[85vw] h-[85vh] absolute right-[109px]' : 'w-3/5'}`}>
              <h1 className="text-3xl font-bold">Já possui uma conta?</h1>
              <p className="w-3/4 text-center">
                Bem-vindo de volta! Acesse sua conta e continue desfrutando de conteúdos exclusivos, ofertas especiais e uma experiência única como membro da nossa comunidade!
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
            <div className={`login-bg flex flex-col justify-center items-center bg-gray-50 text-gray-700 gap-7 shadow-xl transition-all duration-500 ${isAnimating ? 'w-[85vw] h-[85vh] absolute' : 'w-3/5'}`}>
              <h1 className="text-3xl font-bold">Novo aqui?</h1>
              <p className="w-3/4 text-center">
                <b>Crie sua conta</b> agora e faça parte da nossa comunidade! Cadastre-se para ter acesso a conteúdos exclusivos, ofertas especiais e uma experiência única para membros.
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
                    />
                  </div>

                  <div className="flex flex-col items-start mb-4">
                    <label htmlFor="senha" className="mb-1 font-bold">
                      Senha
                    </label>
                    <input
                      type="password"
                      name="senha"
                      id="senha"
                      className="w-[400px] bg-blue-300 border-solid border-b-2 border-b-black outline-none rounded-md"
                    />
                  </div>

                  <div className="flex flex-row items-center mb-4">
                    <input
                      type="checkbox"
                      name="lembrar"
                      id="lembrar"
                      className="mr-2"
                    />
                    <label htmlFor="lembrar" className="font-semibold">Lembrar usuário</label>

                    <p className="text-sm text-gray-700 ml-5 p-4">
                      Esqueceu a senha?
                    </p>
                  </div>

                  <div>
                    <button className="w-[400px] h-10 bg-gray-50 text-black rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-200">
                      Login
                    </button>
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
