import Logo from "../../img/Logo.svg?react"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input/Input"

export const ResetEnterEmail = () => {
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
                    <Input type={"email"} label={"Почта"} placeholder={"Введите почту"}
                    styles={"max-w-[490px] mb-10"} point={false} id="email" />
                    <Button onClick={handleClick} size="base" 
                    text={"Далее"} type={"base"} styles={"max-w-[490px]"} />
                </form>
                <Button onClick={handleClick} text={"Вернуться ко входу"} type={"without"}
                styles={"max-w-[217px] text-[20px] text-nowrap"} size="base" />
            </div>
        </div>
    )
}