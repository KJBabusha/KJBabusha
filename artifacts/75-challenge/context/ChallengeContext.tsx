import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type MealChoice = 0 | 1;
type DailyMealChoices = { breakfast: MealChoice; snack: MealChoice; dinner: MealChoice };
type MealPlan = { breakfasts: string[]; snacks: string[]; dinners: string[]; schedule: DailyMealChoices[] };
type Phase = { id: number; name: string; subtitle: string; steps: number; workouts: number; foodRule: string; meals: MealPlan };
type DayLog = { steps: number; workout: boolean; meals: { breakfast: boolean; snack: boolean; dinner: boolean }; completed: boolean };
type ChallengeState = { startDate: string; phases: Phase[]; logs: Record<string, DayLog> };

type ChallengeContextValue = {
  state: ChallengeState;
  hydrated: boolean;
  currentDay: number;
  currentPhase: Phase;
  todayMeals: { breakfast: string; snack: string; dinner: string };
  todayLog: DayLog;
  updateMeal: (phaseId: number, field: 'breakfast0' | 'breakfast1' | 'snack0' | 'snack1' | 'dinner0' | 'dinner1', value: string) => void;
  updateMealChoice: (phaseId: number, dayIndex: number, meal: keyof DailyMealChoices, choice: MealChoice) => void;
  setSteps: (steps: number) => void;
  toggleWorkout: () => void;
  toggleMeal: (meal: keyof DayLog['meals']) => void;
  resetChallenge: () => void;
};

const STORAGE_KEY = '@75-challenge/state-v1';
const makeSchedule = (): DailyMealChoices[] => Array.from({ length: 25 }, (_, index) => ({ breakfast: (index % 2) as MealChoice, snack: (index % 2) as MealChoice, dinner: (index % 2) as MealChoice }));
const defaultPhases: Phase[] = [
  { id: 1, name: 'Foundation', subtitle: 'Build the rhythm', steps: 10000, workouts: 2, foodRule: 'Keep it simple and consistent', meals: { breakfasts: ['Greek yogurt, berries + granola', 'Eggs, avocado + fruit'], snacks: ['Chia pudding', 'Coconut chia pudding'], dinners: ['Lemon herb chicken bowl', 'Salmon, greens + roasted potatoes'], schedule: makeSchedule() } },
  { id: 2, name: 'Momentum', subtitle: 'Raise the energy', steps: 12000, workouts: 3, foodRule: 'Your next set of meals', meals: { breakfasts: ['Add phase 2 breakfast one', 'Add phase 2 breakfast two'], snacks: ['Add phase 2 pudding one', 'Add phase 2 pudding two'], dinners: ['Add phase 2 dinner one', 'Add phase 2 dinner two'], schedule: makeSchedule() } },
  { id: 3, name: 'Strong finish', subtitle: 'Finish with intention', steps: 15000, workouts: 3, foodRule: 'No wheat, processed carbs or added sugar', meals: { breakfasts: ['Add phase 3 breakfast one', 'Add phase 3 breakfast two'], snacks: ['Add phase 3 pudding one', 'Add phase 3 pudding two'], dinners: ['Add phase 3 dinner one', 'Add phase 3 dinner two'], schedule: makeSchedule() } },
];

const blankLog = (): DayLog => ({ steps: 0, workout: false, meals: { breakfast: false, snack: false, dinner: false }, completed: false });
const dayKey = (day: number) => String(day);

