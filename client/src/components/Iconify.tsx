import { FC, SVGProps } from "react";

type IconifyProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const IconTwitter: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M2 18.5C3.765 19.521 5.814 20 8 20c6.48 0 11.762-5.137 11.992-11.562L22 4.5l-3.354.5A4 4 0 0 0 16 4c-2.572 0-4.5 2.517-3.88 4.98c-3.552.23-6.771-1.959-8.633-4.875c-1.236 4.197-.09 9.251 3.013 12.366c0 1.176-3 1.878-4.5 2.029"
        color="currentColor"
      ></path>
    </svg>
  );
};

export const IconTwitterSolid: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.2 4.2 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.52 8.52 0 0 1-5.33 1.84q-.51 0-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23"
      ></path>
    </svg>
  );
};

export const IconFacebook: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"
      ></path>
    </svg>
  );
};

export const IconFacebookBold: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
      ></path>
    </svg>
  );
};

export const IconGooglePlus: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.364 11.455h6.009c.054.318.1.636.1 1.054c0 3.636-2.437 6.218-6.11 6.218A6.36 6.36 0 0 1 2 12.364A6.36 6.36 0 0 1 8.364 6c1.718 0 3.154.627 4.263 1.664L10.9 9.327c-.473-.454-1.3-.982-2.536-.982c-2.173 0-3.946 1.8-3.946 4.019c0 2.218 1.773 4.018 3.946 4.018c2.518 0 3.463-1.81 3.609-2.746h-3.61zm13.636 0v1.818h-1.818v1.818h-1.818v-1.818h-1.819v-1.818h1.819V9.636h1.818v1.819z"
      ></path>
    </svg>
  );
};

export const IconInstagram: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M13.028 2c1.125.003 1.696.009 2.189.023l.194.007c.224.008.445.018.712.03c1.064.05 1.79.218 2.427.465c.66.254 1.216.598 1.772 1.153a4.9 4.9 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428c.012.266.022.487.03.712l.006.194c.015.492.021 1.063.023 2.188l.001.746v1.31a79 79 0 0 1-.023 2.188l-.006.194c-.008.225-.018.446-.03.712c-.05 1.065-.22 1.79-.466 2.428a4.9 4.9 0 0 1-1.153 1.772a4.9 4.9 0 0 1-1.772 1.153c-.637.247-1.363.415-2.427.465l-.712.03l-.194.006c-.493.014-1.064.021-2.189.023l-.746.001h-1.309a78 78 0 0 1-2.189-.023l-.194-.006a63 63 0 0 1-.712-.031c-1.064-.05-1.79-.218-2.428-.465a4.9 4.9 0 0 1-1.771-1.153a4.9 4.9 0 0 1-1.154-1.772c-.247-.637-.415-1.363-.465-2.428l-.03-.712l-.005-.194A79 79 0 0 1 2 13.028v-2.056a79 79 0 0 1 .022-2.188l.007-.194c.008-.225.018-.446.03-.712c.05-1.065.218-1.79.465-2.428A4.9 4.9 0 0 1 3.68 3.678a4.9 4.9 0 0 1 1.77-1.153c.638-.247 1.363-.415 2.428-.465c.266-.012.488-.022.712-.03l.194-.006a79 79 0 0 1 2.188-.023zM12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10m0 2a3 3 0 1 1 .001 6a3 3 0 0 1 0-6m5.25-3.5a1.25 1.25 0 0 0 0 2.5a1.25 1.25 0 0 0 0-2.5"
      ></path>
    </svg>
  );
};

export const IconWhatsapp: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
        <path
          fill="currentColor"
          d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1.01 1.01 0 0 0 3.8 21.454l3.032-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2M9.738 14.263c2.023 2.022 3.954 2.289 4.636 2.314c1.037.038 2.047-.754 2.44-1.673a.7.7 0 0 0-.088-.703c-.548-.7-1.289-1.203-2.013-1.703a.71.71 0 0 0-.973.158l-.6.915a.23.23 0 0 1-.305.076c-.407-.233-1-.629-1.426-1.055s-.798-.992-1.007-1.373a.23.23 0 0 1 .067-.291l.924-.686a.71.71 0 0 0 .12-.94c-.448-.656-.97-1.49-1.727-2.043a.7.7 0 0 0-.684-.075c-.92.394-1.716 1.404-1.678 2.443c.025.682.292 2.613 2.314 4.636"
        ></path>
      </g>
    </svg>
  );
};

