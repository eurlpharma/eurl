import {
  LanguagesIcon,
  MoonIcon,
  ShoppingCartIcon,
  User2Icon,
} from "lucide-react";
import {
  IconEmail,
  IconFacebook,
  IconGooglePlus,
  IconInstagram,
  IconPhone,
  IconTelegram,
  IconTime,
  IconWhatsapp,
} from "../Iconify";

export const leftContact = [
  {
    icon: IconFacebook,
    href: "https://www.facebook.com",
  },

  {
    icon: IconInstagram,
    href: "https://www.instagram.com",
  },

  {
    icon: IconWhatsapp,
    href: "https://www.whatsapp.com",
  },

  {
    icon: IconTelegram,
    href: "https://www.telegram.com",
  },

  {
    icon: IconGooglePlus,
    href: "https://www.google.com",
  },
];

export const rightContact = [
  {
    icon: IconPhone,
    href: "+213 558 71 48 90",
    label: "+213558714890",
  },

  {
    icon: IconEmail,
    href: "contact@info.com",
    label: "contact@info.com",
  },

  {
    icon: IconTime,
    href: "#",
    label: "Mon-Fri: 7:00 - 17:00",
  },
];

export const linksNavbar = [
  {
    label: "home",
    href: "/",
  },

  {
    label: "products",
    href: "/products",
  },

  // {
  //   label: 'services',
  //   href: '/services'
  // },

  {
    label: "about",
    href: "/about",
  },

  {
    label: "contact",
    href: "/contact",
  },
];

export const linkControlls = [
  {
    icon: MoonIcon,
    label: "dark",
    href: "#",
  },

  {
    icon: LanguagesIcon,
    label: "languages",
    href: "#",
  },

  {
    icon: ShoppingCartIcon,
    label: "cart",
    href: "/cart",
  },

  {
    icon: User2Icon,
    label: "profile",
    href: "/profile",
  },
];
