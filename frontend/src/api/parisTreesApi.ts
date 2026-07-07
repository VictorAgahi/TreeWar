import type { ParisTree, ParisTreeApiRecord, ParisTreeApiResponse } from '../types/tree';

const RECORDS_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records';
const PAGE_SIZE = 100;

// No sponsorship data exists yet (no backend): status is derived deterministically
// from idbase so the UI has something stable to demo before the real flow lands.
const SPONSOR_NAMES = ['Google', 'TotalEnergies', 'BNP Paribas', "L'Oréal", 'Danone', 'EDF', 'Decathlon', 'LVMH'];

async function fetchPage(offset: number): Promise<ParisTreeApiResponse> {
  const response = await fetch(`${RECORDS_URL}?limit=${PAGE_SIZE}&offset=${offset}`);
  if (!response.ok) {
    throw new Error(`Paris trees API error: ${response.status}`);
  }
  return response.json();
}

function deriveSponsorship(idbase: number): ParisTree['sponsorship'] {
  if (idbase % 4 !== 0) {
    return { status: 'available' };
  }
  return { status: 'sponsored', sponsorName: SPONSOR_NAMES[idbase % SPONSOR_NAMES.length] };
}

function adaptRecord(record: ParisTreeApiRecord): ParisTree | null {
  if (!record.geo_point_2d) {
    return null;
  }
  return {
    id: record.idbase,
    name: record.libellefrancais || [record.genre, record.espece].filter(Boolean).join(' ') || 'Arbre',
    genus: record.genre,
    species: record.espece,
    address: [record.adresse, record.complementadresse].filter(Boolean).join(' - ') || null,
    district: record.arrondissement,
    heightM: record.hauteurenm || null,
    circumferenceCm: record.circonferenceencm || null,
    developmentStage: record.stadedeveloppement,
    remarkable: record.remarquable === 'OUI',
    lat: record.geo_point_2d.lat,
    lon: record.geo_point_2d.lon,
    sponsorship: deriveSponsorship(record.idbase),
  };
}

export async function fetchAllParisTrees(onProgress?: (loaded: number, total: number) => void): Promise<ParisTree[]> {
  const first = await fetchPage(0);
  const total = first.total_count;
  onProgress?.(first.results.length, total);

  const offsets: number[] = [];
  for (let offset = PAGE_SIZE; offset < total; offset += PAGE_SIZE) {
    offsets.push(offset);
  }

  const remainingPages = await Promise.all(offsets.map((offset) => fetchPage(offset)));
  const allRecords = [first, ...remainingPages].flatMap((page) => page.results);
  onProgress?.(allRecords.length, total);

  return allRecords.map(adaptRecord).filter((tree): tree is ParisTree => tree !== null);
}
