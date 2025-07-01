import { CogIcon, FastForwardIcon, HeartIcon, HelpCircleIcon, ShoppingBagIcon, TruckIcon } from "lucide-react";
import { ElementType } from "react";


export interface ServiceType {
  title: string,
  description: string,
  icon: ElementType
}

export const ServicesBox: ServiceType[] = [
  {
    title: 'Construction Consultant',
    description: 'Vestibulum eu libero volutpat, portas quam, tempus sem. Donec sodales quam id lorem lobortis, vitae interdum nisl.',
    icon: HeartIcon
  },

  {
    title: 'Architectural Design',
    description: 'Vestibulum eu libero volutpat, portas quam, tempus sem. Donec sodales quam id lorem lobortis, vitae interdum nisl.',
    icon: ShoppingBagIcon
  },

  {
    title: 'Electrical System',
    description: 'Vestibulum eu libero volutpat, portas quam, tempus sem. Donec sodales quam id lorem lobortis, vitae interdum nisl.',
    icon: FastForwardIcon
  },

  {
    title: 'General Contracting',
    description: 'Vestibulum eu libero volutpat, portas quam, tempus sem. Donec sodales quam id lorem lobortis, vitae interdum nisl.',
    icon: TruckIcon
  },

  {
    title: 'Resconstruction Services',
    description: 'Vestibulum eu libero volutpat, portas quam, tempus sem. Donec sodales quam id lorem lobortis, vitae interdum nisl.',
    icon: CogIcon
  },

  {
    title: 'Plumbilg Services',
    description: 'Vestibulum eu libero volutpat, portas quam, tempus sem. Donec sodales quam id lorem lobortis, vitae interdum nisl.',
    icon: HelpCircleIcon
  }
]