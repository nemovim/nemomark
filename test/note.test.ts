import { expect, test } from 'vitest'
import Translator from '../src/index';

test('((abc))', () => {
    expect(Translator.toNote('((abc))')).toBe('<sup><a id="n-1" href="#f-1">[1]</a></sup><hr id="content-footnote"><div id="footnote"><p><a id="f-1" href="#n-1">[1]</a> abc</p></div>');
});

test('((abc|def))', () => {
    expect(Translator.toNote('((abc|def))')).toBe('<sup><a id="n-1-1" href="#f-1-1">[def]</a></sup><hr id="content-footnote"><div id="footnote"><p>[def]<sup> <a id="f-1-1" href="#n-1-1">1.1</a></sup> abc</p></div>');
});

// test('\\((abc))', () => {
//     expect(Translator.toNote('\\((abc))')).toBe('\\((abc))');
// });

// test('((abc\\))', () => {
//     expect(Translator.toNote('((abc\\))')).toBe('((abc\\))');
// });

// test('((abc\\|def))', () => {
//     expect(Translator.toNote('((abc\\|def))')).toBe('<a title="abc\\|def" href="abc\\|def">abc\\|def</a>');
// });

// test('((\\[abc\\))]', () => {
//     expect(Translator.toNote('((\\[abc\\))]')).toBe('<a title="\\[abc\\]" href="\\[abc\\]">\\[abc\\]</a>');
// });

// test('\\(([abc))\\]', () => {
//     expect(Translator.toNote('\\(([abc))\\]')).toBe('\\[<a title="abc" href="abc">abc</a>\\]');
// });

// test('((ab\\|cd|ef))', () => {
//     expect(Translator.toNote('((ab\\|cd|ef))')).toBe('<a title="ab\\|cd" href="ab\\|cd">ef</a>');
// });

// test('((ab|cd\\|ef))', () => {
//     expect(Translator.toNote('((ab|cd\\|ef))')).toBe('<a title="ab" href="ab">cd\\|ef</a>');
// });

// //----------------- Optional Behavior

// test('((((abc))))', () => {
//     expect(Translator.toNote('((((abc))))')).toBe('((<a title="abc" href="abc">abc</a>))');
// });

// test('((ab|cd|ef))', () => {
//     expect(Translator.toNote('((ab|cd|ef))')).toBe('<a title="ab" href="ab">cd|ef</a>');
// });

