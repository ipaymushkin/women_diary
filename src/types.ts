/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DailyCheck {
  headache: 'yes' | 'no';
  menstrual: 'yes' | 'no';
  comment: string;
}

export interface EmotionsDay {
  positive: string[];
  negative: string[];
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface LiedRecord {
  lied: 'yes' | 'no';
  detail: string;
}

export interface SelfHelpExercise {
  id: string;
  title: string;
  hint: string;
  actionText?: string;
}
