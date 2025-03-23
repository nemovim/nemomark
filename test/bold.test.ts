import { expect, test } from 'vitest'
import Translator from '../src/index';

test('**abc**', () => {
    expect(Translator.toBold('**abc**')).toBe('<strong>abc</strong>');
});

test('\\**abc**', () => {
    expect(Translator.toBold('\\**abc**')).toBe('\\**abc**');
});

test('**abc\\**', () => {
    expect(Translator.toBold('**abc\\**')).toBe('**abc\\**');
});

test('\\***abc**\\*', () => {
    expect(Translator.toBold('\\***abc**\\*')).toBe('\\*<strong>abc</strong>\\*');
});

test('**\\*abc\\***', () => {
    expect(Translator.toBold('**\\*abc\\***')).toBe('<strong>\\*abc\\*</strong>');
});

// ---------------- Optional

test('***abc***', () => {
    expect(Translator.toBold('***abc***')).toBe('*<strong>abc</strong>*');
});