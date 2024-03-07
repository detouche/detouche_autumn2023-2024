import Logo from "../../img/Logo.svg?react"
import { Button } from "../../components/Button"
import Error from "../../img/Error.svg?react"

export const NotFound404 = () => {
    return (
        <div className="flex flex-col items-center h-[100vh]">
            <Logo className="mt-20 mb-auto" />
            <div className="flex flex-col justify-center items-center mb-auto">
                <Error className="mb-[60px]" />
                <p className="text-2xl mb-[60px] text-center">
                    Возможно страница была перемещена
                    <br />
                    или вы просто неверно указали адрес страницы
                </p>
                <Button text={"Перейти на главную"} type={"base"} styles={"w-[490px]"} />
            </div>
        </div>
    )
}