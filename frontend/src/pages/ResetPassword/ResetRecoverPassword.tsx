import Logo from "../../img/Logo.svg?react"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input/Input"

export const ResetRecoverPassword = () => {
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
                    Восстановление пароля   
                </span>
                <form className="flex flex-col mb-[14px] w-full"
                action="">
                    <Input id="password" point={false} type={"password"} label={"Пароль"}
                    placeholder={"Введите пароль"} styles={"mb-4 max-w-[490px]"} />
                    <Input id="confirm_password" point={false} 
                    type={"password"} label={"Подтверждение пароля"}
                    placeholder={"Подтвердите пароль"} styles={"mb-10 max-w-[490px]"} />
                    <Button onClick={handleClick} size="base"
                    text={"Восстановить"} type={"base"} styles={"max-w-[490px]"} />
                </form>
                <Button text={"Вернуться ко входу"} type={"without"}
                styles={"max-w-[217px] text-nowrap"} onClick={handleClick} size="base" />
            </div>
        </div>
    )
}