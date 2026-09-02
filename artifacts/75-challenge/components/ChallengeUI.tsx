import React, { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}
export function Eyebrow({ children }: { children: ReactNode }) {
  const colors = useColors();
  return <Text style={[styles.eyebrow, { color: colors.primary }]}>{children}</Text>;
}
export function Title({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const colors = useColors();
  return <Text style={[styles.title, { color: colors.foreground }, style]}>{children}</Text>;
}
export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const colors = useColors();
  return <Text style={[styles.body, { color: colors.mutedForeground }, style]}>{children}</Text>;
}
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const colors = useColors();
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>{children}</View>;
}
export function IconButton({ icon, onPress, label }: { icon: keyof typeof Feather.glyphMap; onPress?: () => void; label: string }) {
  const colors = useColors();
  return <Pressable accessibilityLabel={label} testID={label} onPress={onPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.secondary }, pressed && styles.pressed]}><Feather name={icon} size={18} color={colors.forest} /></Pressable>;
}
export function CheckRow({ label, detail, checked, onPress, icon }: { label: string; detail: string; checked: boolean; onPress: () => void; icon: keyof typeof Feather.glyphMap }) {
  const colors = useColors();
  return <Pressable testID={label} onPress={onPress} style={({ pressed }) => [styles.checkRow, pressed && styles.pressed]}>
    <View style={[styles.checkIcon, { backgroundColor: checked ? colors.primary : colors.muted }]}>{checked ? <Feather name="check" size={17} color={colors.primaryForeground} /> : <Feather name={icon} size={17} color={colors.mutedForeground} />}</View>
    <View style={styles.checkCopy}><Text style={[styles.checkLabel, { color: colors.foreground }]}>{label}</Text><Text style={[styles.checkDetail, { color: colors.mutedForeground }]}>{detail}</Text></View>
    <View style={[styles.checkBox, { borderColor: checked ? colors.primary : colors.border, backgroundColor: checked ? colors.primary : 'transparent' }]}>{checked && <Feather name="check" size={13} color={colors.primaryForeground} />}</View>
  </Pressable>;
}
export function Pill({ children, tone = 'sage' }: { children: ReactNode; tone?: 'sage' | 'peach' | 'gold' }) {
  const colors = useColors();
  const backgroundColor = tone === 'peach' ? colors.peach : tone === 'gold' ? colors.accent : colors.secondary;
  const color = tone === 'gold' ? colors.accentForeground : colors.forest;
  return <View style={[styles.pill, { backgroundColor }]}><Text style={[styles.pillText, { color }]}>{children}</Text></View>;
}
export function ProgressBar({ value, color }: { value: number; color?: string }) {
  const colors = useColors();
  const width = `${Math.min(1, Math.max(0, value)) * 100}%` as `${number}%`;
  return <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}><View style={[styles.progressFill, { width, backgroundColor: color ?? colors.primary }]} /></View>;
}
export function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const colors = useColors();
  return <View style={[styles.numberInput, { backgroundColor: colors.muted, borderColor: colors.border }]}>
    <TextInput accessibilityLabel="Steps completed" testID="steps-input" style={[styles.numberText, { color: colors.foreground }]} value={value ? String(value) : ''} placeholder="0" placeholderTextColor={colors.mutedForeground} keyboardType="number-pad" onChangeText={(text) => onChange(Number(text.replace(/\D/g, '')) || 0)} />
    <Text style={[styles.numberUnit, { color: colors.mutedForeground }]}>steps</Text>
  </View>;
}
export function LoadingState() {
  const colors = useColors();
  return <View style={styles.loading}><ActivityIndicator color={colors.primary} /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20 },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.8 },
  body: { fontSize: 14, lineHeight: 21 },
  card: { borderRadius: 22, borderWidth: 1, padding: 18 },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  checkIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  checkCopy: { flex: 1, marginLeft: 12 },
  checkLabel: { fontSize: 15, fontWeight: '600' },
  checkDetail: { fontSize: 12, marginTop: 3 },
  checkBox: { width: 23, height: 23, borderRadius: 8, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  pill: { borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6, alignSelf: 'flex-start' },
  pillText: { fontSize: 11, fontWeight: '700' },
  progressTrack: { height: 8, borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 8 },
  numberInput: { borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, height: 48 },
  numberText: { flex: 1, fontSize: 20, fontWeight: '700' },
  numberUnit: { fontSize: 12, fontWeight: '600' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});