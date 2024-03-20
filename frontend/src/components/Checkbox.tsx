import Check from "../img/check.svg?react"

export const Checkbox = ({filterChecked}: {filterChecked: boolean}) => {
    return (
        <div className="inline-flex items-center">
            <label className="relative flex items-center p-3
            rounded-full cursor-pointer"
            htmlFor="custom">
                <input checked={filterChecked} placeholder="checkbox" type="checkbox"
                className="peer relative appearance-none w-[20px] h-[20px]
                border rounded border-s-gray-900
                cursor-pointer transition-all before:content['']
                before:block before:bg-s-gray-900
                before:w-12 before:h-12 before:rounded-full
                before:absolute before:top-2/4 before:left-2/4
                before:-translate-y-2/4 before:-translate-x-2/4
                before:opacity-0 hover:before:opacity-10
                before:transition-opacity checked:bg-s-gray-900
                checked:border-s-gray-900 checked:before:bg-s-gray-900"
                id="custom"/>
                <span className="absolute text-white transition-opacity
                opacity-0 pointer-events-none top-2/4 left-2/4
                -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <Check />
                </span>
            </label>
        </div>               
    )
}