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

// "arbresremarquablesparis" dataset: a separate, curated list of Paris's named/storied
// trees (mostly disjoint from "les-arbres" — see RemarkableTreeInfo below).
export interface RemarkableTreeApiRecord {
  geom_x_y: { lon: number; lat: number } | null;
  arbres_idbase: number | null;
  arbres_arrondissement: string | null;
  arbres_adresse: string | null;
  arbres_circonferenceencm: number | null;
  arbres_hauteurenm: number | null;
  arbres_stadedeveloppement: string | null;
  arbres_genre: string | null;
  arbres_espece: string | null;
  arbres_libellefrancais: string | null;
  com_adresse: string | null;
  com_arrondissement: string | null;
  com_site: string | null;
  com_nom_usuel: string | null;
  com_annee_plantation: string | null;
  com_qualification_rem: string | null;
  com_resume: string | null;
  com_descriptif: string | null;
  com_label_arbres: string | null;
  com_url_photo1: string | null;
  com_copyright1: string | null;
}

export interface ApiPage<T> {
  total_count: number;
  results: T[];
}

export interface RemarkableTreeInfo {
  usualName: string | null;
  site: string | null;
  qualification: string | null;
  summary: string | null;
  description: string | null;
  label: string | null;
  photoUrl: string | null;
  photoCredit: string | null;
  plantedYear: string | null;
}

export type TreeSponsorshipStatus = 'available' | 'sponsored';

// Populated by matching this open-data tree's coordinates against the backend's
// `GET /tree` (see api/tree.api.ts). A tree is 'available' until a company sponsors
// it (POST /tree/buy) and gives it a custom name. `dbTreeId`/`currentPrice` are only
// set once sponsored — needed to place a higher bid via the same endpoint.
export interface TreeSponsorship {
  status: TreeSponsorshipStatus;
  companyName?: string;
  customName?: string;
  dbTreeId?: string;
  currentPrice?: number;
  ownerId?: string;
}

export interface ParisTree {
  id: string;
  name: string;
  genus: string | null;
  species: string | null;
  address: string | null;
  district: string | null;
  heightM: number | null;
  circumferenceCm: number | null;
  developmentStage: string | null;
  lat: number;
  lon: number;
  remarkable: RemarkableTreeInfo | null;
  sponsorship: TreeSponsorship;
}
