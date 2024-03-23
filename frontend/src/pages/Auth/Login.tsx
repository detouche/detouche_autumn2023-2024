import Logo from "../../img/Logo.svg?react"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input/Input"

export const Login = () => {
    const handleClick = () => {
        alert('Button Clicked!');
    };

    return (
        <div className="flex flex-col items-center h-[calc(100vh-50px)]">
            <Logo className="mt-20 mb-auto" />
            <div className="flex flex-col justify-center items-center mb-auto
            w-full max-w-[490px]">
                <span className="text-[#000] text-[32px] font-bold
                mb-[60px]">
                    Авторизация
                </span>
                <form className="flex flex-col mb-[14px] w-full"
                action="">
                    <Input type={"email"} label={"Почта"} placeholder={"Введите почту"}
                    styles={"mb-4 max-w-[490px]"} point={false} id="email" />
                    <Input type={"password"} label={"Пароль"} placeholder={"Введите пароль"}
                    styles={"mb-10 max-w-[490px]"} point={false} id="password" />
                    <Button size="base" onClick={handleClick}
                    text={"Войти"} type={"base"}  styles={"max-w-[490px]"} />
                </form>
                <Button onClick={handleClick} size="base"
                text={"Регистрация"} type={"without"} 
                styles={"max-w-[150px]"} />
                <Button onClick={handleClick} size="base"
                text={"Восстановление пароля"} type={"without"}
                styles={"max-w-[260px] text-nowrap"} />
            </div>
        </div>
    )
}