export const IconTelegram: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c-.01.06.01.24 0 .38"
      ></path>
    </svg>
  );
};

export const IconPhoneLine: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233a14 14 0 0 0 6.392 6.384"
      ></path>
    </svg>
  );
};

export const IconEmail: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"
      ></path>
    </svg>
  );
};

export const IconTime: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none">
        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
        <path
          fill="currentColor"
          d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 4a1 1 0 0 0-1 1v5a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V7a1 1 0 0 0-1-1"
        ></path>
      </g>
    </svg>
  );
};

export const IconSearch: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11.5a7.5 7.5 0 1 1-15 0a7.5 7.5 0 0 1 15 0m-2.107 5.42l3.08 3.08"
      ></path>
    </svg>
  );
};

export const IconCart: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M17 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.61-1 1.03-1.75 1.03H8.1l-.9 1.63l-.03.12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.09-.68.24-.96l1.36-2.45L3 4H1zm6 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5z"
      ></path>
    </svg>
  );
};

export const IconCartBold: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M17 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2M1 2v2h2l3.6 7.59l-1.36 2.45c-.15.28-.24.61-.24.96a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25q0-.075.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 0 0-1-1H5.21l-.94-2M7 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2"
      ></path>
    </svg>
  );
};

export const IconDelivery: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        color="currentColor"
      >
        <circle cx={17} cy={18} r={2}></circle>
        <circle cx={7} cy={18} r={2}></circle>
        <path d="M5 17.972c-1.097-.054-1.78-.217-2.268-.704s-.65-1.171-.704-2.268M9 18h6m4-.028c1.097-.054 1.78-.217 2.268-.704C22 16.535 22 15.357 22 13v-2h-4.7c-.745 0-1.117 0-1.418-.098a2 2 0 0 1-1.284-1.284C14.5 9.317 14.5 8.945 14.5 8.2c0-1.117 0-1.675-.147-2.127a3 3 0 0 0-1.926-1.926C11.975 4 11.417 4 10.3 4H2m0 4h6m-6 3h4"></path>
        <path d="M14.5 6h1.821c1.456 0 2.183 0 2.775.354c.593.353.938.994 1.628 2.276L22 11"></path>
      </g>
    </svg>
  );
};

export const IconDeliveryBold: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m22.031 10.875l-2.136-3.543a1.76 1.76 0 0 0-1.497-.846h-1.677v-.249a2.73 2.73 0 0 0-.804-1.935a2.75 2.75 0 0 0-1.94-.802H3.994a2.73 2.73 0 0 0-2.541 1.687a2.7 2.7 0 0 0-.204 1.05v8.958a1.74 1.74 0 0 0 1.507 1.722q-.007.135 0 .269a3.15 3.15 0 0 0 .948 2.279A3.24 3.24 0 0 0 6 20.46a3.28 3.28 0 0 0 2.285-.956a3.26 3.26 0 0 0 .96-2.279a2 2 0 0 0 0-.248h5.509a2 2 0 0 0 0 .248a3.15 3.15 0 0 0 .948 2.28A3.24 3.24 0 0 0 18 20.5a3.28 3.28 0 0 0 2.285-.956a3.26 3.26 0 0 0 .959-2.279a2 2 0 0 0 0-.249H22a.76.76 0 0 0 .749-.746v-2.876c0-.89-.25-1.762-.719-2.519m-14.293 6.31a1.7 1.7 0 0 1-.519 1.225a1.79 1.79 0 0 1-2.466 0a1.73 1.73 0 0 1-.508-1.234a1.6 1.6 0 0 1 .14-.687c.132-.313.359-.577.648-.757a1.74 1.74 0 0 1 .998-.288c.338 0 .668.1.948.288c.287.183.513.446.65.757c.098.215.15.45.149.687zm3.244-4.976h-4.99a1 1 0 0 1-.999-.995a.994.994 0 0 1 .998-.996h4.991a1 1 0 0 1 .998.996a.994.994 0 0 1-.998.995m0-3.424h-4.99a1 1 0 0 1-.999-.995a.994.994 0 0 1 .998-.995h4.991a1 1 0 0 1 .998.995a.994.994 0 0 1-.998.995m8.734 8.4a1.7 1.7 0 0 1-.52 1.225a1.79 1.79 0 0 1-2.465 0a1.73 1.73 0 0 1-.509-1.234a1.64 1.64 0 0 1 .33-1.006c.246-.327.599-.56.998-.657h.25a.3.3 0 0 1 .139 0h.2c.303.035.592.148.838.329c.247.181.44.425.559.707c.099.215.15.45.15.686z"
      ></path>
      <path fill="currentColor" d="M17.96 15.434a.3.3 0 0 0-.14 0z"></path>
    </svg>
  );
};

