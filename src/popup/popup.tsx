import "../popup/popup.css";
import cross from "../assets/images/icon-cross.svg";
import { useState } from "react";



  type User = {
        id: string;
        text: string;
        checked: boolean;
        status: boolean;
      };

const INITIALDATA:User[] = [];

function Popup() {
  const [list, setList] = useState("");
  const [todo, setTodo] = useState(INITIALDATA);
  const [displayedTodos, setDisplayedTodos] = useState(INITIALDATA);
  const [activeColor,setActiveColor] = useState('all')


  // Get the list for the extension

  if (import.meta.env.VITE_IS_EXTENSION === "true") {
    chrome.storage.local.get(["items1"], (result) => {
      const todos = Array.isArray(result.items1) ? result.items1 : [];
      setTodo(todos);
      setDisplayedTodos(todos);
    });
  }
  // if (import.meta.env.VITE_IS_EXTENSION === "true") {
  //   chrome.storage.local.get(["colorsState"], (result) => {
  //     const colors = Array.isArray(result.items1) ? result.items1 : [];
  //     setActiveColor(todos);
  //   });
  // }

  const getInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setList(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(list.trim() === "") {
      alert('...')
      return
    }
    setTodo([
      ...todo,
      {
        id: crypto.randomUUID(),
        text: list,
        checked: false,
        status: false,
      },
    ]);
    setDisplayedTodos([
      ...todo,
      {
        id: crypto.randomUUID(),
        text: list,
        checked: false,
        status: false,
      },
    ]);

    // update the list for the extension

    if (import.meta.env.VITE_IS_EXTENSION === "true") {
      const formList = {
        id: crypto.randomUUID(),
        text: list,
        checked: false,
        status: false,
      };

      chrome.storage.local.get(["items"], (result) => {
        const allList =Array.isArray(result.items) ? result.items : [];
        const updatedList = [...allList, formList];
        chrome.storage.local.set({ items: updatedList }, () => {
          if(chrome.runtime.lastError) {
            console.error("Failed to save todo:", chrome.runtime.lastError);
            alert("Failed to save todo. Please try again.");
            return;
          }
          setList("");
          console.log("Data saved successfully");
        });
      });
      chrome.storage.local.get(["items1"], (result) => {
        const allList =Array.isArray(result.items1) ? result.items1 : [];
        const updatedList = [...allList, formList];
        chrome.storage.local.set({ items1: updatedList }, () => {
          if(chrome.runtime.lastError) {
            console.error("Failed to save todo:", chrome.runtime.lastError);
            alert("Failed to save todo. Please try again.");
            return;
          }
          setList("");
          console.log("Data saved successfully");
        });
      });
    }
    setList("");
    console.log(list);
  };

  const handleCheckedBoxChange = (id: string) => {
    
     const updatedTodos = todo.map((todo) =>
    todo.id === id ? { ...todo, checked: !todo.checked, status: !todo.status } : todo
  );
  setTodo(updatedTodos);
  setDisplayedTodos(
    activeColor === "active" 
      ? updatedTodos.filter((item) => !item.status) 
      : activeColor === "completed"
      ? updatedTodos.filter((item) => item.status)
      : updatedTodos 
  ); 

    // Updated the checkbox for the extension
    if (import.meta.env.VITE_IS_EXTENSION === "true") {
      chrome.storage.local.get(["items"], (result) => {
        const getList: User[] = Array.isArray(result.items) ?  result.items : [];
        const updateChecked = getList.map((its) =>
          its.id === id ? { ...its, checked: !its.checked,status:!its.status } : its
        );
        // chrome.storage.local.set({colorState:'all'})
        chrome.storage.local.set({ items: updateChecked }, () => {
          if(chrome.runtime.lastError) {
            console.log("Failed to update todo",chrome.runtime.lastError)
            alert("Failed to update todo. Please try again.");
            return
          }
          console.log("Checked updated successfully");
        });
      });
      chrome.storage.local.get(["items1"], (result) => {
        const getList: User[] = Array.isArray(result.items1) ?  result.items1 : [];
        const updateChecked = getList.map((its) =>
          its.id === id ? { ...its, checked: !its.checked,status:!its.status } : its
        );
        chrome.storage.local.set({ items1: updateChecked }, () => {
          if(chrome.runtime.lastError) {
            console.log("Failed to update todo",chrome.runtime.lastError)
            alert("Failed to update todo. Please try again.");
            return
          }
          console.log("Checked updated successfully");
        });
      });
    }

   
  };

  const deleteItemHandler = (id: string) => {
    setTodo((prev) => prev.filter((todo) => todo.id !== id));
    setDisplayedTodos((prev) => prev.filter((todo) => todo.id !== id));

    // Delete the checkbox for the extension
    if (import.meta.env.VITE_IS_EXTENSION === "true") {

      chrome.storage.local.get(["items"], (result) => {
        const getList: User[] = Array.isArray(result.items) ? result.items : [];
        const updateChecked = getList.filter((its) => its.id !== id);
        chrome.storage.local.set({ items: updateChecked }, () => {
         if(chrome.runtime.lastError) {
          console.error("Failed to delete todo:", chrome.runtime.lastError);
          alert("Failed to delete todo. Please try again.");
          return;
         }
         console.log("Todo item deleted successfully");
        });
      });
      chrome.storage.local.get(["items1"], (result) => {
        const getList: User[] = Array.isArray(result.items1) ? result.items1 : [];
        const updateChecked = getList.filter((its) => its.id !== id);
        chrome.storage.local.set({ items1: updateChecked }, () => {
         if(chrome.runtime.lastError) {
          console.error("Failed to delete todo:", chrome.runtime.lastError);
          alert("Failed to delete todo. Please try again.");
          return;
         }
         console.log("Todo item deleted successfully");
        });
      });
    }
  };

  const getClearHandler = () => {
    console.log(todo)
    const getStatusList = todo.filter((list) => list.status !== true)
   setTodo(getStatusList)
   setDisplayedTodos(getStatusList)

   if (import.meta.env.VITE_IS_EXTENSION === "true") {
    chrome.storage.local.get(["items"],(result) => {
      const getList = Array.isArray(result.items) ? result.items : []
      const filteredList = getList.filter((list) => list.status !== true)
      chrome.storage.local.set({items:filteredList}, () => {
        if(chrome.runtime.lastError) {
          console.log('Error deleting Completed List',chrome.runtime.lastError)
          alert('Error deleting Completed List')
          return
        }
        console.log("Completed List deleted Successfully")
     
      })
    })
    chrome.storage.local.get(["items1"],(result) => {
      const getList = Array.isArray(result.items1) ? result.items1 : []
      const filteredList = getList.filter((list) => list.status !== true)
      chrome.storage.local.set({items1:filteredList}, () => {
        if(chrome.runtime.lastError) {
          console.log('Error deleting Completed List',chrome.runtime.lastError)
          alert('Error deleting Completed List')
          return
        }
        console.log("Completed List deleted Successfully")
     
      })
    })
   }
  }

  const getActiveHandler = () => {
    setActiveColor('active')
    const getActive = todo.filter((items) => items.status === false )
    setDisplayedTodos(getActive)
    if (import.meta.env.VITE_IS_EXTENSION === "true") {
    chrome.storage.local.get(["items"],(result) => {
      const todo:User[] = Array.isArray(result.items) ? result.items : []
      const getActive = todo.filter((items) => items.status === false )
      chrome.storage.local.set({items1:getActive},() => {
        setDisplayedTodos(getActive)
        chrome.storage.local.get(["items1"], (result) => {
          if(chrome.runtime.lastError) {
            console.log("An Error Occured",chrome.runtime.lastError)
            console.log(result)
            return
          }

        })
        console.log(getActive,"From Inside")
        setDisplayedTodos(getActive)
        console.log("Item Pushed Successfully")

      })
      setDisplayedTodos(getActive)

    })
  }
    
  }
  const getAllHandler = () => {
    setActiveColor('all')
    setDisplayedTodos(todo)
    if (import.meta.env.VITE_IS_EXTENSION === "true") {
    chrome.storage.local.get(["items"],(result) => {
      const todo:User[] = Array.isArray(result.items) ? result.items : []
      chrome.storage.local.set({items1:todo},() => {
        setDisplayedTodos(todo)

      })
      setDisplayedTodos(todo)

    })
  }
  }
  const completedHandler = () => {
    setActiveColor('completed')
    const getActive = todo.filter((items) => items.status === true )
    setDisplayedTodos(getActive)
     if (import.meta.env.VITE_IS_EXTENSION === "true") {
    chrome.storage.local.get(["items"],(result) => {
      console.log(result.items,"From Outside")
      const todo:User[] = Array.isArray(result.items) ? result.items : []
      const getActive = todo.filter((items) => items.status === true )
      chrome.storage.local.set({items1:getActive},() => {
        setDisplayedTodos(getActive)
        chrome.storage.local.get(["items1"], (result) => {
          console.log(result.items1)

        })
        console.log(getActive,"From Inside")
        setDisplayedTodos(getActive)
        console.log("Item Pushed Successfully")

      })
      setDisplayedTodos(getActive)

    })
  }
    
  }

  return (
    <div className="w-[375px] bg-very-light-gray min-h-[700px] h-screen overflow-scroll">
      <div className="bg-[url('/background.jpg')] bg-cover bg-center h-40 relative pt-8 px-4">
        <h1 className="text-white font-bold tracking-widest">TODO</h1>
        <div>
          <div className="w-full mt-6 mb-8">
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Create a new todo..."
                onChange={getInputHandler}
                value={list}
                className="rounded-lg px-4 h-12 w-full font-Josefin placeholder:text-sm focus-within:outline-0"

              />
            </form>
          </div>
          <div className="bg-white rounded-lg p-4 -translate-y-4 shadow-lg shadow-black/10">
            <ul className="space-y-4 ">
              {
                displayedTodos.length === 0 && <p className="font-Josefin text-gray-800 font-medium flex justify-center text-base">No tasks for now</p>
              }
              {
              displayedTodos.map((item) => (
                <li
                  className="flex justify-between items-center py-2 w-full full-width-border"
                  key={item.id}
                >
                  <div className="flex gap-4">
                    <label className="flex gap-4 items-center">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      id={`checkbox-${item.id}`}
                      checked={item.checked}
                      onChange={() => handleCheckedBoxChange(item.id)}
                    />
                    <p
                      className={`font-Josefin text-gray-500 text-wrap max-w-[200px] break-words whitespace-normal hover:text-gray-600 hover:cursor-pointer text-sm ${
                        item.checked &&
                        "line-through text-very-light-grayish-blue hover:text-very-light-grayish-blue hover:cursor-pointer select-none"
                      }`}
                    >
                      {item.text}
                    </p>
                    </label>
                  </div>{" "}
                  <span>
                    <button
                      className="bg-white hover:bg-white"
                      onClick={() => deleteItemHandler(item.id)}
                    >
                      <img src={cross} alt="delete-icon" className="size-4" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
           
               <div className="flex font-Josefin justify-between items-center  pt-4  text-gray-600 font-semibold text-sm">
            <p>{`${displayedTodos.length} items left`}</p>
            <button className="bg-white hover:bg-white hover:text-gray-700" onClick={getClearHandler}> Clear Completed</button>
            </div>
    
          </div>
          <div className="bg-white rounded-lg shadow-xl shadow-black/10">
               <ul className="flex font-Josefin gap-4 items-center justify-center px-12 py-4  text-gray-600 font-semibold text-sm cursor-pointer">
              <li className={`select-none ${activeColor === 'all' && "text-blue-600 hover:text-blue-800" }`} onClick={getAllHandler}>All</li>
              <li className={`hover:text-gray-700 select-none ${activeColor === 'active' && "text-blue-600 hover:text-blue-800" }`} onClick={getActiveHandler}>Active</li>
              <li onClick={completedHandler} className={`select-none ${activeColor === 'completed' && "text-blue-600 hover:text-blue-800"} `}>Completed</li>
            </ul>
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default Popup;
