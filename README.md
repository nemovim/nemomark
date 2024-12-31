# ken-markup

Ken-Markup is a markup language made for family websites of ken-zone.

[Here](https://ken-markup.vercel.app) is a demo website of ken-markup (in Korean).

## Usage 

1. Install the module 

    ```bash
    $ npm i ken-markup
    ```

1. Import the module 

    ```js
    import Translator from 'ken-markup'
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
* \//italic//
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

    *If you want to add some rules to the link text, you can override the `parseAnchorLink` method of the class.*

* \(\(note))

    You can set the index of notes as texts by using `|`.

    ```
    ex) ((index|note))
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

* :[table]:

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

* \ ignoring grammar

    Put a `\` character in front of the grammar that you want to ignore.

    If you want to use **the same character** with the grammar at the front or end of the text, you must put `a space` between them to distinguish.

    ```
    ex) To make bold the text: "* is an asterisk"
    *** is an asterisk** // Wrong
    ** * is an asterisk** // Correct

    ex) To make bold the text: "** is a bold grammar"
    **** is a bold grammar** // Wrong
    ** ** is a bold grammar** // Wrong
    **\** is a bold grammar** // Correct
    ** \** is a bold grammar** // Correct
    ```

## Further plans

* Images
* Font-size
* Text-align
* Text-color
* Indent
* Quotes
* Code
* Math(equations)