import React from 'react';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChallenge } from '@/context/ChallengeContext';
import { Body, Card, Eyebrow, Pill, Screen, Title } from '@/components/ChallengeUI';
import { useColors } from '@/hooks/useColors';

type MealType = 'breakfast' | 'snack' | 'dinner';

export default function PlanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, updateMeal, updateMealChoice } = useChallenge();
  return <Screen style={{ backgroundColor: colors.background, paddingTop: insets.top + 12 }}>
    <KeyboardAwareScrollViewCompat bottomOffset={24} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Eyebrow>Your plan</Eyebrow>
      <Title style={styles.title}>Three chapters, no food fatigue.</Title>
      <Body style={styles.intro}>Add two choices for each meal, then set the rotation once. Each day will tell you exactly what to eat.</Body>
      {state.phases.map((phase) => <Card key={phase.id} style={styles.phaseCard}>
        <View style={styles.phaseHeader}><View><Text style={[styles.phaseNumber, { color: colors.primary }]}>0{phase.id}</Text><Text style={[styles.phaseName, { color: colors.foreground }]}>{phase.name}</Text></View><Pill tone={phase.id === 3 ? 'gold' : phase.id === 2 ? 'peach' : 'sage'}>{phase.id === 1 ? 'Days 1–25' : phase.id === 2 ? 'Days 26–50' : 'Days 51–75'}</Pill></View>
        <View style={styles.targets}><View><Text style={[styles.targetValue, { color: colors.foreground }]}>{phase.steps / 1000}k</Text><Text style={[styles.targetLabel, { color: colors.mutedForeground }]}>steps / day</Text></View><View><Text style={[styles.targetValue, { color: colors.foreground }]}>{phase.workouts}x</Text><Text style={[styles.targetLabel, { color: colors.mutedForeground }]}>workouts / week</Text></View></View>
        <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>BREAKFAST CHOICES</Text>
        <MealInput label="Option A" value={phase.meals.breakfasts[0]} onChangeText={(value) => updateMeal(phase.id, 'breakfast0', value)} />
        <MealInput label="Option B" value={phase.meals.breakfasts[1]} onChangeText={(value) => updateMeal(phase.id, 'breakfast1', value)} />
        <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>CHIA PUDDING CHOICES</Text>
        <MealInput label="Option A" value={phase.meals.snacks[0]} onChangeText={(value) => updateMeal(phase.id, 'snack0', value)} />
        <MealInput label="Option B" value={phase.meals.snacks[1]} onChangeText={(value) => updateMeal(phase.id, 'snack1', value)} />
        <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>DINNER CHOICES</Text>
        <MealInput label="Option A" value={phase.meals.dinners[0]} onChangeText={(value) => updateMeal(phase.id, 'dinner0', value)} />
        <MealInput label="Option B" value={phase.meals.dinners[1]} onChangeText={(value) => updateMeal(phase.id, 'dinner1', value)} />
        <View style={[styles.rule, { backgroundColor: colors.secondary }]}><Text style={[styles.ruleLabel, { color: colors.forest }]}>FOOD FOCUS</Text><Text style={[styles.ruleText, { color: colors.forest }]}>{phase.foodRule}</Text></View>
        <Text style={[styles.rotationTitle, { color: colors.foreground }]}>Meal rotation</Text>
        <Text style={[styles.rotationSub, { color: colors.mutedForeground }]}>Choose A or B for each day. It starts with an alternating pattern to make setup faster.</Text>
        <View style={styles.rotationHeader}><Text style={[styles.rotationHeaderText, { color: colors.mutedForeground }]}>DAY</Text><Text style={[styles.rotationHeaderText, { color: colors.mutedForeground }]}>BREAKFAST</Text><Text style={[styles.rotationHeaderText, { color: colors.mutedForeground }]}>SNACK</Text><Text style={[styles.rotationHeaderText, { color: colors.mutedForeground }]}>DINNER</Text></View>
        {phase.meals.schedule.map((day, dayIndex) => <View key={`${phase.id}-${dayIndex}`} style={[styles.rotationRow, { borderTopColor: colors.border }]}><Text style={[styles.dayLabel, { color: colors.foreground }]}>{dayIndex + 1}</Text><ChoiceButtons value={day.breakfast} onChange={(choice) => updateMealChoice(phase.id, dayIndex, 'breakfast', choice)} /><ChoiceButtons value={day.snack} onChange={(choice) => updateMealChoice(phase.id, dayIndex, 'snack', choice)} /><ChoiceButtons value={day.dinner} onChange={(choice) => updateMealChoice(phase.id, dayIndex, 'dinner', choice)} /></View>)}
      </Card>)}
    </KeyboardAwareScrollViewCompat>
  </Screen>;
}

function MealInput({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  const colors = useColors();
  return <View style={styles.inputRow}><Text style={[styles.optionLabel, { color: colors.mutedForeground }]}>{label}</Text><TextInput testID={`meal-${label}`} value={value} onChangeText={onChangeText} style={[styles.input, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]} placeholder="Add your meal" placeholderTextColor={colors.mutedForeground} /></View>;
}

function ChoiceButtons({ value, onChange }: { value: 0 | 1; onChange: (value: 0 | 1) => void }) {
  const colors = useColors();
  return <View style={styles.choiceButtons}>{([0, 1] as const).map((choice) => <Pressable key={choice} accessibilityLabel={`Choose meal option ${choice === 0 ? 'A' : 'B'}`} testID={`meal-choice-${choice}`} onPress={() => onChange(choice)} style={({ pressed }) => [styles.choice, { backgroundColor: value === choice ? colors.primary : colors.muted }, pressed && { opacity: 0.7 }]}><Text style={[styles.choiceText, { color: value === choice ? colors.primaryForeground : colors.mutedForeground }]}>{choice === 0 ? 'A' : 'B'}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120, gap: 10 },
  title: { marginTop: 6, marginBottom: 5 },
  intro: { marginBottom: 10 },
  phaseCard: { gap: 10, marginBottom: 2 },
  phaseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  phaseNumber: { fontSize: 11, fontWeight: '700', letterSpacing: 1.3 },
  phaseName: { fontSize: 21, fontWeight: '700', marginTop: 4 },
  targets: { flexDirection: 'row', gap: 30, paddingVertical: 8 },
  targetValue: { fontSize: 18, fontWeight: '700' },
  targetLabel: { fontSize: 11, marginTop: 2 },
  fieldLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.1, marginTop: 7 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionLabel: { width: 52, fontSize: 11, fontWeight: '600' },
  input: { flex: 1, minHeight: 42, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13 },
  rule: { borderRadius: 12, padding: 12, marginTop: 8 },
  ruleLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
  ruleText: { fontSize: 12, lineHeight: 17, marginTop: 4 },
  rotationTitle: { fontSize: 17, fontWeight: '700', marginTop: 13 },
  rotationSub: { fontSize: 12, lineHeight: 17, marginBottom: 3 },
  rotationHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  rotationHeaderText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.6, textAlign: 'center', flex: 1 },
  rotationRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, paddingVertical: 6 },
  dayLabel: { width: 29, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  choiceButtons: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 3 },
  choice: { width: 25, height: 25, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  choiceText: { fontSize: 10, fontWeight: '700' },
});