export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  size: string | null;
  price: number;
  priceMax: number | null;
  imageUrl: string | null;
}

export interface FavouriteItem {
  productId: string;
  slug: string;
  name: string;
  size: string | null;
  price: number;
  priceMax: number | null;
  imageUrl: string | null;
}
