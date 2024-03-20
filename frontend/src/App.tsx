/// <reference types="vite-plugin-svgr/client" />
import { Button } from "./components/Button"
import { Input } from "./components/Input/Input"
import ChevronLeft from "./img/chevron_left.svg?react"
import { Login } from "./pages/Auth/Login"
import { Register } from "./pages/Auth/Register"
import { CheckEmail } from "./pages/Auth/CheckEmail"
import { ResetEnterEmail } from "./pages/ResetPassword/ResetEnterEmail"
import { ResetCheckEmail } from "./pages/ResetPassword/ResetCheckEmail"
import { ResetRecoverPassword } from "./pages/ResetPassword/ResetRecoverPassword"
import { NotVerificate } from "./pages/Errors/NotVerificate"
import { WrongLink } from "./pages/Errors/WrongLink"
import { NotFound404 } from "./pages/Errors/NotFound404"
import { CalendarMonth } from "./components/Calendar/CalendarMonth"
import { CalendarWeek } from "./components/Calendar/CalendarWeek"
import { CardCalendar } from "./components/Calendar/CardCalendar/CardCalendar"
import { Calendar } from "./pages/Calendar"
import { DataPicker } from "./components/DataPicker"
import { SelectIndividual } from "./components/Select/SelectIndividual"
import { SelectGroup } from "./components/Select/SelectGroup"
import { SelectDate } from "./components/Select/SelectDate"

function App() {
  const course = {
    startDate: new Date('August 14, 2022'),
    endDate: new Date('August 18, 2022'),
    title: "Detouche Front",
    type: "Очный",
    category: "Soft skills",
    membersData: [
      {
        surname: "Messi",
        name: "Leo",
        patronymic: "Jorgevich"
      },
      {
        surname: "Ronaldo",
        name: "Cristiano",
        patronymic: "Jozevich"
      },
      {
        surname: "Hauland",
        name: "Erling",
        patronymic: "Ingevich"
      },
    ]
  }

  const employee = [
    {
      name: "Valdes",
      post: "goalkeeper"
    },
    {
      name: "Alves",
      post: "defender"
    },
    {
      name: "Pique",
      post: "defender"
    },
    {
      name: "Puyol",
      post: "defender"
    },
    {
      name: "Abidal",
      post: "defender"
    },
    {
      name: "Busquets",
      post: "midfielder"
    },
    {
      name: "Xavi",
      post: "midfielder"
    },
    {
      name: "Iniesta",
      post: "midfielder"
    },
    {
      name: "Villa",
      post: "striker"
    },
    {
      name: "Pedro",
      post: "striker"
    },
    {
      name: "Messi",
      post: "striker"
    },
    {
      name: "Mascherano",
      post: "defender"
    },
    {
      name: "Bojan",
      post: "striker"
    },
    {
      name: "Pinto",
      post: "goalkeeper"
    },
]

  const width = 1200

  //grid place-items-center h-[100vh]
  //h-[100vh] p-[25px]
  const handleClick = () => {
    alert('Button Clicked!');
  };

  return (
    <div className="h-[100vh] p-[25px]">
      {/* <Button text={"Hello"} type={"base"} size={"base"} styles={"w-[200px]"}
      onClick={handleClick} /> */}
      {/* <button className="border-button">
        <ChevronLeft className="svg-button" />
      </button> */}
      {/* <Input type={"search"} placeholder={"Placeholder"}
      point={true} label={"Label"} styles="" /> */}
      {/* <Login /> */}
      {/* <Register /> */}
      {/* <CheckEmail /> */}
      {/* <ResetEnterEmail /> */}
      {/* <ResetCheckEmail /> */}
      {/* <ResetRecoverPassword /> */}
      {/* <NotVerificate /> */}
      {/* <WrongLink error={"reset"} /> */}
      {/* <NotFound404 /> */}
      {/* <CalendarMonth /> */}
      {/* <CalendarWeek /> */}
      {/* <CardCalendar course={course} width={width} type="hard" /> */}
      <Calendar />
      {/* <DataPicker type="start" /> */}
      {/* <SelectIndividual selectList={employee} styles="" label="Label"
      point={true} placeholder="Placeholder" /> */}
      {/* <SelectGroup selectList={employee} styles="" label="Label"
      point={true} placeholder="Placeholder" /> */}
      {/* <SelectDate type="finish" label="Label" point={true} placeholder="Placeholder"
      styles="" /> */}
    </div>
  )
}

export default App
