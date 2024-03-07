import Logo from "../../img/Logo.svg?react"
import { Button } from "../../components/Button"

export const ResetCheckEmail = () => {
    return (
        <div className="flex flex-col items-center h-[100vh]">
            <Logo className="mt-20 mb-auto" />
            <div className="flex flex-col justify-center items-center mb-auto">
                <span className="text-[#000] text-[32px] font-bold
                mb-[60px]">
                    Проверьте свою почту
                </span>
                <p className="text-2xl mb-[60px] text-center">
                    На ваш адрес электронной почты example@gmail.com
                    <br />
                    была отправлена ссылка для сброса пароля
                </p>
                <Button text={"Вернуться ко входу"} type={"base"} styles={"w-[490px]"} />
            </div>
        </div>
    )
}