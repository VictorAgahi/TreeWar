import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { Backdrop, CircularProgress, Alert } from '@mui/material';
import { Typography } from '../../atoms/Typography/Typography';
import { TreeWarInfoPanel } from '../../molecules/TreeWarInfoPanel/TreeWarInfoPanel';
import { MapLegend } from '../../molecules/MapLegend/MapLegend';
import { axiosClient } from '../../../api/axiosClient';
import { treeApi } from '../../../api/tree.api';
import type { BackendTree as Tree } from '../../../api/tree.api';
import { TREE_MARKER_COLORS } from '../ParisTreeMap/treeMarkerColors';

const PARIS_CENTER: [number, number] = [48.8566, 2.3522];
const DEFAULT_ZOOM = 12;

export const TreeWarMap: React.FC = () => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  const fetchTrees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosClient.request<Tree[]>(treeApi.getAll());
      setTrees(res.data);
    } catch {
      setError("Impossible de charger les arbres depuis le serveur.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);

  const handleBuySuccess = () => {
    // Refresh trees and hide panel to force user to re-click if they want to buy again
    // Or we could update local state for the selected tree.
    setSelectedTree(null);
    fetchTrees();
  };

  return (
    <div style={{ position: 'relative', flex: 1, width: '100%', display: 'flex', borderRadius: 16, overflow: 'hidden' }}>
      <MapContainer center={PARIS_CENTER} zoom={DEFAULT_ZOOM} preferCanvas style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trees.map((tree) => {
          const sponsorshipStatus = tree.ownerId ? 'sponsored' : 'normal';
          return (
            <CircleMarker
              key={tree.id}
              center={[tree.location.coordinates[1], tree.location.coordinates[0]]} // GeoJSON is [lng, lat]
              radius={5}
              pathOptions={{
                color: TREE_MARKER_COLORS[sponsorshipStatus],
                fillColor: TREE_MARKER_COLORS[sponsorshipStatus],
                fillOpacity: 0.85,
                weight: 1,
              }}
              eventHandlers={{ click: () => setSelectedTree(tree) }}
            />
          );
        })}
      </MapContainer>

      <MapLegend />

      {selectedTree && (
        <TreeWarInfoPanel
          tree={selectedTree}
          onClose={() => setSelectedTree(null)}
          onBuySuccess={handleBuySuccess}
        />
      )}

      {error && (
        <Alert severity="error" sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}>
          {error}
        </Alert>
      )}

      <Backdrop
        open={isLoading && trees.length === 0}
        sx={{ position: 'absolute', zIndex: 2000, flexDirection: 'column', gap: 2, borderRadius: 4 }}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ color: 'white' }}>
          Chargement des arbres du serveur...
        </Typography>
      </Backdrop>
    </div>
  );
};
