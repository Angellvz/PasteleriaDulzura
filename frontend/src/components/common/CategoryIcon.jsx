import React from 'react';
import { 
  Cake, 
  Cookie, 
  Coffee, 
  Sparkles, 
  Heart, 
  Gift, 
  Flame, 
  Utensils, 
  PartyPopper, 
  Store,
  PieChart,
  ShoppingBag
} from 'lucide-react';

export const ICON_OPTIONS = [
  { id: 'Cake', label: 'Torta / Pastel', Icon: Cake },
  { id: 'Cookie', label: 'Galletas / Postres', Icon: Cookie },
  { id: 'Coffee', label: 'Café / Bebidas', Icon: Coffee },
  { id: 'Sparkles', label: 'Especiales / Finos', Icon: Sparkles },
  { id: 'Heart', label: 'Bodas / Romántico', Icon: Heart },
  { id: 'Gift', label: 'Detalles / Regalos', Icon: Gift },
  { id: 'Flame', label: 'Promociones / Tendencia', Icon: Flame },
  { id: 'Utensils', label: 'Bocaditos / Salados', Icon: Utensils },
  { id: 'PartyPopper', label: 'Fiestas / Eventos', Icon: PartyPopper },
  { id: 'PieChart', label: 'Pies / Tartas', Icon: PieChart },
  { id: 'Store', label: 'General / Tienda', Icon: Store }
];

export const CategoryIcon = ({ name, className = "w-5 h-5", defaultIcon: DefaultIcon = Cake }) => {
  if (!name) return <DefaultIcon className={className} />;

  switch (name.toLowerCase()) {
    case 'cake':
    case 'torta':
    case 'pastel':
      return <Cake className={className} />;
    case 'cookie':
    case 'galleta':
    case 'postre':
      return <Cookie className={className} />;
    case 'coffee':
    case 'cafe':
    case 'cafeteria':
      return <Coffee className={className} />;
    case 'sparkles':
    case 'especial':
      return <Sparkles className={className} />;
    case 'heart':
    case 'boda':
      return <Heart className={className} />;
    case 'gift':
    case 'regalo':
      return <Gift className={className} />;
    case 'flame':
    case 'oferta':
      return <Flame className={className} />;
    case 'utensils':
    case 'bocadito':
    case 'salado':
      return <Utensils className={className} />;
    case 'partypopper':
    case 'fiesta':
      return <PartyPopper className={className} />;
    case 'piechart':
    case 'tarta':
      return <PieChart className={className} />;
    default:
      return <Cake className={className} />;
  }
};

export default CategoryIcon;
