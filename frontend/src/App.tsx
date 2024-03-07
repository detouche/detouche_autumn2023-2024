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

function App() {
  const course = {
    startDate: new Date('August 10, 2022'),
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
  const width = 1200

  //grid place-items-center h-[100vh]
  //h-[100vh] p-[25px]

  return (
    <div className="h-[100vh] p-[25px]">
      {/* <Button text={"Hello"} type={"error"} styles={"w-[200px]"} /> */}
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
    </div>
  )
}

export default App
