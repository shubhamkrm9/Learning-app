import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../../../core/theme/colors';
import { typography } from '../../../core/theme/typography';
import { spacing } from '../../../core/theme/spacing';

export const LessonTabs = ({ description }: { description: string }) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Notes' | 'Resources'>('Overview');
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  const handleSaveNote = () => {
    if (note.trim()) {
      setSavedNotes([...savedNotes, note.trim()]);
      setNote('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        {['Overview', 'Notes', 'Resources'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tabContent}>
        {activeTab === 'Overview' && (
          <View>
            <Text style={styles.sectionTitle}>ABOUT THIS LESSON</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        )}

        {activeTab === 'Notes' && (
          <View>
            <TextInput 
              style={styles.noteInput}
              placeholder="Add a timestamped note..."
              value={note}
              onChangeText={setNote}
              onSubmitEditing={handleSaveNote}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addNoteBtn} onPress={handleSaveNote}>
              <Text style={styles.addNoteText}>+ Add Note</Text>
            </TouchableOpacity>

            <View style={styles.notesList}>
              {savedNotes.map((n, i) => (
                <View key={i} style={styles.savedNoteCard}>
                  <Text style={styles.noteTime}>[05:12]</Text>
                  <Text style={styles.noteText}>{n}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'Resources' && (
          <View>
            <TouchableOpacity style={styles.resourceItem}>
              <Text style={styles.resourceIcon}>📄</Text>
              <Text style={styles.resourceText}>Lesson Slides (PDF)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceItem}>
              <Text style={styles.resourceIcon}>🔗</Text>
              <Text style={styles.resourceText}>Github Repository</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tabItem: { flex: 1, paddingVertical: spacing.m, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: colors.primary },
  tabText: { ...typography.bodyMedium, color: colors.textMuted },
  tabTextActive: { color: colors.primary },
  
  tabContent: { padding: spacing.m },
  sectionTitle: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.m, fontWeight: '700' },
  description: { ...typography.body, color: colors.textMain, lineHeight: 24 },

  noteInput: { backgroundColor: colors.surface, padding: spacing.m, borderRadius: 8, ...typography.body, marginBottom: spacing.m },
  addNoteBtn: { alignSelf: 'flex-start', marginBottom: spacing.m },
  addNoteText: { ...typography.bodyMedium, color: colors.primary },
  notesList: { marginTop: spacing.m },
  savedNoteCard: { backgroundColor: colors.white, padding: spacing.m, borderRadius: 8, marginBottom: spacing.s, elevation: 1 },
  noteTime: { ...typography.caption, color: colors.primary, marginBottom: 4 },
  noteText: { ...typography.body, color: colors.textMain },

  resourceItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.m, borderBottomWidth: 1, borderBottomColor: colors.divider },
  resourceIcon: { fontSize: 20, marginRight: spacing.m },
  resourceText: { ...typography.body, color: colors.primary },
});
