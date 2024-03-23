import Logo from "../../img/Logo.svg?react"
import { Button } from "../../components/Button"

export const WrongLink = ({error} : {error: string}) => {
    const handleClick = () => {
        alert('Button Clicked!');
    };

    return (
        <div className="flex flex-col items-center h-[calc(100vh-50px)]">
            <Logo className="mt-20 mb-auto" />
            <div className="flex flex-col justify-center items-center mb-auto
            w-full max-w-[747px]">
                <span className="text-[#000] text-[32px] font-bold
                mb-[60px]">
                    Неверная ссылка
                </span>
                <p className="text-2xl mb-[60px] text-center">
                    Вы нажали на неверную ссылку для 
                    {error == "verificate" ? " подтверждения регистрации." :
                    (error == "reset" && " сброса пароля.")}
                    <br />
                    Попробуйте ещё раз.
                </p>
                <Button onClick={handleClick} size="base"
                text={error == "verificate" ? "Регистрация" :
                (error == "reset" ? "Восстановление пароля" : "")}
                type={"base"} styles={"max-w-[490px] mb-3"} />
                <Button onClick={handleClick} size="base"
                text={"Вход"} type={"without"} styles={"max-w-[76px]"} />
            </div>
        </div>
    )
}