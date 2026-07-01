import { FavouritesPage } from "@/components/favourites/FavouritesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favourites | AZAQUEST",
};

export default function Favourites() {
  return <FavouritesPage />;
}
