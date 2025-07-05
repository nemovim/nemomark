# Nemomark

**Nemomark** is a lightweight, general-purpose markup language designed to work anywhere.

[Here](https://nemomark.vercel.app) is a demo website of the Nemomark (in Korean).

## Usage 

1. Install the module 

    ```bash
    $ npm i nemomark
    ```

1. Import the module 

    ```js
    import Translator from 'nemomark'
    ```

    *You can import it with a different name (i.e. instead of Translator) if you want.*

1. Translate the text

    ```js
    translatedText = Translator.translate(originalText);
    ```

## Features

* It converts text into HTML elements.
* It supports enough grammar to write basic articles.
* It makes an index table and footnotes automatically.
* Anyone can design it since it returns raw HTML code.

## Grammar

* \*\*bold**
* //italic//
* \~~delete~~
* \_\_under__
* ^^sup^^
* ,,sub,,

* \[\[link]]

    You can show different text to the text of the link by using `|`;

    ```
    ex) [[link|name]]
    -> name // The href will be the link
    ```

    *If you want to add some rules to the link text, you can override the `parseAnchorAttributes` method of the class.*

* \(\(note))

    You can set the index of notes as text by using `|`.
    Footnote will be added at the end of the content.

    ```
    ex) ((note|index))
    -> [index] // The content will be the note
    ```

* \# title

    Title grammar has five levels which can be changed by the count of `#`.

    ```
    ex)
    # title 1.
    ## title 1.1.
    ## title 1.2.
    # title 2.
    ```

* :\[table]:

    Table grammar starts with `:[` and ends with `]:`.

    To divide columns, insert `][` between the line.

    To divide rows, insert `\n][` or `]\n[` into the end of the line that you want to break.

    ```
    ex)
    :[cell(0,0)][cell(0,1)
    ][cell(1,0)][cell(1,1)]
    [cell(2,0)][cell(2,1)]:
    ```

* :(unordered list):

    Unordered list grammar starts with `:(` and ends with `):`.

    To divide items, use `)(`, `\n)(`, or `)\n(`. You can use any of these, even mixed.

    ```
    ex)
    :(item1
    )(item2)
    (item3)(item4):
    ```

* :{ordered list}:

    The difference between ordered and unordered is only the change from `(` to `{`.

    ```
    ex)
    :{item1
    }{item2}
    {item3}{item4}:
    ```

* ---- horizontal rule

    Four `-` are converted into a horizontal rule, which can be used to separate sections or contents.

    ```
    ex)
    ----
    ```
    *There should be a line break (\n) before this grammar.*

* \ escape character

    Put a `\` character in front of the character that you want to escape.

    1. If you want to ignore the grammar,
    1. OR you want to write grammar-like content in the grammar,

    Escape one of the characters which comprise the grammar.

    ```
    ex) To make bold the text: "* is an asterisk"
    *** is an asterisk** // Wrong
    ** * is an asterisk ** // Wrong (It would work, but not recommended.)
    **\* is an asterisk** // Correct

    ex) To show the content as it is: "**a** makes bold the letter a."
    \**a** makes bold the letter a. // Correct
    \*\*a** makes bold the letter a. // Correct
    **a\** makes bold the letter a. // Correct
    ```

    No matter what you escape, just make the grammar **UNCOMPLITED**.

* {{Ignoring}}

    Similar to the escape character, it ignores(=escape) all grammars(=characters) in this grammar.

    ```
    ex) {{Ignore this link grammar: [[link]].}}
    // The link grammar won't be applied.
    // Of course, the parentheses will be removed.

## Further plans

* Images
* Font-size
* Text-align
* Text-color
* Indent
* Quotes
* Code
* Math(equations)