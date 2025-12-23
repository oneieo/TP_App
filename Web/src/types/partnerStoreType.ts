export type StoreCategory = "CAFE" | "RESTAURANT" | "BAR" | "ETC";
export type PartnerCategory =
  | "간호대학"
  | "경상대학"
  | "공과대학"
  | "국제이공학부"
  | "농업생명과학대학"
  | "사범대학"
  | "사회과학대학"
  | "생활과학대학"
  | "수의과대학"
  | "약학대학"
  | "예술대학"
  | "융합자율전공학부"
  | "융합학부"
  | "의과대학"
  | "인문대학"
  | "자연과학대학"
  | "치과대학"
  | "한옥학과"
  | "환경생명자원대학";

export interface PartnerStore {
  partnerStoreId: number;
  partnerCategory: PartnerCategory;
  partnerBenefit: string;
  category: StoreCategory;
  storeName: string;
  address: string;
  businessHours: string;
  openingTime: string;
  closingTime: string;
  breakStartTime: string;
  breakEndTime: string;
  lastOrder: string;
  lat: number;
  lng: number;
  introduce: string;
  phone: string;
  etc: string;
  sns: string;
}

export interface PartnerStoreResponse {
  content: PartnerStore[];
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
}