const ChallengeContext = createContext<ChallengeContextValue | null>(null);

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChallengeState>({ startDate: new Date().toISOString(), phases: defaultPhases, logs: {} });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        try {
          const saved = JSON.parse(stored) as {
            startDate?: string;
            phases?: Array<Omit<Phase, 'meals'> & { meals: Partial<MealPlan> & { breakfast?: string; snack?: string } }>;
            logs?: Record<string, DayLog>;
          };
          const phases = (saved.phases ?? defaultPhases).map((phase, index) => ({
            ...(defaultPhases[index] ?? defaultPhases[0]),
            ...phase,
            meals: {
              ...(defaultPhases[index] ?? defaultPhases[0]).meals,
              ...phase.meals,
              breakfasts: (phase.meals as Partial<MealPlan> & { breakfast?: string }).breakfasts ?? [(phase.meals as { breakfast?: string }).breakfast ?? '', (phase.meals as { breakfast?: string }).breakfast ?? ''],
              snacks: (phase.meals as Partial<MealPlan> & { snack?: string }).snacks ?? [(phase.meals as { snack?: string }).snack ?? '', (phase.meals as { snack?: string }).snack ?? ''],
              dinners: (phase.meals as Partial<MealPlan>).dinners ?? ['', ''],
              schedule: (phase.meals as Partial<MealPlan>).schedule ?? makeSchedule(),
            },
          }));
          setState({ startDate: saved.startDate ?? new Date().toISOString(), phases, logs: saved.logs ?? {} });
        } catch {
          // Defaults keep the app usable if local data is unreadable.
        }
      }
      setHydrated(true);
    }).catch(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [hydrated, state]);

  const currentDay = useMemo(() => {
    const start = new Date(state.startDate);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return Math.min(75, Math.max(1, Math.floor((today.getTime() - start.getTime()) / 86400000) + 1));
  }, [state.startDate]);
  const phaseIndex = currentDay <= 25 ? 0 : currentDay <= 50 ? 1 : 2;
  const currentPhase = state.phases[phaseIndex] ?? defaultPhases[0];
  const phaseDayIndex = currentDay <= 25 ? currentDay - 1 : currentDay <= 50 ? currentDay - 26 : currentDay - 51;
  const mealChoices = currentPhase.meals.schedule[phaseDayIndex] ?? { breakfast: 0, snack: 0, dinner: 0 };
  const todayMeals = {
    breakfast: currentPhase.meals.breakfasts[mealChoices.breakfast] ?? '',
    snack: currentPhase.meals.snacks[mealChoices.snack] ?? '',
    dinner: currentPhase.meals.dinners[mealChoices.dinner] ?? '',
  };
  const todayLog = state.logs[dayKey(currentDay)] ?? blankLog();

  const updateLog = useCallback((change: (log: DayLog) => DayLog) => {
    setState((previous) => {
      const existing = previous.logs[dayKey(currentDay)] ?? blankLog();
      return { ...previous, logs: { ...previous.logs, [dayKey(currentDay)]: change(existing) } };
    });
  }, [currentDay]);

  const setSteps = useCallback((steps: number) => updateLog((log) => ({ ...log, steps: Math.max(0, Math.min(99999, Math.round(steps))) })), [updateLog]);
  const toggleWorkout = useCallback(() => updateLog((log) => ({ ...log, workout: !log.workout })), [updateLog]);
  const toggleMeal = useCallback((meal: keyof DayLog['meals']) => updateLog((log) => ({ ...log, meals: { ...log.meals, [meal]: !log.meals[meal] } })), [updateLog]);
  const updateMeal = useCallback((phaseId: number, field: 'breakfast0' | 'breakfast1' | 'snack0' | 'snack1' | 'dinner0' | 'dinner1', value: string) => {
    setState((previous) => ({
      ...previous,
      phases: previous.phases.map((phase) => {
        if (phase.id !== phaseId) return phase;
        const meals = field === 'dinner0'
          ? { ...phase.meals, dinners: [value, phase.meals.dinners[1]] }
          : field === 'dinner1'
            ? { ...phase.meals, dinners: [phase.meals.dinners[0], value] }
            : field === 'breakfast0'
              ? { ...phase.meals, breakfasts: [value, phase.meals.breakfasts[1]] }
              : field === 'breakfast1'
                ? { ...phase.meals, breakfasts: [phase.meals.breakfasts[0], value] }
                : field === 'snack0'
                  ? { ...phase.meals, snacks: [value, phase.meals.snacks[1]] }
                  : { ...phase.meals, snacks: [phase.meals.snacks[0], value] };
        return { ...phase, meals };
      }),
    }));
  }, []);
  const updateMealChoice = useCallback((phaseId: number, dayIndex: number, meal: keyof DailyMealChoices, choice: MealChoice) => {
    setState((previous) => ({
      ...previous,
      phases: previous.phases.map((phase) => {
        if (phase.id !== phaseId) return phase;
        const schedule = phase.meals.schedule.map((day, index) => index === dayIndex ? { ...day, [meal]: choice } : day);
        return { ...phase, meals: { ...phase.meals, schedule } };
      }),
    }));
  }, []);
  const resetChallenge = useCallback(() => setState({ startDate: new Date().toISOString(), phases: defaultPhases, logs: {} }), []);

  const value = useMemo(() => ({ state, hydrated, currentDay, currentPhase, todayMeals, todayLog, updateMeal, updateMealChoice, setSteps, toggleWorkout, toggleMeal, resetChallenge }), [state, hydrated, currentDay, currentPhase, todayMeals, todayLog, updateMeal, updateMealChoice, setSteps, toggleWorkout, toggleMeal, resetChallenge]);
  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>;
}

export function useChallenge() {
  const context = useContext(ChallengeContext);
  if (!context) throw new Error('useChallenge must be used within ChallengeProvider');
  return context;
}