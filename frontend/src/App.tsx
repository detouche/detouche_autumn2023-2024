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
import { CardCalendar } from "./components/Calendar/CardCalendar/CardCalendar"
import { Calendar } from "./pages/Calendar"
import { SelectIndividual } from "./components/Select/SelectIndividual"
import { SelectGroup } from "./components/Select/SelectGroup"
import { SelectDate } from "./components/Select/SelectDate"

import Vite from "../public/vite.svg"

function App() {
  const course = {
    startDate: new Date('August 11, 2022'),
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
  const handleChange = (event: any) => {
    // console.log(event?.target.value)
  }

  return (
    <div className="grid place-items-center h-[100vh]">
      <Button text={"Hello"} type={"base"} size={"small"} styles={"max-w-[200px]"}
      onClick={handleClick} imgLeft="" imgRight={Vite} />
      {/* <button className="border-button">
        <ChevronLeft className="svg-button" />
      </button> */}
      {/* <Input id="search" type={"search"} placeholder={"Placeholder"} onChange={handleChange}
      point={true} label={"Label"} styles="max-w-[490px]" value={undefined} /> */}
      {/* <Login /> */}
      {/* <Register /> */}
      {/* <CheckEmail /> */}
      {/* <ResetEnterEmail /> */}
      {/* <ResetCheckEmail /> */}
      {/* <ResetRecoverPassword /> */}
      {/* <NotVerificate /> */}
      {/* <WrongLink error={"reset"} /> */}
      {/* <NotFound404 /> */}
      {/* <CardCalendar course={course} width={width} type="manage" /> */}
      {/* <Calendar /> */}
      {/* <SelectIndividual selectList={employee} styles="max-w-[490px]" label="Label"
      point={true} placeholder="Placeholder" /> */}
      {/* <SelectGroup selectList={employee} styles="max-w-[490px]" label="Label"
      point={true} placeholder="Placeholder" /> */}
      {/* <SelectDate type="finish" label="Label" point={true} placeholder="Placeholder"
      styles="max-w-[490px]" /> */}
    </div>
  )
}

export default App