export const IconSupport: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="currentColor"
        d="M10 14.5a2 2 0 0 1-1.994-1.84A6.002 6.002 0 0 1 10 1a6 6 0 0 1 5.98 5.5a.47.47 0 0 1-.48.5a.54.54 0 0 1-.525-.5a5 5 0 1 0-6.79 5.16A2 2 0 1 1 10 14.5M5.009 12H5.1c.39.381.823.717 1.292 1H5.009C4.448 13 4 13.447 4 14c0 1.309.622 2.284 1.673 2.953C6.743 17.636 8.265 18 10 18s3.257-.364 4.327-1.047C15.377 16.283 16 15.31 16 14a1 1 0 0 0-1-1h-2.041a3 3 0 0 0 0-1H15a2 2 0 0 1 2 2c0 1.691-.833 2.966-2.135 3.797C13.583 18.614 11.855 19 10 19s-3.583-.386-4.865-1.203C3.833 16.967 3 15.69 3 14c0-1.113.903-2 2.009-2M14 7a4 4 0 0 1-1.87 3.387a3 3 0 0 0-.93-.637a3 3 0 1 0-2.4 0c-.35.153-.665.37-.93.637a4 4 0 0 1-1.638-2.042A4 4 0 0 1 6 7a4 4 0 1 1 8 0"
      ></path>
    </svg>
  );
};

export const IconSupportBold: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="currentColor"
        d="M10 14.5a2 2 0 0 1-1.994-1.84A6.002 6.002 0 0 1 10 1a6 6 0 0 1 5.98 5.5a.47.47 0 0 1-.48.5a.54.54 0 0 1-.525-.5a5 5 0 1 0-6.79 5.16A2 2 0 1 1 10 14.5M5.009 12H5.1a7 7 0 0 0 2.033 1.388A3 3 0 0 0 12.959 12H15a2 2 0 0 1 2 2c0 1.691-.833 2.966-2.135 3.797C13.583 18.614 11.855 19 10 19s-3.583-.386-4.865-1.203C3.833 16.967 3 15.69 3 14c0-1.113.903-2 2.009-2M14 7a4 4 0 0 1-1.87 3.387A3 3 0 0 0 10 9.5a3 3 0 0 0-2.13.887a4 4 0 0 1-1.638-2.042A4 4 0 0 1 6 7a4 4 0 1 1 8 0"
      ></path>
    </svg>
  );
};

export const IconExchange: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M3.53 11.47v2.118a4.235 4.235 0 0 0 4.235 4.236H20.47M3.53 6.176h12.705a4.235 4.235 0 0 1 4.236 4.236v2.117"></path>
        <path d="m17.294 14.647l3.177 3.176L17.294 21M6.706 9.353L3.529 6.176L6.706 3"></path>
      </g>
    </svg>
  );
};

export const IconPhone: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"
      ></path>
    </svg>
  );
};

export const IconAIBold: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none">
        <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
        <path
          fill="currentColor"
          d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"
        ></path>
      </g>
    </svg>
  );
};

export const IconAI: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none">
        <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
        <path
          fill="currentColor"
          d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"
        ></path>
      </g>
    </svg>
  );
};

