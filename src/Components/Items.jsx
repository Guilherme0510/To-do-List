import {
    faCheck,
    faPlus,
    faStar,
    faTrash,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import React, { useState, useEffect } from "react";
  import { db } from "../../src/firebaseConfig"; 
  import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    deleteDoc,
  } from "firebase/firestore";
  
  export const Items = ({ selectedList }) => {
    const [itens, setItens] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [addItem, setAddItem] = useState(false);
    const [newItemText, setNewItemText] = useState("");
  
    useEffect(() => {
      const fetchItens = async () => {
        if (!selectedList) return; 
        try {
          const itensRef = collection(db, "itens");
          const q = query(itensRef, where("listaId", "==", selectedList.id));
          const querySnapshot = await getDocs(q);
          const itensData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setItens(itensData);
        } catch (error) {
          console.error("Erro ao buscar itens: ", error);
        }
      };
  
      fetchItens();
    }, [selectedList]);
  
    const handleCheckboxChange = (itemId) => {
      setItens((prevItens) =>
        prevItens.map((item) =>
          item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
        )
      );
  
      setSelectedItems((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(itemId)) {
          newSelected.delete(itemId);
        } else {
          newSelected.add(itemId);
        }
        return newSelected;
      });
    };
  
    const handleStarChange = (itemId) => {
      setItens((prevItens) =>
        prevItens.map((item) =>
          item.id === itemId ? { ...item, isStarred: !item.isStarred } : item
        )
      );
    };
  
    const handleDelete = async () => {
      try {
        await Promise.all(
          Array.from(selectedItems).map(async (itemId) => {
            const itemDocRef = doc(db, "itens", itemId);
            await deleteDoc(itemDocRef);
          })
        );
  
        setItens((prevItens) =>
          prevItens.filter((item) => !selectedItems.has(item.id))
        );
        setSelectedItems(new Set());
      } catch (error) {
        console.error("Erro ao deletar itens: ", error);
      }
    };
  
    const handleAddItem = async () => {
      if (newItemText.trim()) {
        const newItem = {
          text: newItemText,
          isChecked: false,
          isStarred: false,
          listaId: selectedList.id,
        };
  
        const itemRef = collection(db, "itens");
        const docRef = await addDoc(itemRef, newItem);
  
        setItens((prevItens) => [
          ...prevItens,
          { id: docRef.id, ...newItem },
        ]);
  
        setNewItemText("");
        setAddItem(false);
      }
    };
  
    const starredItems = itens.filter((item) => item.isStarred);
    const nonStarredItems = itens.filter((item) => !item.isStarred);
  
    return (
      <div className="bg-white h-screen flex flex-col gap-2 relative">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-16">
          {selectedList ? selectedList.nome : "Selecione uma Lista"}
        </h1>
        <div className="absolute right-16 top-14 flex gap-5">
          <button
            onClick={() => setAddItem(true)}
            className="text-white px-4 py-2 rounded-lg bg-blue-500 font-semibold"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
  
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            disabled={selectedItems.size === 0}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
  
        {addItem && (
          <div className="absolute h-screen w-screen z-10 top-0 left-0 flex justify-center items-center">
            <div className="absolute h-screen w-full bg-gray-700 opacity-80"></div>
  
            <div className="relative flex flex-col text-center justify-center items-center bg-white h-2/4 w-[450px] z-30 rounded-2xl pt-10">
              <h2 className="text-lg font-bold mb-4">Adicionar Item</h2>
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Novo Item"
                className="border border-gray-300 rounded-lg p-2 mb-4 w-52"
              />
              <button
                onClick={handleAddItem}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold w-52"
              >
                Adicionar
              </button>
              <button
                onClick={() => setAddItem(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold mt-2 w-52"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
  
        <div className="px-[60px] flex flex-col gap-4">
          {starredItems.map((item) => (
            <div
              key={item.id}
              className={`w-full px-6 h-16 border border-gray-200 gap-10 flex items-center flex-row rounded-2xl hover:bg-gray-200 ${
                item.isChecked ? "bg-gray-400 hover:bg-gray-400" : "bg-white"
              }`}
            >
              <button
                onClick={() => handleCheckboxChange(item.id)}
                className={`border border-black rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                  item.isChecked ? "bg-blue-500 border-white" : "bg-white"
                }`}
              >
                {item.isChecked && (
                  <span className="text-white">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                )}
              </button>
  
              <p className="text-lg font-semibold flex-grow">{item.text}</p>
  
              <span
                onClick={() => handleStarChange(item.id)}
                className={`cursor-pointer transition-all duration-300 text-xl ${
                  item.isStarred ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faStar} />
              </span>
            </div>
          ))}
  
          {nonStarredItems.map((item) => (
            <div
              key={item.id}
              className={`w-full px-6 h-16 border border-gray-200 gap-10 flex items-center flex-row rounded-2xl hover:bg-gray-200 ${
                item.isChecked ? "bg-gray-400 hover:bg-gray-400" : "bg-white"
              }`}
            >
              <button
                onClick={() => handleCheckboxChange(item.id)}
                className={`border border-black rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                  item.isChecked ? "bg-blue-500 border-white" : "bg-white"
                }`}
              >
                {item.isChecked && (
                  <span className="text-white">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                )}
              </button>
  
              <p className="text-lg font-semibold flex-grow">{item.text}</p>
  
              <span
                onClick={() => handleStarChange(item.id)}
                className={`cursor-pointer transition-all duration-300 text-xl ${
                  item.isStarred ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faStar} />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  