import type {
  ApiPage,
  ParisTree,
  ParisTreeApiRecord,
  RemarkableTreeApiRecord,
  RemarkableTreeInfo,
} from '../types/tree';

const LES_ARBRES_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records';
const REMARKABLE_TREES_URL =
  'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/arbresremarquablesparis/records';
const PAGE_SIZE = 100;

async function fetchPage<T>(baseUrl: string, offset: number): Promise<ApiPage<T>> {
  const response = await fetch(`${baseUrl}?limit=${PAGE_SIZE}&offset=${offset}`);
  if (!response.ok) {
    throw new Error(`Paris open data API error: ${response.status}`);
  }
  return response.json();
}

async function fetchAllPages<T>(
  baseUrl: string,
  onProgress: (loaded: number, total: number) => void,
): Promise<T[]> {
  const first = await fetchPage<T>(baseUrl, 0);
  const total = first.total_count;
  onProgress(first.results.length, total);

  const offsets: number[] = [];
  for (let offset = PAGE_SIZE; offset < total; offset += PAGE_SIZE) {
    offsets.push(offset);
  }

  const remainingPages = await Promise.all(offsets.map((offset) => fetchPage<T>(baseUrl, offset)));
  const all = [first, ...remainingPages].flatMap((page) => page.results);
  onProgress(all.length, total);
  return all;
}

function adaptTree(record: ParisTreeApiRecord): ParisTree | null {
  if (!record.geo_point_2d) {
    return null;
  }
  return {
    id: String(record.idbase),
    name: record.libellefrancais || [record.genre, record.espece].filter(Boolean).join(' ') || 'Arbre',
    genus: record.genre,
    species: record.espece,
    address: [record.adresse, record.complementadresse].filter(Boolean).join(' - ') || null,
    district: record.arrondissement,
    heightM: record.hauteurenm || null,
    circumferenceCm: record.circonferenceencm || null,
    developmentStage: record.stadedeveloppement,
    lat: record.geo_point_2d.lat,
    lon: record.geo_point_2d.lon,
    remarkable: null,
    sponsorship: { status: 'available' },
  };
}

function adaptRemarkableInfo(record: RemarkableTreeApiRecord): RemarkableTreeInfo {
  return {
    usualName: record.com_nom_usuel,
    site: record.com_site,
    qualification: record.com_qualification_rem,
    summary: record.com_resume,
    description: record.com_descriptif,
    label: record.com_label_arbres,
    photoUrl: record.com_url_photo1,
    photoCredit: record.com_copyright1,
    plantedYear: record.com_annee_plantation,
  };
}

function adaptRemarkableTree(record: RemarkableTreeApiRecord): ParisTree | null {
  if (!record.geom_x_y || record.arbres_idbase == null) {
    return null;
  }
  return {
    id: String(record.arbres_idbase),
    name:
      record.com_nom_usuel ||
      record.arbres_libellefrancais ||
      [record.arbres_genre, record.arbres_espece].filter(Boolean).join(' ') ||
      'Arbre',
    genus: record.arbres_genre,
    species: record.arbres_espece,
    address: record.com_adresse || record.arbres_adresse,
    district: record.arbres_arrondissement || record.com_arrondissement,
    heightM: record.arbres_hauteurenm || null,
    circumferenceCm: record.arbres_circonferenceencm || null,
    developmentStage: record.arbres_stadedeveloppement,
    lat: record.geom_x_y.lat,
    lon: record.geom_x_y.lon,
    remarkable: adaptRemarkableInfo(record),
    sponsorship: { status: 'available' },
  };
}

// "les-arbres" (general population) and "arbresremarquablesparis" (curated, storied
// trees) are two distinct exports from the City of Paris with only marginal overlap
// (3 out of ~184 remarkable trees also appear in the general dataset). We merge them
// and let the remarkable record win when both exist for the same idbase.
export async function fetchAllParisTrees(onProgress?: (loaded: number, total: number) => void): Promise<ParisTree[]> {
  const progressState = { base: { loaded: 0, total: 0 }, remarkable: { loaded: 0, total: 0 } };
  const reportProgress = () => {
    const loaded = progressState.base.loaded + progressState.remarkable.loaded;
    const total = progressState.base.total + progressState.remarkable.total;
    onProgress?.(loaded, total);
  };

  const [baseRecords, remarkableRecords] = await Promise.all([
    fetchAllPages<ParisTreeApiRecord>(LES_ARBRES_URL, (loaded, total) => {
      progressState.base = { loaded, total };
      reportProgress();
    }),
    fetchAllPages<RemarkableTreeApiRecord>(REMARKABLE_TREES_URL, (loaded, total) => {
      progressState.remarkable = { loaded, total };
      reportProgress();
    }),
  ]);

  // The source dataset itself contains an occasional exact duplicate row (same
  // idbase) — dedupe defensively rather than trust it's clean.
  const remarkableTrees = [
    ...new Map(
      remarkableRecords.map(adaptRemarkableTree).filter((tree): tree is ParisTree => tree !== null)
        .map((tree) => [tree.id, tree]),
    ).values(),
  ];
  const remarkableIds = new Set(remarkableTrees.map((tree) => tree.id));

  const baseTrees = baseRecords
    .map(adaptTree)
    .filter((tree): tree is ParisTree => tree !== null)
    .filter((tree) => !remarkableIds.has(tree.id));

  return [...baseTrees, ...remarkableTrees];
}
