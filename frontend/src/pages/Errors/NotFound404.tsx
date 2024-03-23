import Logo from "../../img/Logo.svg?react"
import { Button } from "../../components/Button"
import Error from "../../img/Error.svg?react"

export const NotFound404 = () => {
    const handleClick = () => {
        alert('Button Clicked!');
    };

    return (
        <div className="flex flex-col items-center h-[calc(100vh-50px)]">
            <Logo className="mt-20 mb-auto" />
            <div className="flex flex-col justify-center items-center mb-auto
            w-full max-w-[603px]">
                <Error className="mb-[60px]" />
                <p className="text-2xl mb-[60px] text-center">
                    Возможно страница была перемещена
                    <br />
                    или вы просто неверно указали адрес страницы
                </p>
                <Button onClick={handleClick} size="base"
                text={"Перейти на главную"} type={"base"} styles={"max-w-[490px]"} />
            </div>
        </div>
    )
}