export const IconLoadingOne: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.14}
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.29}
          transform="rotate(30 12 12)"
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.43}
          transform="rotate(60 12 12)"
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.57}
          transform="rotate(90 12 12)"
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.71}
          transform="rotate(120 12 12)"
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          opacity={0.86}
          transform="rotate(150 12 12)"
        ></rect>
        <rect
          width={2}
          height={5}
          x={11}
          y={1}
          fill="currentColor"
          transform="rotate(180 12 12)"
        ></rect>
        <animateTransform
          attributeName="transform"
          calcMode="discrete"
          dur="0.75s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
        ></animateTransform>
      </g>
    </svg>
  );
};

export const IconTrashBold: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none">
        <path
          fill="currentColor"
          d="m20 9l-1.995 11.346A2 2 0 0 1 16.035 22h-8.07a2 2 0 0 1-1.97-1.654L4 9"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m20 9l-1.995 11.346A2 2 0 0 1 16.035 22h-8.07a2 2 0 0 1-1.97-1.654L4 9zm1-3h-5.625M3 6h5.625m0 0V4a2 2 0 0 1 2-2h2.75a2 2 0 0 1 2 2v2m-6.75 0h6.75"
        ></path>
      </g>
    </svg>
  );
};

export const IconMap: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 2c-4.418 0-8 4.003-8 8.5c0 4.462 2.553 9.312 6.537 11.174a3.45 3.45 0 0 0 2.926 0C17.447 19.812 20 14.962 20 10.5C20 6.003 16.418 2 12 2m0 10a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const IconMapLine: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M4 10.143C4 5.646 7.582 2 12 2s8 3.646 8 8.143c0 4.462-2.553 9.67-6.537 11.531a3.45 3.45 0 0 1-2.926 0C6.553 19.812 4 14.606 4 10.144Z"></path>
        <circle cx={12} cy={10} r={3}></circle>
      </g>
    </svg>
  );
};

export const IconEmailLine: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m2.357 7.714l6.98 4.654c.963.641 1.444.962 1.964 1.087c.46.11.939.11 1.398 0c.52-.125 1.001-.446 1.964-1.087l6.98-4.654M7.157 19.5h9.686c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.31-1.311c.328-.642.328-1.482.328-3.162V9.3c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311c-.642-.327-1.482-.327-3.162-.327H7.157c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.31 1.311c-.328.642-.328 1.482-.328 3.162v5.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311c.642.327 1.482.327 3.162.327"
      ></path>
    </svg>
  );
};

export const IconHouse: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillOpacity={0.25}
        d="M5 14.059c0-1.01 0-1.514.222-1.945c.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601s.601.2 1.162.601l4.163 2.973c.821.587 1.232.88 1.453 1.311s.222.935.222 1.944V19c0 .943 0 1.414-.293 1.707S17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293S5 19.943 5 19z"
      ></path>
      <path
        fill="currentColor"
        d="M3 12.387c0 .266 0 .4.084.441s.19-.04.4-.205l7.288-5.668c.59-.459.885-.688 1.228-.688s.638.23 1.228.688l7.288 5.668c.21.164.316.246.4.205s.084-.175.084-.441v-.409c0-.48 0-.72-.102-.928s-.291-.356-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688s-.638.23-1.228.688l-7 5.445c-.379.294-.569.442-.67.65S3 11.498 3 11.978zM12.5 15h-1a2 2 0 0 0-2 2v3.85c0 .083.067.15.15.15h4.7a.15.15 0 0 0 .15-.15V17a2 2 0 0 0-2-2"
      ></path>
      <rect
        width={2}
        height={4}
        x={16}
        y={5}
        fill="currentColor"
        rx={0.5}
      ></rect>
    </svg>
  );
};

export const IconOffice: FC<IconifyProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13 3a2 2 0 0 1 1.995 1.85L15 5v14h1V9.5a.5.5 0 0 1 .41-.492L16.5 9H18a2 2 0 0 1 1.995 1.85L20 11v8h1a1 1 0 0 1 .117 1.993L21 21H3a1 1 0 0 1-.117-1.993L3 19h1V5a2 2 0 0 1 1.85-1.995L6 3z"
        className="duoicon-secondary-layer"
        opacity={0.3}
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11 7H8v2h3zm0 4H8v2h3zm0 4H8v2h3z"
        className="duoicon-primary-layer"
      ></path>
    </svg>
  );
};

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */

/* export const MyIcon: FC<IconifyProps> = ({...props}) => {
  return (

  );
}; */
