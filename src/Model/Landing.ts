export interface IHero {
  _id?: string;
  heroImage: string;
  mainTitle: string;
}

export interface IWhatWeDo {
  _id?: string;
  image: string;
  text: string;
}

export interface IAdditionalSection {
  _id?: string;
  title: string;
  image: string;
  text: string;
}

export interface IAboutUs {
  _id?: string;
  title1: string;
  description: string;
  title2: string;
  description2: string;
  title3: string;
  description3: string;
  images?: string[];
}

export interface IAboutUsRequest {
  _id?: string;
  title1: string;
  description: string;
  title2: string;
  description2: string;
  title3: string;
  description3: string;
  images?: (string | File)[];
}

export interface IList {
  _id?: string;
  image: string;
  title: string;
  desc: string[];
}

export interface IContactInfo {
  _id?: string;
  numbers: string[];
  emails: string[];
  address: string[];
}

export interface ILanding {
  hero: IHero[];
  whatWeDo: IWhatWeDo[];
  additionalSection: IAdditionalSection[];
  aboutUs: IAboutUs[];
  list: IList[];
  contactInfo: IContactInfo[];
}
