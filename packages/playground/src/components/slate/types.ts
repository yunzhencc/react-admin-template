import type { BaseEditor } from 'slate';
import type { HistoryEditor } from 'slate-history';
import type { ReactEditor } from 'slate-react';

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export interface ParagraphElement {
  type: 'paragraph';
  children: CustomElement[];
}

export interface HeadingElement {
  type: 'heading';
  level: number;
  children: CustomText[];
}

export interface TextElement {
  type?: 'text';
  text: string;
  bold?: boolean;
}

export interface PlaceholderElement {
  type: 'placeholder';
  placeholder: string;
  children: CustomText[];
}

export type CustomElement = ParagraphElement | HeadingElement | PlaceholderElement | TextElement;

export interface FormattedText { text: string; bold?: true }

export type CustomText = FormattedText;
