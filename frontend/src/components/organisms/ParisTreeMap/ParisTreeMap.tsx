import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { Backdrop, CircularProgress, Alert } from '@mui/material';
import { Typography } from '../../atoms/Typography/Typography';
import { TreeInfoPanel } from '../../molecules/TreeInfoPanel/TreeInfoPanel';
import { MapLegend } from '../../molecules/MapLegend/MapLegend';
import { fetchAllParisTrees } from '../../../api/parisTreesApi';
import { axiosClient } from '../../../api/axiosClient';
import { treeApi, mergeTreeSponsorships } from '../../../api/tree.api';
import type { BackendTree } from '../../../api/tree.api';
import { useApi } from '../../../hooks/useApi';
import { useAuth } from '../../../context/AuthContext';
import type { ParisTree } from '../../../types/tree';
import { TREE_MARKER_COLORS } from './treeMarkerColors';

const PARIS_CENTER: [number, number] = [48.8566, 2.3522];
const DEFAULT_ZOOM = 12;

function markerColor(tree: ParisTree): string {
  if (tree.remarkable) return TREE_MARKER_COLORS.remarkable;
  if (tree.sponsorship.status === 'sponsored') return TREE_MARKER_COLORS.sponsored;
  return TREE_MARKER_COLORS.normal;
}

export const ParisTreeMap: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [openDataTrees, setOpenDataTrees] = useState<ParisTree[]>([]);
  const [backendTrees, setBackendTrees] = useState<BackendTree[]>([]);
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);

  // GET /tree is public and needs no auth header, so we call axiosClient directly
  // rather than useApi — useApi's config object is recreated every render, which
  // would make it unsafe as a useEffect dependency.
  const refreshBackendTrees = useCallback(async () => {
    const result = await axiosClient.request<BackendTree[]>(treeApi.getAll());
    setBackendTrees(result.data);
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchAllParisTrees((loaded, total) => {
        if (!cancelled) {
          setLoadProgress({ loaded, total });
        }
      }),
      refreshBackendTrees(),
    ])
      .then(([openData]) => {
        if (!cancelled) {
          setOpenDataTrees(openData);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Impossible de charger les arbres de Paris. Réessaie plus tard.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refreshBackendTrees]);

  const trees = useMemo(
    () => mergeTreeSponsorships(openDataTrees, backendTrees),
    [openDataTrees, backendTrees],
  );

  const selectedTree = useMemo(
    () => trees.find((tree) => tree.id === selectedTreeId) ?? null,
    [trees, selectedTreeId],
  );

  const {
    execute: executeBuyTree,
    loading: isSponsoring,
    error: sponsorError,
  } = useApi<BackendTree>(treeApi.buy());

  const handleSponsor = useCallback(
    async (amount: number, customName: string) => {
      if (!selectedTree) return;
      try {
        await executeBuyTree({
          data: {
            treeId: selectedTree.sponsorship.dbTreeId,
            amount,
            newName: customName || undefined,
            lat: selectedTree.lat,
            lng: selectedTree.lon,
          },
        });
        await refreshBackendTrees();
      } catch {
        // surfaced to the user via sponsorError from useApi
      }
    },
    [selectedTree, executeBuyTree, refreshBackendTrees],
  );

  const handleSelect = useCallback((tree: ParisTree) => setSelectedTreeId(tree.id), []);

  // ~1950 markers is comfortable for Leaflet's canvas renderer, but recreating that
  // many CircleMarker elements on every click (selectedTree change) is wasted work —
  // memoize on the data that actually changes the marker set.
  const markers = useMemo(
    () =>
      trees.map((tree) => {
        const color = markerColor(tree);
        return (
          <CircleMarker
            key={tree.id}
            center={[tree.lat, tree.lon]}
            radius={tree.remarkable ? 8 : 5}
            pathOptions={{
              color: tree.remarkable ? '#ffffff' : color,
              fillColor: color,
              fillOpacity: 0.9,
              weight: tree.remarkable ? 2 : 1,
            }}
            eventHandlers={{ click: () => handleSelect(tree) }}
          />
        );
      }),
    [trees, handleSelect],
  );

  return (
    <div style={{ position: 'relative', flex: 1, width: '100%', display: 'flex', borderRadius: 16, overflow: 'hidden' }}>
      <MapContainer center={PARIS_CENTER} zoom={DEFAULT_ZOOM} preferCanvas style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
      </MapContainer>

      <MapLegend />

      {selectedTree && (
        <TreeInfoPanel
          tree={selectedTree}
          onClose={() => setSelectedTreeId(null)}
          canSponsor={isAuthenticated}
          isSponsoring={isSponsoring}
          sponsorError={sponsorError}
          onSponsor={handleSponsor}
        />
      )}

      {error && (
        <Alert severity="error" sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}>
          {error}
        </Alert>
      )}

      <Backdrop
        open={isLoading}
        sx={{ position: 'absolute', zIndex: 2000, flexDirection: 'column', gap: 2, borderRadius: 4 }}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ color: 'white' }}>
          Chargement des arbres de Paris… {loadProgress.loaded}/{loadProgress.total || '…'}
        </Typography>
      </Backdrop>
    </div>
  );
};
