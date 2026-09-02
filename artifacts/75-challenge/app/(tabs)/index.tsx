import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useChallenge } from '@/context/ChallengeContext';
import { Card, CheckRow, Eyebrow, NumberInput, Pill, ProgressBar, Screen, Title } from '@/components/ChallengeUI';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { hydrated, currentDay, currentPhase, todayMeals, todayLog, setSteps, toggleWorkout, toggleMeal } = useChallenge();
  const completion = useMemo(() => [todayLog.steps >= currentPhase.steps, todayLog.workout, todayLog.meals.breakfast, todayLog.meals.snack, todayLog.meals.dinner].filter(Boolean).length / 5, [todayLog, currentPhase.steps]);
  if (!hydrated) return <Screen style={{ backgroundColor: colors.background }}><Text style={{ color: colors.foreground }}>Loading your challenge…</Text></Screen>;
  return <Screen style={{ paddingTop: insets.top + 12, backgroundColor: colors.background }}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
    <View style={styles.topLine}><View><Eyebrow>75 challenge</Eyebrow><Title style={styles.greeting}>Make today count.</Title></View><View style={[styles.todayMark, { backgroundColor: colors.accent }]}><Feather name="sun" size={18} color={colors.accentForeground} /></View></View>
    <View style={[styles.hero, { backgroundColor: colors.forest }]}><View style={styles.heroTop}><View><Text style={[styles.heroKicker, { color: colors.sage }]}>DAY {currentDay} OF 75</Text><Text style={[styles.heroTitle, { color: colors.cream }]}>{currentPhase.name}</Text></View><Pill tone="gold">{currentPhase.steps / 1000}k steps</Pill></View><ProgressBar value={currentDay / 75} color={colors.accent} /><View style={styles.heroBottom}><Text style={[styles.heroSub, { color: colors.sage }]}>{currentPhase.subtitle}</Text><Text style={[styles.heroSub, { color: colors.sage }]}>{Math.round(currentDay / 75 * 100)}% journey</Text></View></View>
    <View style={styles.sectionHeading}><View><Eyebrow>Today</Eyebrow><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your daily rhythm</Text></View><Text style={[styles.completion, { color: colors.primary }]}>{Math.round(completion * 100)}%</Text></View>
    <Card><View style={styles.stepHeader}><View style={[styles.stepIcon, { backgroundColor: colors.peach }]}><Feather name="activity" size={19} color={colors.primary} /></View><View style={styles.stepCopy}><Text style={[styles.stepTitle, { color: colors.foreground }]}>Walk it out</Text><Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{todayLog.steps >= currentPhase.steps ? 'Goal reached — keep going.' : `${Math.max(0, currentPhase.steps - todayLog.steps).toLocaleString()} to go today`}</Text></View><Text style={[styles.stepGoal, { color: colors.foreground }]}>{todayLog.steps.toLocaleString()}<Text style={{ color: colors.mutedForeground, fontSize: 12 }}> / {currentPhase.steps.toLocaleString()}</Text></Text></View><ProgressBar value={todayLog.steps / currentPhase.steps} color={colors.primary} /><View style={styles.stepInputRow}><NumberInput value={todayLog.steps} onChange={setSteps} /><Text style={[styles.inputHint, { color: colors.mutedForeground }]}>Log your latest step count</Text></View></Card>
    <Card style={styles.listCard}><CheckRow icon="sun" label="Breakfast" detail={todayMeals.breakfast} checked={todayLog.meals.breakfast} onPress={() => toggleMeal('breakfast')} /><CheckRow icon="circle" label="Chia pudding" detail={todayMeals.snack} checked={todayLog.meals.snack} onPress={() => toggleMeal('snack')} /><CheckRow icon="moon" label="Dinner" detail={todayMeals.dinner} checked={todayLog.meals.dinner} onPress={() => toggleMeal('dinner')} /><View style={[styles.rowDivider, { backgroundColor: colors.border }]} /><CheckRow icon="zap" label="Workout" detail={`${currentPhase.workouts} sessions this week`} checked={todayLog.workout} onPress={toggleWorkout} /></Card>
    <View style={[styles.note, { backgroundColor: colors.sky }]}><Feather name="info" size={17} color={colors.forest} /><Text style={[styles.noteText, { color: colors.forest }]}>Small choices, repeated daily, become your strong finish.</Text></View>
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 116, gap: 16 },
  topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  greeting: { marginTop: 5 },
  todayMark: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  hero: { borderRadius: 26, padding: 20, gap: 17 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroKicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.3 },
  heroTitle: { fontSize: 27, fontWeight: '700', marginTop: 6 },
  heroBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  heroSub: { fontSize: 12, fontWeight: '600' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 5 },
  sectionTitle: { fontSize: 19, fontWeight: '700', marginTop: 4 },
  completion: { fontSize: 18, fontWeight: '700' },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stepIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepCopy: { flex: 1, marginLeft: 11 },
  stepTitle: { fontSize: 15, fontWeight: '700' },
  stepSub: { fontSize: 12, marginTop: 3 },
  stepGoal: { fontSize: 14, fontWeight: '700' },
  stepInputRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 14 },
  inputHint: { fontSize: 11, flex: 1, lineHeight: 16 },
  listCard: { paddingVertical: 7 },
  rowDivider: { height: 1, marginVertical: 5, marginLeft: 48 },
  note: { borderRadius: 16, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center' },
  noteText: { fontSize: 12, fontWeight: '600', lineHeight: 17, flex: 1 },
});
