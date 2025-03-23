import { expect, test } from 'vitest'
import Translator from '../src/index';

test('[[abc]]', () => {
    expect(Translator.toAnchor('[[abc]]')).toBe('<a title="abc" href="abc">abc</a>');
});

test('[[ab\\ncd]]', () => {
    expect(Translator.toAnchor('[[ab\ncd]]')).toBe('[[ab\ncd]]');
});


test('[[abc|def]]', () => {
    expect(Translator.toAnchor('[[abc|def]]')).toBe('<a title="abc" href="abc">def</a>');
});

test('\\[[abc]]', () => {
    expect(Translator.toAnchor('\\[[abc]]')).toBe('\\[[abc]]');
});

test('[[abc\\]]', () => {
    expect(Translator.toAnchor('[[abc\\]]')).toBe('[[abc\\]]');
});

test('[[abc\\|def]]', () => {
    expect(Translator.toAnchor('[[abc\\|def]]')).toBe('<a title="abc\\|def" href="abc\\|def">abc\\|def</a>');
});

test('[[\\[abc\\]]]', () => {
    expect(Translator.toAnchor('[[\\[abc\\]]]')).toBe('<a title="\\[abc\\]" href="\\[abc\\]">\\[abc\\]</a>');
});

test('\\[[[abc]]\\]', () => {
    expect(Translator.toAnchor('\\[[[abc]]\\]')).toBe('\\[<a title="abc" href="abc">abc</a>\\]');
});

test('[[ab\\|cd|ef]]', () => {
    expect(Translator.toAnchor('[[ab\\|cd|ef]]')).toBe('<a title="ab\\|cd" href="ab\\|cd">ef</a>');
});

test('[[ab|cd\\|ef]]', () => {
    expect(Translator.toAnchor('[[ab|cd\\|ef]]')).toBe('<a title="ab" href="ab">cd\\|ef</a>');
});

//----------------- Optional Behavior

test('[[[[abc]]]]', () => {
    expect(Translator.toAnchor('[[[[abc]]]]')).toBe('[[<a title="abc" href="abc">abc</a>]]');
});

test('[[ab|cd|ef]]', () => {
    expect(Translator.toAnchor('[[ab|cd|ef]]')).toBe('<a title="ab" href="ab">cd|ef</a>');
});

