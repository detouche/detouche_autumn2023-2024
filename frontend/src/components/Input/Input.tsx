import { useState } from "react"
import { EyeShowPassword } from "./EyeShowPassword"
import RedPoint from "../../img/red_point.svg?react"

export const Input = ({type, label, placeholder, point, styles}:
    {type: string, label:string, placeholder:string, point: boolean, styles: string}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [moveEye, setMoveEye] = useState(false)
  
    return (
        <div className="float-left">
            <div className="flex items-baseline">
                <label className="block text-s-gray-900 text-base mr-1" 
                htmlFor="input">
                    {label}
                </label>
                {point && <RedPoint />}            
            </div>
            <div className="relative">
                <input onFocus={() => setMoveEye(true)} onBlur={() => setMoveEye(false)}
                className={`p-[12px_14px] outline-none rounded-lg border
                border-s-gray-150 placeholder:text-s-gray-200 placeholder:text-lg block
                hover:shadow-accent3px focus:shadow-accent3px text-lg text-s-gray-900
                invalid:border-s-error-300 w-[490px] ${styles}`}
                type={type == "password" ? (showPassword ? "text" : "password") : type} 
                placeholder={placeholder} id="input" />
                {type == "password" &&
                    <EyeShowPassword showPassword={showPassword}
                    setShowPassword={setShowPassword} moveEye={moveEye} />
                }
            </div>
        </div>
    )
}