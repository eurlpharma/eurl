import { Container } from "@mui/material";
import { FC, HTMLAttributes } from "react";
import {
  leftContact,
  linkControlls,
  linksNavbar,
  rightContact,
} from "./NavTopItems";
import clsx from "clsx";
import { IconWhatsapp } from "../Iconify";
import { useNavigate } from "react-router-dom";

interface NavbarProps extends HTMLAttributes<HTMLElement> {
  isBlur?: boolean;
  isTransparent?: boolean;
}

const Navbar: FC<NavbarProps> = ({ isBlur, isTransparent, ...props }) => {
  const navigate = useNavigate();

  return (
    <nav
      {...props}
      className={clsx(
        "absolute w-full top-0 left-0 z-50 bg-black lg:bg-black/15 font-opensans hidden"
      )}
    >
      <div className="top border-solid border-b-1 border-[#ffffff36]">
        <Container
          maxWidth="xl"
          className="flex items-center justify-between h-11 text-white"
        >
          <div className="lt">
            <div className="flex items-center gap-6">
              {leftContact.map((c) => (
                <div key={c.href} className="cursor-pointer">
                  <c.icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
          <div className="rt">
            <div className="flex items-center gap-6">
              {rightContact.map((c) => (
                <div key={c.href} className="flex items-center gap-0.5">
                  <c.icon className="h-5" />
                  <p className="text-tiny">{c.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <div className="bottom">
        <Container
          maxWidth="xl"
          className="flex items-center justify-between h-20"
        >
          <div className="lt">
            <div className="flex items-center gap-2 uppercase">
              <IconWhatsapp className="h-10 w-10 text-room-900" />
              <p className="text-2xl font-bold text-white">healthy</p>
            </div>
          </div>

          <div className="cr">
            <div className="flex items-center gap-8">
              {linksNavbar.map((l) => (
                <div
                  key={l.href}
                  className="flex items-center gap-0.5"
                  onClick={() => navigate(l.href)}
                >
                  <p
                    className={clsx(
                      "text-white uppercase select-none cursor-pointer text-sm",
                      "font-montserat transition-colors hover:text-room-900"
                    )}
                  >
                    {l.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rt text-white">
            <div className="flex items-center gap-6">
              {linkControlls.map((lc, index) => (
                <div className="cursor-pointer" key={index}>
                  <lc.icon className="h-6" />
                </div>
              ))}
            </div>
          </div>

        </Container>
      </div>
    </nav>
  );
};

export default Navbar;
