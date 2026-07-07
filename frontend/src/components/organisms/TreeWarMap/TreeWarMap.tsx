import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import type { Map as LeafletMap, LatLngBounds } from 'leaflet';
import { Backdrop, CircularProgress, Alert, Box, Autocomplete, TextField, createFilterOptions, Fab, Popover, IconButton, Select, MenuItem, InputLabel, FormControl, Stack } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../../context/AuthContext';
import { useAppTheme } from '../../../context/ThemeContext';
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

const filterTrees = createFilterOptions<ParisTree>({
  matchFrom: 'start',
  stringify: (option) => [option.sponsorship.customName, option.name, option.genus, option.species].filter(Boolean).join(' '),
});

const MapTracker: React.FC<{ onBoundsChange: (bounds: LatLngBounds) => void }> = ({ onBoundsChange }) => {
  const map = useMapEvents({
    moveend: () => onBoundsChange(map.getBounds()),
    zoomend: () => onBoundsChange(map.getBounds()),
  });
  useEffect(() => {
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);
  return null;
};

const MapFlyTo: React.FC<{ targetTree: ParisTree | null; pendingTarget: [number, number] | null; onFlown: () => void }> = ({ targetTree, pendingTarget, onFlown }) => {
  const map = useMap();
  useEffect(() => {
    if (targetTree) {
      map.flyTo([targetTree.lat, targetTree.lon], 18, { animate: true, duration: 1.5 });
    }
  }, [map, targetTree]);
  useEffect(() => {
    if (pendingTarget) {
      map.flyTo(pendingTarget, 18, { animate: true, duration: 1.5 });
      onFlown();
    }
  }, [map, pendingTarget, onFlown]);
  return null;
};

export const TreeWarMap: React.FC = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const [trees, setTrees] = useState<ParisTree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progressMsg, setProgressMsg] = useState<string>('Chargement des arbres du serveur...');
  const [error, setError] = useState<string | null>(null);
  const [selectedTree, setSelectedTree] = useState<ParisTree | null>(null);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const { user } = useAuth();
  const { mode, toggleColorMode } = useAppTheme();

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sponsored' | 'mine' | 'remarkable'>('all');
  const [minPriceFilter, setMinPriceFilter] = useState<number | ''>('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | ''>('');
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  // Pending fly-to target from URL (set inside MapContainer context via MapFlyTo)
  const [pendingFlyTarget, setPendingFlyTarget] = useState<[number, number] | null>(null);
  const pendingTreeIdRef = useRef<string | null>(null);
  const onFlown = useCallback(() => setPendingFlyTarget(null), []);

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
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);

  // Read URL params on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const company = searchParams.get('company');
    if (company) {
      setCompanyFilter(company);
    }
    const treeId = searchParams.get('treeId');
    if (treeId) {
      pendingTreeIdRef.current = treeId;
    }
    if (company || treeId) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // When trees load, resolve the pending treeId from URL
  useEffect(() => {
    if (trees.length > 0 && pendingTreeIdRef.current) {
      const treeId = pendingTreeIdRef.current;
      const found = trees.find((t) => t.sponsorship?.dbTreeId === treeId);
      if (found) {
        pendingTreeIdRef.current = null;
        setSelectedTree(found);
        setPendingFlyTarget([found.lat, found.lon]);
      }
    }
  }, [trees]);

  const handleBuySuccess = () => {
    setSelectedTree(null);
    fetchTrees();
  };

  const handleBoundsChange = useCallback((bounds: LatLngBounds) => {
    setMapBounds(bounds);
  }, []);

  const filteredTrees = useMemo(() => {
    return trees.filter((tree) => {
      if (statusFilter === 'available' && tree.sponsorship.status !== 'available') return false;
      if (statusFilter === 'sponsored' && tree.sponsorship.status !== 'sponsored') return false;
      if (statusFilter === 'mine' && tree.sponsorship.ownerId !== user?.id) return false;
      if (statusFilter === 'remarkable' && !tree.remarkable) return false;

      const currentPrice = tree.sponsorship.currentPrice || 100;
      if (minPriceFilter !== '' && currentPrice < minPriceFilter) return false;
      if (maxPriceFilter !== '' && currentPrice > maxPriceFilter) return false;

      if (companyFilter && tree.sponsorship.companyName !== companyFilter) return false;

      return true;
    });
  }, [trees, statusFilter, minPriceFilter, maxPriceFilter, companyFilter, user]);

  let visibleTreesCount = 0;
  if (mapBounds) {
    for (const tree of filteredTrees) {
      if (mapBounds.contains([tree.lat, tree.lon])) {
        visibleTreesCount++;
        if (visibleTreesCount > 25) break;
      }
    }
  }
  const showTooltips = visibleTreesCount > 0 && visibleTreesCount <= 25;

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
          attribution={
            mode === 'dark' 
              ? '&copy; <a href="https://carto.com/">CARTO</a>'
              : '&copy; OpenStreetMap contributors'
          }
          url={
            mode === 'dark'
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />
        <MapTracker onBoundsChange={handleBoundsChange} />
        <MapFlyTo targetTree={selectedTree} pendingTarget={pendingFlyTarget} onFlown={onFlown} />
        {filteredTrees.map((tree) => {
          const isSelected = selectedTree && tree.id === selectedTree.id;
          let markerStyle: keyof typeof TREE_MARKER_COLORS = 'normal';
          if (isSelected) {
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
              radius={isSelected ? 10 : 6}
              pathOptions={{
                color: isSelected ? '#ffffff' : 'transparent',
                fillColor: TREE_MARKER_COLORS[markerStyle],
                fillOpacity: isSelected ? 1 : 0.85,
                weight: isSelected ? 3 : 40,
              }}
              eventHandlers={{ 
                click: () => {
                  setSelectedTree(tree);
                  mapRef.current?.flyTo([tree.lat, tree.lon], 18, { duration: 0.5 });
                } 
              }}
            >
              {showTooltips && (
                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {tree.sponsorship.customName || tree.name || 'Arbre inconnu'}
                    </Typography>
                    {tree.sponsorship.status === 'sponsored' ? (
                      <Typography variant="caption" sx={{ display: 'block', color: 'primary.main', mt: 0.5 }}>
                        Détenu par {tree.sponsorship.companyName}
                      </Typography>
                    ) : (
                      <Typography variant="caption" sx={{ display: 'block', color: 'success.main', mt: 0.5 }}>
                        Disponible à l'achat
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>
                      (Cliquez pour acheter)
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </CircleMarker>
          );
        })}
      </MapContainer>

      <Box sx={{ position: 'absolute', top: 16, left: 84, zIndex: 1000, width: 300 }}>
        <Autocomplete
          options={filteredTrees}
          filterOptions={filterTrees}
          getOptionLabel={(option) => option.sponsorship.customName || option.name || 'Arbre inconnu'}
          value={selectedTree}
          onChange={(_, newValue) => {
            if (newValue) {
              setSelectedTree(newValue);
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

      <Fab 
        variant="extended"
        color="secondary" 
        size="medium"
        onClick={(e) => setFilterAnchorEl(e.currentTarget)}
        sx={{ 
          position: 'absolute', 
          top: 16, 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 1000,
          px: 3,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        <FilterListIcon sx={{ mr: 1 }} />
        Filtrer la recherche
      </Fab>

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 3, width: 320 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Filtres de carte</Typography>
            <IconButton size="small" onClick={() => setFilterAnchorEl(null)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stack spacing={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut de l'arbre</InputLabel>
              <Select
                value={statusFilter}
                label="Statut de l'arbre"
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <MenuItem value="all">Tous les arbres</MenuItem>
                <MenuItem value="available">Disponibles</MenuItem>
                <MenuItem value="sponsored">Déjà Achetés</MenuItem>
                {user && <MenuItem value="mine">Mes arbres</MenuItem>}
                <MenuItem value="remarkable">Remarquables</MenuItem>
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Prix Min"
                type="number"
                size="small"
                fullWidth
                value={minPriceFilter}
                onChange={(e) => setMinPriceFilter(e.target.value ? Number(e.target.value) : '')}
              />
              <TextField
                label="Prix Max"
                type="number"
                size="small"
                fullWidth
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(e.target.value ? Number(e.target.value) : '')}
              />
            </Stack>
          </Stack>
        </Box>
      </Popover>

      {selectedTree && (
        <TreeWarInfoPanel
          tree={selectedTree}
          onClose={() => setSelectedTree(null)}
          onBuySuccess={handleBuySuccess}
        />
      )}

      <Fab 
        size="medium"
        onClick={toggleColorMode}
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: selectedTree ? 410 : 16, 
          zIndex: 1000,
          transition: 'right 0.3s ease',
          bgcolor: mode === 'dark' ? '#FFC107' : 'primary.main',
          color: mode === 'dark' ? '#1a1a1a' : '#fff',
          '&:hover': {
            bgcolor: mode === 'dark' ? '#FFD54F' : 'primary.dark',
          },
        }}
      >
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </Fab>

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
