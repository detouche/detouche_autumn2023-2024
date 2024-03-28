import RedPoint from "../img/red_point.svg?react";

export const Textarea = ({
  label,
  placeholder,
  point,
  styles,
}: {
  label: string;
  placeholder: string;
  point: boolean;
  styles: string;
}) => {
  const textAreaAutoResize = (event) => {
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight+2}px`;
  };
  return (
    <div className="float-left">
      <div className="flex items-baseline">
        <label
          className="block text-s-gray-900 text-base mr-1"
          htmlFor="textarea"
        >
          {label}
        </label>
        {point && <RedPoint />}
      </div>
      <div className="relative">
        <textarea
          className={`p-[12px_14px] outline-none rounded-lg border
                border-s-gray-150 placeholder:text-s-gray-200 placeholder:text-lg block
                hover:shadow-accent3px focus:shadow-accent3px text-lg text-s-gray-900
                invalid:border-s-error-300 w-[490px] resize-none ${styles}`}
          placeholder={placeholder}
          id="textarea"
          onInput={textAreaAutoResize}
        ></textarea>
      </div>
    </div>
  );
};
