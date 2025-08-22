import React, { useState } from 'react';
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
import { useAuth } from '../../hooks/useAuth';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { USER_ROLES, USER_STATUS } from '../../types';

const UsuariosScreen = ({ navigation }) => {
  const { user, hasPermission } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');

  // Mock data para usuarios (en producción esto vendría de la API)
  const mockUsuarios = [
    {
      id: 1,
      nombre: 'Administrador del Sistema',
      email: 'admin@spjt.com',
      rol: 'admin',
      estado: 'activo',
      ultimo_acceso: '2025-08-22T10:00:00Z',
      institucion: 'Secretaría General'
    },
    {
      id: 2,
      nombre: 'Dr. Juan Pérez',
      email: 'juez.perez@spjt.com',
      rol: 'juez',
      estado: 'activo',
      ultimo_acceso: '2025-08-22T09:30:00Z',
      institucion: 'Juzgado Civil N° 1'
    },
    {
      id: 3,
      nombre: 'Lic. María González',
      email: 'secretaria.gonzalez@spjt.com',
      rol: 'secretario',
      estado: 'activo',
      ultimo_acceso: '2025-08-22T08:45:00Z',
      institucion: 'Juzgado Civil N° 1'
    },
    {
      id: 4,
      nombre: 'Carlos Rodríguez',
      email: 'operador.rodriguez@spjt.com',
      rol: 'operador',
      estado: 'activo',
      ultimo_acceso: '2025-08-22T07:15:00Z',
      institucion: 'Secretaría General'
    }
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Aquí podrías recargar datos de la API
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleNuevoUsuario = () => {
    if (hasPermission('usuarios.write')) {
      navigation.navigate('NuevoUsuario');
    } else {
      Alert.alert('Acceso Denegado', 'No tienes permisos para crear usuarios.');
    }
  };

  const handleEditarUsuario = (usuario) => {
    if (hasPermission('usuarios.write')) {
      navigation.navigate('EditarUsuario', { usuarioId: usuario.id });
    } else {
      Alert.alert('Acceso Denegado', 'No tienes permisos para editar usuarios.');
    }
  };

  const handleCambiarEstado = (usuario) => {
    if (hasPermission('usuarios.write')) {
      const newStatus = usuario.estado === 'activo' ? 'inactivo' : 'activo';
      Alert.alert(
        'Cambiar Estado',
        `¿Está seguro que desea ${newStatus === 'activo' ? 'activar' : 'desactivar'} al usuario ${usuario.nombre}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: () => {
            // Aquí implementarías la lógica para cambiar el estado
            Alert.alert('Éxito', `Usuario ${newStatus === 'activo' ? 'activado' : 'desactivado'} correctamente.`);
          }}
        ]
      );
    } else {
      Alert.alert('Acceso Denegado', 'No tienes permisos para cambiar el estado de usuarios.');
    }
  };

  const getRoleDisplayName = (rol) => {
    switch (rol) {
      case USER_ROLES.ADMIN: return 'Administrador';
      case USER_ROLES.JUEZ: return 'Juez';
      case USER_ROLES.SECRETARIO: return 'Secretario';
      case USER_ROLES.OPERADOR: return 'Operador';
      default: return rol;
    }
  };

  const getRoleColor = (rol) => {
    switch (rol) {
      case USER_ROLES.ADMIN: return COLORS.error;
      case USER_ROLES.JUEZ: return COLORS.primary;
      case USER_ROLES.SECRETARIO: return COLORS.secondary;
      case USER_ROLES.OPERADOR: return COLORS.info;
      default: return COLORS.text.secondary;
    }
  };

  const getStatusColor = (estado) => {
    return estado === 'activo' ? COLORS.success : COLORS.text.disabled;
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

  const UsuarioCard = ({ usuario }) => (
    <View style={styles.usuarioCard}>
      <View style={styles.usuarioHeader}>
        <View style={styles.usuarioAvatar}>
          <Ionicons name="person" size={24} color={getRoleColor(usuario.rol)} />
        </View>
        <View style={styles.usuarioInfo}>
          <Text style={styles.usuarioNombre}>{usuario.nombre}</Text>
          <Text style={styles.usuarioEmail}>{usuario.email}</Text>
        </View>
        <View style={styles.usuarioStatus}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(usuario.estado) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(usuario.estado) }]}>
            {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
      
      <View style={styles.usuarioDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="business" size={16} color={COLORS.text.secondary} />
          <Text style={styles.detailText}>{usuario.institucion}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={COLORS.text.secondary} />
          <Text style={styles.detailText}>
            Último acceso: {new Date(usuario.ultimo_acceso).toLocaleDateString('es-AR')}
          </Text>
        </View>
      </View>
      
      <View style={styles.usuarioActions}>
        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(usuario.rol) + '20' }]}>
          <Text style={[styles.roleText, { color: getRoleColor(usuario.rol) }]}>
            {getRoleDisplayName(usuario.rol)}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          {hasPermission('usuarios.write') && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditarUsuario(usuario)}
            >
              <Ionicons name="create" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          
          {hasPermission('usuarios.write') && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCambiarEstado(usuario)}
            >
              <Ionicons 
                name={usuario.estado === 'activo' ? 'pause-circle' : 'play-circle'} 
                size={20} 
                color={usuario.estado === 'activo' ? COLORS.warning : COLORS.success} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  // Filtrar usuarios según búsqueda y filtros
  const filteredUsuarios = mockUsuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'todos' || usuario.rol === selectedFilter;
    return matchesSearch && matchesFilter;
  });

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
          <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
          <Text style={styles.headerSubtitle}>Poder Judicial de Tucumán</Text>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuario por nombre o email..."
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

      {/* Filtros por rol */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton
            title="Todos"
            value="todos"
            isSelected={selectedFilter === 'todos'}
            onPress={() => setSelectedFilter('todos')}
          />
          <FilterButton
            title="Administradores"
            value="admin"
            isSelected={selectedFilter === 'admin'}
            onPress={() => setSelectedFilter('admin')}
          />
          <FilterButton
            title="Jueces"
            value="juez"
            isSelected={selectedFilter === 'juez'}
            onPress={() => setSelectedFilter('juez')}
          />
          <FilterButton
            title="Secretarios"
            value="secretario"
            isSelected={selectedFilter === 'secretario'}
            onPress={() => setSelectedFilter('secretario')}
          />
          <FilterButton
            title="Operadores"
            value="operador"
            isSelected={selectedFilter === 'operador'}
            onPress={() => setSelectedFilter('operador')}
          />
        </ScrollView>
      </View>

      {/* Botón Nuevo Usuario */}
      {hasPermission('usuarios.write') && (
        <TouchableOpacity style={styles.nuevoUsuarioButton} onPress={handleNuevoUsuario}>
          <Ionicons name="person-add" size={24} color={COLORS.text.inverse} />
          <Text style={styles.nuevoUsuarioText}>Nuevo Usuario</Text>
        </TouchableOpacity>
      )}

      {/* Lista de Usuarios */}
      <ScrollView
        style={styles.usuariosList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredUsuarios.length > 0 ? (
          filteredUsuarios.map((usuario) => (
            <UsuarioCard key={usuario.id} usuario={usuario} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={64} color={COLORS.text.disabled} />
            <Text style={styles.emptyTitle}>No hay usuarios</Text>
            <Text style={styles.emptyMessage}>
              {searchQuery || selectedFilter !== 'todos'
                ? 'No se encontraron usuarios con los filtros aplicados'
                : 'No hay usuarios registrados en el sistema'
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
  
  nuevoUsuarioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    margin: SPACING.screenPadding,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.medium,
  },
  
  nuevoUsuarioText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.inverse,
    marginLeft: SPACING.sm,
  },
  
  usuariosList: {
    flex: 1,
    paddingHorizontal: SPACING.screenPadding,
  },
  
  usuarioCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  
  usuarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  usuarioAvatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  
  usuarioInfo: {
    flex: 1,
  },
  
  usuarioNombre: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  
  usuarioEmail: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
  },
  
  usuarioStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.xs,
  },
  
  statusText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  
  usuarioDetails: {
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  detailText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
  
  usuarioActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  roleBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  
  roleText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  
  actionButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background,
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
});

export default UsuariosScreen; 