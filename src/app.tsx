import { Plus, X } from "lucide-react";
import {useState} from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { cn } from "./lib/utils";
import { Button } from "./components/ui/button";
import { Calendar } from "./components/ui/calendar";


export function App() {
  const [date, setDate] = useState<Date>()
  const [input, setInput] = useState('')

  //const formatDate = format(date, 'dd/MM/yyyy')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  function handleSubmit() {
    console.log(date)
    console.log(input)
  }

  
  return (
    <div className="bg-zinc-950 antialiased font-mono md:p-10 flex flex-col justify-center items-center">
        <main className="border border-teal-400 px-6 h-[920px] xl:max-w-6xl">
          <div className="text-slate-50 text-center text-lg py-8">
              To Do List Task
          </div>
          <form 
              action="" 
              className="flex justify-center gap-2 mt-6">
            <div className="flex items-center gap-2 text-zinc-400 rounded-full border border-dashed px-4 py-2">
              <Plus className="size-3"/>
              <input 
                value={input}
                onChange={handleChange}
                type="text" 
                name="" 
                id="" 
                placeholder="write your task"
                className="outline-none bg-transparent border-none placeholder:text-zinc-400 text-sm"
                />
            </div>
           <Popover>
              <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      "text-zinc-400 font-mono w-[240px] justify-start text-left font-normal rounded-full border border-dashed border-zinc-400",
                      !date && "font-mono text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="font-mono text-zinc-50 mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span className="text-zinc-400 font-mono">Date due</span>}
                  </Button>
                </PopoverTrigger>
              <PopoverContent className="text-slate-50 w-auto font-mono p-0" align="start">
                  <Calendar
                    className="text-zinc-50 font-mono"
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    />
              </PopoverContent>
          </Popover>
            
          <Button 
            variant={"outline"} 
            className="bg-teal-400 rounded-full text-zinc-50 border-none text-sm font-mono gap-2 hover:bg-teal-950 hover:text-zinc-50"
            onClick={handleSubmit}
            >
            <Plus className="size-4"/>
            Add new task
          </Button>

          <Button variant={"destructive"} className="bg-red-950 rounded-full text-red-600 border-none text-sm font-mono gap-2 hover:bg-red-500 hover:text-zinc-50">
            <X className="size-4"/>
            Delete all
          </Button>
          </form>
        </main>
    </div>
  )
}
