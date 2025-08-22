import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { expedientesApi } from '../../api/expedientes.api';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { EXPEDIENTE_STATUS } from '../../types';

const ExpedientesListScreen = ({ navigation }) => {
  const { user, hasPermission } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');

  // Obtener expedientes con React Query
  const { data: expedientes, isLoading, error, refetch } = useQuery({
    queryKey: ['expedientes', searchQuery, selectedFilter],
    queryFn: () => expedientesApi.getExpedientes({
      search: searchQuery,
      estado: selectedFilter === 'todos' ? undefined : selectedFilter
    }),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const handleExpedientePress = (expediente) => {
    navigation.navigate('ExpedienteDetail', { id: expediente.id });
  };

  const handleNuevoExpediente = () => {
    if (hasPermission('expedientes.write')) {
      navigation.navigate('NuevoExpediente');
    } else {
      Alert.alert('Acceso Denegado', 'No tienes permisos para crear expedientes.');
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'abierto': return COLORS.primary;
      case 'en_tramite': return COLORS.warning;
      case 'resuelto': return COLORS.success;
      case 'archivado': return COLORS.text.secondary;
      default: return COLORS.text.secondary;
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'abierto': return 'Abierto';
      case 'en_tramite': return 'En Trámite';
      case 'resuelto': return 'Resuelto';
      case 'archivado': return 'Archivado';
      default: return estado;
    }
  };

  const FilterButton = ({ title, value, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const ExpedienteCard = ({ expediente }) => (
    <TouchableOpacity
      style={styles.expedienteCard}
      onPress={() => handleExpedientePress(expediente)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.expedienteNumber}>
          <Text style={styles.expedienteNumberText}>{expediente.nro}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(expediente.estado) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(expediente.estado) }]}>
            {getStatusText(expediente.estado)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.caratulaText} numberOfLines={2}>
        {expediente.caratula}
      </Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.fueroContainer}>
          <Ionicons name="business" size={16} color={COLORS.text.secondary} />
          <Text style={styles.fueroText}>{expediente.fuero}</Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Ionicons name="calendar" size={16} color={COLORS.text.secondary} />
          <Text style={styles.dateText}>
            {new Date(expediente.created_at).toLocaleDateString('es-AR')}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="eye" size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Ver</Text>
        </TouchableOpacity>
        
        {hasPermission('expedientes.write') && (
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create" size={20} color={COLORS.secondary} />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={COLORS.error} />
        <Text style={styles.errorTitle}>Error al cargar expedientes</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con logo */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/WhatsApp Image 2025-08-22 at 07.58.37 (3).jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Expedientes Judiciales</Text>
          <Text style={styles.headerSubtitle}>Poder Judicial de Tucumán</Text>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar expediente por número o carátula..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.text.disabled}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton
            title="Todos"
            value="todos"
            isSelected={selectedFilter === 'todos'}
            onPress={() => setSelectedFilter('todos')}
          />
          <FilterButton
            title="Abiertos"
            value="abierto"
            isSelected={selectedFilter === 'abierto'}
            onPress={() => setSelectedFilter('abierto')}
          />
          <FilterButton
            title="En Trámite"
            value="en_tramite"
            isSelected={selectedFilter === 'en_tramite'}
            onPress={() => setSelectedFilter('en_tramite')}
          />
          <FilterButton
            title="Resueltos"
            value="resuelto"
            isSelected={selectedFilter === 'resuelto'}
            onPress={() => setSelectedFilter('resuelto')}
          />
          <FilterButton
            title="Archivados"
            value="archivado"
            isSelected={selectedFilter === 'archivado'}
            onPress={() => setSelectedFilter('archivado')}
          />
        </ScrollView>
      </View>

      {/* Botón Nuevo Expediente */}
      {hasPermission('expedientes.write') && (
        <TouchableOpacity style={styles.nuevoExpedienteButton} onPress={handleNuevoExpediente}>
          <Ionicons name="add-circle" size={24} color={COLORS.text.inverse} />
          <Text style={styles.nuevoExpedienteText}>Nuevo Expediente</Text>
        </TouchableOpacity>
      )}

      {/* Lista de Expedientes */}
      <ScrollView
        style={styles.expedientesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="hourglass" size={48} color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando expedientes...</Text>
          </View>
        ) : expedientes?.length > 0 ? (
          expedientes.map((expediente) => (
            <ExpedienteCard key={expediente.id} expediente={expediente} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open" size={64} color={COLORS.text.disabled} />
            <Text style={styles.emptyTitle}>No hay expedientes</Text>
            <Text style={styles.emptyMessage}>
              {searchQuery || selectedFilter !== 'todos'
                ? 'No se encontraron expedientes con los filtros aplicados'
                : 'No hay expedientes registrados en el sistema'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  
  logo: {
    width: 60,
    height: 60,
    marginRight: SPACING.md,
  },
  
  headerContent: {
    flex: 1,
  },
  
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  
  headerSubtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
  },
  
  searchContainer: {
    padding: SPACING.screenPadding,
    backgroundColor: COLORS.surface,
  },
  
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    ...TYPOGRAPHY.body1,
    color: COLORS.text.primary,
  },
  
  filtersContainer: {
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  filterButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  
  filterButtonText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  
  filterButtonTextSelected: {
    color: COLORS.text.inverse,
  },
  
  nuevoExpedienteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    margin: SPACING.screenPadding,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.medium,
  },
  
  nuevoExpedienteText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.inverse,
    marginLeft: SPACING.sm,
  },
  
  expedientesList: {
    flex: 1,
    paddingHorizontal: SPACING.screenPadding,
  },
  
  expedienteCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  
  expedienteNumber: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  
  expedienteNumberText: {
    ...TYPOGRAPHY.h5,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  
  statusText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  
  caratulaText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  
  fueroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  fueroText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
  
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  dateText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
  
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background,
  },
  
  actionButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary,
    marginLeft: SPACING.xs,
  },
  
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  
  loadingText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
  },
  
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  
  emptyTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  
  emptyMessage: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.disabled,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.screenPadding,
  },
  
  errorTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.error,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  
  errorMessage: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  
  retryButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.inverse,
  },
});

export default ExpedientesListScreen; 