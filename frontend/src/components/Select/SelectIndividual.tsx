import RedPoint from "../../img/red_point.svg?react"
import Chevron from "../../img/chevron_left.svg?react"
import { useState } from "react"

// используется для селекта одного элемента, передавать можно: лейбл, плейсхолдер,
// красную точку сверху, массив элементов для селекта, а также стили
export const SelectIndividual = ({label, placeholder, point, selectList, styles}:
    {label: string, placeholder: string, point: boolean, selectList: object[],
        styles: string}) => {
    // выбранный элемент
    const [selectedData, setSelectedData] = useState("")
    // показ дропдауна
    const [dropdown, setDropdown] = useState(false)
    // массив элементов для селекта
    const [list, setList] = useState(selectList)
    // поиск элемента в инпуте 
    const handleSearch = (search) => {
        if (search != "") {
            const filteredData = selectList.filter(
                item => item.name.toLowerCase().startsWith(search.toLowerCase())
            )
            setList(filteredData)
        } else {
            setList(selectList)
        }
    }
    // ввод в инпут
    const handleChange = (e) => {
        setSelectedData(e.target.value)
        handleSearch(e.target.value);
    }
    
    return (
        <div className="float-left">
            <div className="flex items-baseline">
                <label className="block text-s-gray-900 text-base mr-1" 
                htmlFor="select">
                    {label}
                </label>
                {point && <RedPoint />}            
            </div>
            <div className="relative">
                <input onChange={handleChange} 
                onFocus={() => setDropdown(true)}
                value={selectedData?.name}
                className={`p-[12px_14px] outline-none border
                border-s-gray-150 placeholder:text-s-gray-200 placeholder:text-lg block
                text-lg text-s-gray-900
                invalid:border-s-error-300 w-[490px]
                ${dropdown ? 'rounded-t-lg' : 'rounded-lg'} ${styles}`}
                placeholder={placeholder} id="input" />
                <Chevron onClick={() => {
                    dropdown ? setDropdown(false) : setDropdown(true)
                }}
                className={`fill-s-gray-900 absolute top-3 cursor-pointer
                right-5 ${dropdown ? 'rotate-90' :'-rotate-90'}`} />
                {dropdown && (
                <ul className="list-none absolute left-0 right-0 border-s-gray-150
                max-h-[200px] overflow-y-auto bg-white border rounded-b-lg">
                    {list.slice(0,10).map((data) => {   
                        return (
                            <li onClick={() => {
                                setSelectedData(data)
                                setDropdown(false)
                            }}
                            className="py-3 px-[14px]
                            transition-colors cursor-pointer hover:bg-s-gray-50">
                                <p className="text-black text-[18px]">
                                    {data.name}
                                </p>
                                <span className="text-s-gray-300 text-[12px]">
                                    {data.post}
                                </span>         
                            </li> 
                        )
                    })}
                </ul>)}
            </div>
        </div>
    )
}