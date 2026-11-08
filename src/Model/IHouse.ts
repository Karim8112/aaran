export interface HouseType {
  _id: string;
  name: string;
}

export interface House {
  _id: string;
  mainImage: string; //
  title: string; //
  description: string;
  city: string;
  location: string;
  area: number;
  roomsCount?: number;
  price?: string;
  houseType: HouseType; //
  images: string[];
}

export interface HouseRequest {
  mainImage: File | string;
  title: string;
  description: string;
  city: string;
  location: string;
  area: number;
  roomsCount?: number;
  price?: string;
  houseType: string;
  images?: (string | File)[];
}
