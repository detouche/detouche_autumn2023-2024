import Logo from "../../img/Logo.svg?react"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input/Input"

export const Register = () => {
    return (
        <div className="flex flex-col items-center h-[100vh]">
            <Logo className="mt-20 mb-auto" />
            <div className="flex flex-col justify-center items-center mb-auto">
                <span className="text-[#000] text-[32px] font-bold
                mb-[60px]">
                    Регистрация
                </span>
                <form className="flex flex-col mb-[14px]"
                action="">
                    <Input type={"email"} label={"Почта"} placeholder={"Введите почту"}
                    styles={"mb-4"} />
                    <Input type={"password"} label={"Пароль"} placeholder={"Введите пароль"}
                    styles={"mb-10"} />
                    <Button text={"Зарегистрироваться"} type={"base"} styles={"w-[490px]"} />
                </form>
                <Button text={"Вход"} type={"without"} styles={""} />
            </div>
        </div>
    )
}