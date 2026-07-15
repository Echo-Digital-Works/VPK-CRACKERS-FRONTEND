export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  discount: string;
  img: string;
  desc: string;
}

export const categories = ['All', 'Flower Pots', 'Sparklers', 'Ground Chakkars', 'Rockets', 'Bombs', 'Gift Boxes'];

export const products: Product[] = [
  { id: 1, name: 'Premium Gold Sparklers', category: 'Sparklers', price: '₹250', discount: '20% OFF', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Diwali_fireworks.jpg/600px-Diwali_fireworks.jpg', desc: 'Extra long lasting golden sparkles.' },
  { id: 2, name: 'Giant Flower Pots', category: 'Flower Pots', price: '₹450', discount: '15% OFF', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Diwali_fireworks.jpg/600px-Diwali_fireworks.jpg', desc: 'Vibrant colors reaching up to 15 feet.' },
  { id: 3, name: 'Super Chakkars', category: 'Ground Chakkars', price: '₹150', discount: '10% OFF', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Diwali_fireworks.jpg/600px-Diwali_fireworks.jpg', desc: 'Fast spinning with colorful aura.' },
  { id: 4, name: 'Sky Rockets', category: 'Rockets', price: '₹350', discount: '25% OFF', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Diwali_fireworks.jpg/600px-Diwali_fireworks.jpg', desc: 'High altitude bursting stars.' },
  { id: 5, name: 'Atom Bombs', category: 'Bombs', price: '₹200', discount: '', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Diwali_fireworks.jpg/600px-Diwali_fireworks.jpg', desc: 'Loud and safe green crackers.' },
  { id: 6, name: 'Family Combo Box', category: 'Gift Boxes', price: '₹2500', discount: '30% OFF', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Diwali_fireworks.jpg/600px-Diwali_fireworks.jpg', desc: '50+ varieties in a premium gift box.' },
  { id: 7, name: 'Silver Sparklers', category: 'Sparklers', price: '₹200', discount: '', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Diwali_fireworks.jpg/600px-Diwali_fireworks.jpg', desc: 'Bright silver sparkles.' },
  { id: 8, name: 'Color Flower Pots', category: 'Flower Pots', price: '₹300', discount: '', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Diwali_fireworks.jpg/600px-Diwali_fireworks.jpg', desc: 'Multi-color sparks.' },
  { id: 9, name: 'Whistling Rockets', category: 'Rockets', price: '₹400', discount: '10% OFF', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Diwali_fireworks.jpg/600px-Diwali_fireworks.jpg', desc: 'Loud whistle with colorful burst.' },
];
