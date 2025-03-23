import { expect, test } from 'vitest'
import Translator from '../src/index';

test('\\n----\\n', () => {
    expect(Translator.toHr('\n----\n')).toBe('\n<hr>');
});

test('----\\n', () => {
    expect(Translator.toHr('----\n')).toBe('----\n');
});

test('\\n----', () => {
    expect(Translator.toHr('\n----')).toBe('\n----');
});

test('----', () => {
    expect(Translator.toHr('----')).toBe('----');
});

test('\\n-----\\n', () => {
    expect(Translator.toHr('\n-----\n')).toBe('\n-----\n');
});