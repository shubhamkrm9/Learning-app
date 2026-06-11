import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { colors } from '../../core/theme/colors';
import { typography } from '../../core/theme/typography';
import { spacing } from '../../core/theme/spacing';
import { ModuleRepository } from './moduleApi';
import type { Module } from '../../core/types/models';

const CATEGORIES = ['All', 'Mobile', 'Frontend', 'Backend', 'Cloud'];

export const ModulesScreen = ({ navigation }: any) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    ModuleRepository.getModules().then(setModules);
  }, []);

  const filteredModules = modules.filter(m => {
    if (category !== 'All' && m.category !== category) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const renderItem = ({ item }: { item: Module }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('ModuleDetail', { id: item.id })}
    >
      <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>📖 {item.totalLessons} Lessons   ⏱ {item.durationString}   📊 {item.level}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Progress</Text>
          <Text style={styles.progressPercent}>{item.progressPercent}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${item.progressPercent}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search modules..." 
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList 
          horizontal 
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.categoryPill, category === item && styles.categoryPillActive]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* List */}
      <FlatList 
        data={filteredModules}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, margin: spacing.m, paddingHorizontal: spacing.m, borderRadius: 8, height: 48, borderWidth: 1, borderColor: colors.border },
  searchIcon: { fontSize: 18, marginRight: spacing.s },
  searchInput: { flex: 1, ...typography.body, color: colors.textMain },
  
  categoriesContainer: { paddingLeft: spacing.m, marginBottom: spacing.m },
  categoryPill: { paddingHorizontal: spacing.m, paddingVertical: spacing.s, borderRadius: 20, backgroundColor: colors.white, marginRight: spacing.s, borderWidth: 1, borderColor: colors.border },
  categoryPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { ...typography.bodyMedium, color: colors.textMain },
  categoryTextActive: { color: colors.white },

  listContent: { padding: spacing.m, paddingBottom: spacing.xxl },
  card: { backgroundColor: colors.white, borderRadius: 12, marginBottom: spacing.l, overflow: 'hidden', elevation: 2 },
  thumbnail: { width: '100%', height: 160, backgroundColor: colors.border },
  cardContent: { padding: spacing.m },
  title: { ...typography.h3, color: colors.textMain, marginBottom: spacing.s },
  meta: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.m },
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressText: { ...typography.caption, color: colors.textMain },
  progressPercent: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  progressBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
});
