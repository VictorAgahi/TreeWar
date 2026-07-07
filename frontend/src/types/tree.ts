export interface ParisTreeApiRecord {
  idbase: number;
  arrondissement: string | null;
  complementadresse: string | null;
  adresse: string | null;
  libellefrancais: string | null;
  genre: string | null;
  espece: string | null;
  circonferenceencm: number | null;
  hauteurenm: number | null;
  stadedeveloppement: string | null;
  remarquable: string | null;
  geo_point_2d: { lon: number; lat: number } | null;
}

export interface ParisTreeApiResponse {
  total_count: number;
  results: ParisTreeApiRecord[];
}

export type TreeSponsorshipStatus = 'available' | 'sponsored';

export interface TreeSponsorship {
  status: TreeSponsorshipStatus;
  sponsorName?: string;
}

export interface ParisTree {
  id: number;
  name: string;
  genus: string | null;
  species: string | null;
  address: string | null;
  district: string | null;
  heightM: number | null;
  circumferenceCm: number | null;
  developmentStage: string | null;
  remarkable: boolean;
  lat: number;
  lon: number;
  sponsorship: TreeSponsorship;
}
