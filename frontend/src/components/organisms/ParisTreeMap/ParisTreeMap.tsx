import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { Backdrop, CircularProgress, Alert } from '@mui/material';
import { Typography } from '../../atoms/Typography/Typography';
import { TreeInfoPanel } from '../../molecules/TreeInfoPanel/TreeInfoPanel';
import { MapLegend } from '../../molecules/MapLegend/MapLegend';
import { fetchAllParisTrees } from '../../../api/parisTreesApi';
import type { ParisTree } from '../../../types/tree';
import { TREE_MARKER_COLORS } from './treeMarkerColors';

const PARIS_CENTER: [number, number] = [48.8566, 2.3522];
const DEFAULT_ZOOM = 12;

export const ParisTreeMap: React.FC = () => {
  const [trees, setTrees] = useState<ParisTree[]>([]);
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTree, setSelectedTree] = useState<ParisTree | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchAllParisTrees((loaded, total) => {
      if (!cancelled) {
        setLoadProgress({ loaded, total });
      }
    })
      .then((result) => {
        if (!cancelled) {
          setTrees(result);
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
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <MapContainer center={PARIS_CENTER} zoom={DEFAULT_ZOOM} preferCanvas style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trees.map((tree) => (
          <CircleMarker
            key={tree.id}
            center={[tree.lat, tree.lon]}
            radius={5}
            pathOptions={{
              color: TREE_MARKER_COLORS[tree.sponsorship.status],
              fillColor: TREE_MARKER_COLORS[tree.sponsorship.status],
              fillOpacity: 0.85,
              weight: 1,
            }}
            eventHandlers={{ click: () => setSelectedTree(tree) }}
          />
        ))}
      </MapContainer>

      <MapLegend />

      {selectedTree && <TreeInfoPanel tree={selectedTree} onClose={() => setSelectedTree(null)} />}

      {error && (
        <Alert severity="error" sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}>
          {error}
        </Alert>
      )}

      <Backdrop open={isLoading} sx={{ zIndex: 2000, flexDirection: 'column', gap: 2 }}>
        <CircularProgress color="inherit" />
        <Typography sx={{ color: 'white' }}>
          Chargement des arbres de Paris… {loadProgress.loaded}/{loadProgress.total || '…'}
        </Typography>
      </Backdrop>
    </div>
  );
};
