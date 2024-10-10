import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faHouse,
  faList,
  faPlus,
  faRightLong,
  faStar,
  faSun,
  faTable,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { imagens } from "../assets/imagens";
import { db } from "../../src/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  getDoc,
  where,
  query,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../Context/AuthContext";
import { doc } from "firebase/firestore";

export const Navbar = ({ sidebar, setSidebar, setSelectedList }) => {
  const [navbar, setNavbar] = useState(false);
  const [listas, setListas] = useState([]);
  const [novaLista, setNovaLista] = useState("");
  const [showInput, setShowInput] = useState(false);
  const { user } = useAuth();

  const [infoPerfil, setInfoPerfil] = useState({
    nome: "",
    email: "",
  });

  useEffect(() => {
    const loadPerfil = async () => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInfoPerfil({
            nome: docSnap.data().nome || "Usuário",
            email: docSnap.data().email || user.email,
          });
        } else {
          await setDoc(docRef, {
            nome: user.displayName || "Usuário",
            email: user.email,
          });
          setInfoPerfil({
            nome: user.displayName || "Usuário",
            email: user.email,
          });
        }
      }
    };
    loadPerfil();
  }, [user]);

  const handlenavbar = () => {
    setNavbar(!navbar);
  };

  const fetchListas = async () => {
    if (!user) return;
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "listas"), where("userId", "==", user.uid))
      );
      const listasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListas(listasData);
    } catch (error) {
      console.error("Erro ao buscar listas: ", error);
    }
  };

  useEffect(() => {
    fetchListas();
  }, [user]);

  const handleAddLista = async () => {
    if (novaLista.trim() === "" || !user) return;
    try {
      await addDoc(collection(db, "listas"), {
        nome: novaLista,
        criadaEm: new Date(),
        userId: user.uid,
      });
      setNovaLista("");
      setShowInput(false);
      fetchListas();
    } catch (error) {
      console.error("Erro ao adicionar lista: ", error);
    }
  };

  const handleDeleteList = async (listaId) => {
    try {
      await deleteDoc(doc(db, "listas", listaId));
      setListas((prevListas) => prevListas.filter((lista) => lista.id !== listaId));
      setSelectedList(null);
    } catch (error) {
      console.error("Erro ao deletar lista: ", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddLista();
    }
  };

  const handleSelectList = (lista) => {
    setSelectedList(lista);
  };

  return (
    <>
      <button
        onClick={handlenavbar}
        className={`w-[40px] h-[40px] bg-blue-500 text-white absolute rounded-xl z-20 transition-all duration-300 ${
          navbar ? "left-[310px] top-2 bg-red-500" : "left-[5px] top-2"
        }`}
      >
        {navbar ? (
          <FontAwesomeIcon icon={faClose} />
        ) : (
          <FontAwesomeIcon icon={faRightLong} />
        )}
      </button>

      <div
        className={`navbar h-screen bg-gray-600 shadow-lg transition-all duration-300 ${
          navbar ? "w-1/4" : "w-[50px]"
        }`}
      >
        {navbar && (
          <div>
            <div className="flex bg-blue-300 text-white">
              <div className="flex flex-row items-center gap-8 p-2">
                <img
                  src={imagens.imgPerfil}
                  alt="Imagem de Perfil"
                  className="rounded-full w-[70px] h-[70px] object-cover"
                />
                <div className="flex-col">
                  <p className="text-lg font-semibold">{infoPerfil.nome}</p>
                  <p className="text-sm font-semibold">{infoPerfil.email}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col text-white mt-[20px]">
              <ul className="flex flex-col gap-1 p-2">
                <li className="h-9 flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-gray-500">
                  <FontAwesomeIcon icon={faSun} color="#c9ffff" />
                  Meu dia
                </li>
                <li className="h-9 flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-gray-500">
                  <FontAwesomeIcon icon={faStar} color="#d299da" />
                  Importante
                </li>
                <li className="h-9 flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-gray-500">
                  <FontAwesomeIcon icon={faTable} color="#3de0e0" />
                  Planejado
                </li>
                <li className="h-9 flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-gray-500">
                  <FontAwesomeIcon icon={faUser} color="#69fc7d" />
                  Atribuído a mim
                </li>
                <li className="h-9 flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-gray-500">
                  <FontAwesomeIcon icon={faHouse} color="#2f69c0" />
                  Tarefas
                </li>
              </ul>
              <hr className="my-5" />
              <ul className="flex flex-col gap-1 p-2">
                {listas.map((lista) => (
                  <li
                    key={lista.id}
                    className="h-9 flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-gray-500 justify-between"
                  >
                    <div className="flex items-center gap-4" onClick={() => handleSelectList(lista)}>
                      <FontAwesomeIcon icon={faList} color="#fff" />
                      {lista.nome}
                    </div>
                    <FontAwesomeIcon
                      icon={faTrash}
                      color="#ff6b6b"
                      className="cursor-pointer hover:text-red-700"
                      onClick={() => handleDeleteList(lista.id)}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute bottom-0 p-2">
              {showInput ? (
                <input
                  type="text"
                  value={novaLista}
                  onChange={(e) => setNovaLista(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nome da nova lista"
                  className="p-2 rounded-lg mb-2"
                />
              ) : (
                <button
                  onClick={() => setShowInput(true)}
                  className="text-white flex items-center gap-2 h-9 p-2 rounded-lg cursor-pointer hover:bg-gray-500 w-[280px]"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Nova Lista
                </button>
              )}
              {showInput && (
                <button
                  onClick={handleAddLista}
                  className="text-white flex items-center gap-2 h-9 p-2 rounded-lg cursor-pointer hover:bg-gray-500 w-[280px]"
                >
                  Adicionar
                </button>
              )}
            </div>
          </div>
        )}


        {!navbar && (
          <div className="h-screen flex flex-col justify-center items-center">
            <ul className="flex flex-col items-center gap-4">
              <li className="h-9 flex items-center p-4 rounded-lg cursor-pointer hover:bg-gray-500">
                <FontAwesomeIcon icon={faSun} color="#c9ffff" />
              </li>
              <li className="h-9 flex items-center p-4 rounded-lg cursor-pointer hover:bg-gray-500">
                <FontAwesomeIcon icon={faStar} color="#d299da" />
              </li>
              <li className="h-9 flex items-center p-4 rounded-lg cursor-pointer hover:bg-gray-500">
                <FontAwesomeIcon icon={faTable} color="#3de0e0" />
              </li>
              <li className="h-9 flex items-center p-4 rounded-lg cursor-pointer hover:bg-gray-500">
                <FontAwesomeIcon icon={faUser} color="#69fc7d" />
              </li>
              <li className="h-9 flex items-center p-4 rounded-lg cursor-pointer hover:bg-gray-500">
                <FontAwesomeIcon icon={faHouse} color="#2f69c0" />
              </li>
              <hr className="w-full" />
              {listas.map((lista) => (
                <li
                  key={lista.id}
                  className="h-9 flex items-center p-4 rounded-lg cursor-pointer hover:bg-gray-500"
                  onClick={() => handleSelectList(lista)}
                >
                  <FontAwesomeIcon icon={faList} color="#fff" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
