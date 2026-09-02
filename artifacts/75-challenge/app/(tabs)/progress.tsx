import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useChallenge } from '@/context/ChallengeContext';
import { Body, Card, Eyebrow, Pill, ProgressBar, Screen, Title } from '@/components/ChallengeUI';
import { useColors } from '@/hooks/useColors';

export default function ProgressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, currentDay } = useChallenge();
  const completedDays = useMemo(() => Object.values(state.logs).filter((log) => log.completed || (log.steps > 0 && log.workout && Object.values(log.meals).every(Boolean))).length, [state.logs]);
  return <Screen style={{ backgroundColor: colors.background, paddingTop: insets.top + 12 }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Eyebrow>Your progress</Eyebrow><Title style={styles.title}>Keep showing up.</Title><Body style={styles.intro}>Progress is the practice, not the perfect streak.</Body>
      <View style={styles.stats}><Card style={styles.statCard}><Text style={[styles.statValue, { color: colors.primary }]}>{currentDay}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>current day</Text></Card><Card style={styles.statCard}><Text style={[styles.statValue, { color: colors.forest }]}>{completedDays}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>days logged</Text></Card></View>
      <Card style={styles.journeyCard}><View style={styles.cardTitleRow}><View><Text style={[styles.cardTitle, { color: colors.foreground }]}>Your 75-day arc</Text><Text style={[styles.cardSub, { color: colors.mutedForeground }]}>One phase at a time</Text></View><Feather name="trending-up" color={colors.primary} size={21} /></View><ProgressBar value={currentDay / 75} color={colors.primary} /><View style={styles.phaseRows}>{state.phases.map((phase) => { const phaseStart = phase.id === 1 ? 1 : phase.id === 2 ? 26 : 51; const phaseEnd = phase.id === 1 ? 25 : phase.id === 2 ? 50 : 75; const phaseProgress = currentDay < phaseStart ? 0 : Math.min(1, (currentDay - phaseStart + 1) / (phaseEnd - phaseStart + 1)); const active = currentDay >= phaseStart && currentDay <= phaseEnd; return <View key={phase.id} style={styles.phaseRow}><View style={[styles.phaseDot, { backgroundColor: phaseProgress > 0 ? colors.primary : colors.muted }]}>{phaseProgress >= 1 && <Feather name="check" size={11} color={colors.primaryForeground} />}</View><View style={styles.phaseInfo}><Text style={[styles.phaseLabel, { color: colors.foreground }]}>{phase.name} {active ? '• now' : ''}</Text><Text style={[styles.phaseMeta, { color: colors.mutedForeground }]}>Days {phaseStart}–{phaseEnd} · {phase.steps.toLocaleString()} steps</Text></View><Text style={[styles.phasePercent, { color: phaseProgress > 0 ? colors.primary : colors.mutedForeground }]}>{Math.round(phaseProgress * 100)}%</Text></View>; })}</View></Card>
      <View style={[styles.quote, { backgroundColor: colors.forest }]}><Feather name="heart" color={colors.accent} size={19} /><Text style={[styles.quoteText, { color: colors.cream }]}>You do not need a perfect 75 days. You need one honest day, repeated.</Text></View>
      <View style={[styles.tip, { backgroundColor: colors.peach }]}><Pill tone="peach">A gentle reminder</Pill><Text style={[styles.tipText, { color: colors.foreground }]}>Your plan is here to support you. Adjust meals when life happens, and come back to the next choice.</Text></View>
    </ScrollView>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120, gap: 14 },
  title: { marginTop: 6, marginBottom: 5 },
  intro: { marginBottom: 8 },
  stats: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, minHeight: 95, justifyContent: 'center' },
  statValue: { fontSize: 31, fontWeight: '700' },
  statLabel: { fontSize: 11, marginTop: 4 },
  journeyCard: { gap: 18 },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700' },
  cardSub: { fontSize: 12, marginTop: 4 },
  phaseRows: { gap: 14 },
  phaseRow: { flexDirection: 'row', alignItems: 'center' },
  phaseDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  phaseInfo: { flex: 1, marginLeft: 11 },
  phaseLabel: { fontSize: 13, fontWeight: '700' },
  phaseMeta: { fontSize: 11, marginTop: 3 },
  phasePercent: { fontSize: 12, fontWeight: '700' },
  quote: { borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  quoteText: { fontSize: 15, lineHeight: 22, fontWeight: '600', flex: 1 },
  tip: { borderRadius: 18, padding: 16, gap: 10 },
  tipText: { fontSize: 13, lineHeight: 19 },
});