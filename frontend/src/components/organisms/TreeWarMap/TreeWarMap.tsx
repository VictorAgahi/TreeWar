import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import { Backdrop, CircularProgress, Alert, Box, Autocomplete, TextField } from '@mui/material';
import { Typography } from '../../atoms/Typography/Typography';
import { TreeWarInfoPanel } from '../../molecules/TreeWarInfoPanel/TreeWarInfoPanel';
import { MapLegend } from '../../molecules/MapLegend/MapLegend';
import { axiosClient } from '../../../api/axiosClient';
import type { ParisTree } from '../../../types/tree';
import { fetchAllParisTrees } from '../../../api/parisTreesApi';
import { mergeTreeSponsorships, treeApi } from '../../../api/tree.api';
import type { BackendTree } from '../../../api/tree.api';
import { TREE_MARKER_COLORS } from '../ParisTreeMap/treeMarkerColors';

const PARIS_CENTER: [number, number] = [48.8566, 2.3522];
const DEFAULT_ZOOM = 12;

export const TreeWarMap: React.FC = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const [trees, setTrees] = useState<ParisTree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progressMsg, setProgressMsg] = useState<string>('Chargement des arbres du serveur...');
  const [error, setError] = useState<string | null>(null);
  const [selectedTree, setSelectedTree] = useState<ParisTree | null>(null);

  const fetchTrees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProgressMsg('Chargement des données de la ville de Paris...');
      
      const openDataTrees = await fetchAllParisTrees((loaded, total) => {
        setProgressMsg(`Chargement des arbres : ${loaded} / ${total}`);
      });
      
      setProgressMsg('Synchronisation avec les données du jeu...');
      const res = await axiosClient.request<BackendTree[]>(treeApi.getAll());
      
      const merged = mergeTreeSponsorships(openDataTrees, res.data);
      setTrees(merged);
    } catch {
      setError("Impossible de charger les arbres.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);

  const handleBuySuccess = () => {
    setSelectedTree(null);
    fetchTrees();
  };

  return (
    <div style={{ position: 'relative', flex: 1, width: '100%', display: 'flex', borderRadius: 16, overflow: 'hidden' }}>
      <MapContainer 
        center={PARIS_CENTER} 
        zoom={DEFAULT_ZOOM} 
        preferCanvas 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trees.map((tree) => {
          let markerStyle: keyof typeof TREE_MARKER_COLORS = 'normal';
          if (selectedTree && tree.id === selectedTree.id) {
            markerStyle = 'selected';
          } else if (tree.sponsorship.status === 'sponsored') {
            markerStyle = 'sponsored';
          } else if (tree.remarkable) {
            markerStyle = 'remarkable';
          }

          return (
            <CircleMarker
              key={tree.id}
              center={[tree.lat, tree.lon]}
              radius={5}
              pathOptions={{
                color: TREE_MARKER_COLORS[markerStyle],
                fillColor: TREE_MARKER_COLORS[markerStyle],
                fillOpacity: 0.85,
                weight: 1,
              }}
              eventHandlers={{ click: () => setSelectedTree(tree) }}
            />
          );
        })}
      </MapContainer>

      <Box sx={{ position: 'absolute', top: 16, left: 64, zIndex: 1000, width: 300 }}>
        <Autocomplete
          options={trees}
          getOptionLabel={(option) => option.name || 'Arbre inconnu'}
          onChange={(_, newValue) => {
            if (newValue) {
              setSelectedTree(newValue);
              mapRef.current?.flyTo([newValue.lat, newValue.lon], 18);
            }
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Rechercher un arbre par nom" 
              variant="outlined" 
              size="small"
              sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
            />
          )}
        />
      </Box>

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
          {progressMsg}
        </Typography>
      </Backdrop>
    </div>
  );
};
