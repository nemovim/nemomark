# ken-markup

ken-markup is a markup language made for family websites of ken-system.

## Instruction 

1. Install the module 

    ```bash
    $ npm i ken-markup
    ```

2. Import the module 

    ```js
    import Translator from 'ken-markup'
    ```

    *You can import it with a different name (i.e. instead of Translator) if you want.*

3. Translate the text

    ```js
    translatedText = Translator.translate(originalText);
    ```

## Features

* It converts text into HTML elements.
* It supports enough grammar to write basic articles.
* It makes an index-table and footnotes automatically.
* Anyone can design it since it returns raw HTML code.

## Grammar

* \*\*bold**
* \//italic//
* \~~delete~~
* \_\_under__
* ^^sup^^
* ,,sub,,
* \[\[link]]

    You can show different text to the text of the link by using `|`;

    ```
    ex) [[name|link]]
    -> name // The href be the link
    ```

    *If you want to add some rules to the link text, you can override `parseAnchorLink` method of the class.*

* \(\(note))

    You can set the index of notes as texts by using `|`.

    ```
    ex) ((index|note))
    -> [index] // The content be the note
    ```

* = title

    Title grammar has five levels which can be changed by a count of `=`.

    ```
    ex)
    = title 1.
    == title 1.1.
    == title 1.2.
    = title 2.
    ```
