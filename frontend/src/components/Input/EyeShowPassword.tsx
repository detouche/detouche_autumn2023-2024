import VisibilityOn from "../../img/visibility_on.svg?react"
import VisibilityOff from "../../img/visibility_off.svg?react"

export const EyeShowPassword = ({showPassword, setShowPassword, moveEye}:
    {showPassword: boolean, setShowPassword: Function, moveEye: boolean}) => {
    return (
        <div className={`absolute top-0 ${moveEye ? "right-12" : "right-3"} 
        cursor-pointer h-[100%] flex items-center`}
        onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <VisibilityOff /> : <VisibilityOn />}
        </div>
    )
}