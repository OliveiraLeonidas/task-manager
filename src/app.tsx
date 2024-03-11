import { Check, Pencil, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "./components/ui/calendar";
import { Button } from "./components/ui/button";

interface Task {
  id: number;
  nameTask: string;
  dateDue: string;
  Status: string;
}

export function App() {
  const [date, setDate] = useState<Date>();
  const [input, setInput] = useState('');
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const formatDate = date ? format(date, 'dd/MM/yyyy') : '';
  const [data, setData] = useState<Task[]>(() => {
    const savedData = localStorage.getItem('taskData');
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    localStorage.setItem('taskData', JSON.stringify(data));
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const addTaskItem = () => {
    if (input.trim() === '') return; // Evitar adicionar tarefa vazia
    const newTask: Task = {
      id: Math.floor(Math.random() * 10000),
      nameTask: input,
      dateDue: formatDate,
      Status: 'to do',
    };
    setData([...data, newTask]);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDate(new Date());
    addTaskItem();
  };
  
  const removeTask = (itemId: number) => {
    const modifiedData = data.filter(item => item.id !== itemId);
    setData(modifiedData);
    localStorage.setItem('taskData', JSON.stringify(modifiedData));
  };

  const removeAllTasks = () => {
    setData([]);
    localStorage.removeItem('taskData');
  };

  const editTask = (itemId: number) => {
    const taskEdit = data.find(item => item.id === itemId);
    if (taskEdit) {
      setInput(taskEdit.nameTask);
      setDate(new Date(taskEdit.dateDue)); // Convertendo a string da data para um objeto Date
      setEditItemId(itemId);
    } else {
      console.error('Tarefa não encontrada');
    }
  };

  const saveEditedTask = () => {
    if (!editItemId) return;
    const updatedData = data.map(item => {
      if (item.id === editItemId) {
        return {
          ...item,
          nameTask: input,
          dateDue: formatDate,
        };
      }
      return item;
    });
    setData(updatedData);
    localStorage.setItem('taskData', JSON.stringify(updatedData));
    setInput('');
    setDate(new Date());
    setEditItemId(null);
  };

  return (
    <div className="bg-zinc-950 antialiased font-mono md:p-10 flex flex-col justify-center items-center">
      <main className="border border-teal-400 px-6 h-[920px] xl:max-w-6xl">
        <div className="text-slate-50 text-center text-lg py-8">
          To Do List Task
        </div>
        <form onSubmit={handleSubmit} className="flex justify-center gap-2 mt-6">
          <div className="flex items-center gap-2 text-zinc-400 rounded-full border border-dashed px-4 py-2">
            <Plus className="size-3"/>
            <input 
              value={input}
              onChange={handleChange}
              type="text" 
              placeholder="write your task"
              className="outline-none bg-transparent border-none placeholder:text-zinc-400 text-sm overflow-hidden"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={`text-zinc-400 font-mono w-[240px] justify-start text-left font-normal rounded-full border border-dashed border-zinc-400 ${!date ? "text-muted-foreground" : ""}`}
              >
                <CalendarIcon className="font-mono text-zinc-50 mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span className="text-zinc-400 font-mono">Date due</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="text-slate-50 w-auto font-mono p-0" align="start">
              <Calendar
                className="bg-zinc-950 text-zinc-50 font-mono"
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {editItemId !== null ? (
            <Button 
              onClick={saveEditedTask}
              className="bg-green-500 rounded-full text-zinc-50 border-none text-sm font-mono gap-2 hover:bg-green-600 hover:text-zinc-50"
            >
              Salvar
            </Button>
          ) : (
            <Button 
              type="submit"
              className="bg-teal-400 rounded-full text-zinc-50 border-none text-sm font-mono gap-2 hover:bg-teal-950 hover:text-zinc-50"
            >
              <Plus className="size-4"/>
              Add new task
            </Button>
          )}
          <Button
            onClick={removeAllTasks}
            className="bg-red-950 rounded-full text-red-600 border-none text-sm font-mono gap-2 hover:bg-red-500 hover:text-zinc-50"
          >
            <X className="size-4"/>
            Delete all
          </Button>
        </form>

        <div className="py-8 text-zinc-300">
          <table className="w-full">
            <thead>
              <tr className="flex justify-between gap-2">
                <th className="w-[25%] text-start">Tasks</th>
                <th className="w-[25%] text-start">Date due</th>
                <th className="w-[25%] text-start">Status</th>
                <th className="w-[25%] text-start">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="flex gap-2 justify-between border-t border-teal-600 py-2">
                  <td className="w-[25%] text-start overflow-scroll text-nowrap  [&::-webkit-scrollbar]:hidden">{item.nameTask}</td>
                  <td className="w-[25%] text-start">{item.dateDue}</td>
                  <td className="w-[25%] text-start">{item.Status}</td>
                  <td className="w-[25%] text-start flex gap-2">
                    {editItemId === item.id ? (
                      <Button 
                        onClick={() => saveEditedTask()}
                        className="bg-teal-600 rounded-xl text-zinc-50 border-none text-sm font-mono gap-2 hover:bg-teal-500 hover:text-zinc-50"
                      >
                        <Check className="size-4"/>
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => editTask(item.id)}
                        className="bg-teal-200 border border-zinc-600 rounded-xl text-slate-500"
                      >
                        <Pencil className="size-4" />
                      </Button>
                    )}
                    <Button 
                      onClick={() => removeTask(item.id)}
                      className="bg-red-950 border border-zinc-600 rounded-xl"
                    >
                      <X className="size-4"/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
