import { FC, HTMLAttributes, ReactNode, useState } from "react";
import clsx from "clsx";
import { IconArrow } from "../Iconify";

interface FormLayoutProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subTitle?: string;
  toggleIcon?: ReactNode;
  children: ReactNode;
}

const FormLayout: FC<FormLayoutProps> = ({
  title,
  subTitle,
  children,
  ...rest
}) => {
  const [collapse, setCollapse] = useState(false);

  const handleCollapse = () => setCollapse((prev) => !prev);

  return (
    <div className="font-public-sans rounded-lg shadow-lighter" {...rest}>
      <div
        onClick={handleCollapse}
        className="header flex items-start justify-between p-6 border-b border-solid border-[#919eab33] cursor-pointer"
      >
        <div className="info select-none">
          {title && (
            <div className="text-[18px] font-semibold text-[#1C252E]">
              {title}
            </div>
          )}
          {subTitle && (
            <div className="text-[14px] text-[#637381]">{subTitle}</div>
          )}
        </div>

        <div className="cursor-pointer">
          <span className="text-[#637381] transition duration-700">
            <IconArrow
              className={clsx(
                "transition-transform duration-500",
                collapse && "-rotate-90"
              )}
            />
          </span>
        </div>
      </div>

      <div
        className={clsx(
          "body overflow-hidden transition-all duration-500 ease-in-out",
          collapse ? "max-h-0 p-0 opacity-0" : "max-h-[1000px] p-6 opacity-100"
        )}
      >
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  );
};

export default FormLayout;
