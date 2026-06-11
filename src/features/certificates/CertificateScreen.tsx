import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../../core/theme/colors';
import { typography } from '../../core/theme/typography';
import { spacing } from '../../core/theme/spacing';
import { AssessmentRepository } from '../../repositories/AssessmentRepository';
import type { Assessment } from '../../core/types/models';

export const CertificateScreen = ({ route, navigation }: any) => {
  const { assessmentId } = route.params;
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    AssessmentRepository.getAssessmentById(assessmentId).then(setAssessment);
  }, [assessmentId]);

  if (!assessment) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>✕ Close</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Certificate</Text>
        <View style={{ width: 60 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* The Certificate UI */}
        <View style={styles.certificateCard}>
          <View style={styles.certBorder}>
            <Text style={styles.logo}>🏆</Text>
            <Text style={styles.certHeader}>CERTIFICATE OF COMPLETION</Text>
            <Text style={styles.certSubtext}>This certifies that</Text>
            
            <Text style={styles.studentName}>Mourya</Text>
            
            <Text style={styles.certSubtext}>has successfully completed</Text>
            <Text style={styles.courseName}>{assessment.title.replace(' - Final Exam', '')}</Text>
            
            <View style={styles.signatureRow}>
              <View style={styles.signatureBox}>
                <Text style={styles.signature}>Victus LMS</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>Authorized Signature</Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signature}>{new Date().toLocaleDateString()}</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>Date</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Download PDF</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.outlineBtn}>
          <Text style={styles.outlineBtnText}>Share to LinkedIn</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.m, backgroundColor: colors.white },
  backButton: { padding: spacing.xs, width: 60 },
  backText: { ...typography.bodyMedium, color: colors.textMain },
  headerTitle: { ...typography.h3, color: colors.textMain },
  
  content: { padding: spacing.m },

  certificateCard: { backgroundColor: colors.white, padding: spacing.s, borderRadius: 16, elevation: 4, marginBottom: spacing.xl },
  certBorder: { borderWidth: 4, borderColor: '#D1D5DB', borderRadius: 12, padding: spacing.xl, alignItems: 'center' },
  logo: { fontSize: 48, marginBottom: spacing.m },
  certHeader: { ...typography.h1, color: '#1F2937', marginBottom: spacing.l, textAlign: 'center' },
  certSubtext: { ...typography.body, color: colors.textMuted, marginBottom: spacing.s },
  studentName: { fontSize: 32, fontWeight: '700', color: colors.primary, marginBottom: spacing.m, fontStyle: 'italic' },
  courseName: { ...typography.h2, color: '#1F2937', marginBottom: spacing.xl, textAlign: 'center' },

  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: spacing.xl },
  signatureBox: { alignItems: 'center', flex: 1 },
  signature: { fontFamily: 'serif', fontSize: 20, color: colors.textMain, marginBottom: 4 },
  signatureLine: { width: 100, height: 1, backgroundColor: colors.border, marginBottom: 4 },
  signatureLabel: { ...typography.caption, color: colors.textMuted },

  primaryBtn: { backgroundColor: colors.primary, padding: spacing.m, borderRadius: 8, alignItems: 'center', marginBottom: spacing.m },
  primaryBtnText: { ...typography.bodyMedium, color: colors.white },
  
  outlineBtn: { borderWidth: 1, borderColor: colors.primary, padding: spacing.m, borderRadius: 8, alignItems: 'center' },
  outlineBtnText: { ...typography.bodyMedium, color: colors.primary }
});
