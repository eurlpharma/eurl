import { Box } from "@mui/material";
import { cloneElement, FC, HTMLAttributes, ReactNode } from "react";

interface BoxServiceProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description: string;
  icon: ReactNode;
}

const BoxService: FC<BoxServiceProps> = ({
  title,
  description,
  icon,
  ...props
}) => {
  return (
    <Box {...props} className="box-services">
      <div className={"icon"}>
        {cloneElement(icon as React.ReactElement, {
          className: "svg",
        })}
      </div>
      <div className="info">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </Box>
  );
};

export default BoxService;
