class Translator {
    static escapeReg = /(?:(?<!\\)(?:\\\\)*)/;
    static ignoreReg = this.createRegExp(/\{\{(?!\{)/, /((?:.|\n)+?)/, /\}\}/);

    static boldReg = this.createRegExp(/\*\*(?!\*)/, /((?:.|\n)+?)/, /\*\*/);
    static italicReg = this.createRegExp(/\/\/(?!\/)/, /((?:.|\n)+?)/, /\/\//);
    static underReg = this.createRegExp(/__(?!_)/, /((?:.|\n)+?)/, /__/);
    static deleteReg = this.createRegExp(/~~(?!~)/, /((?:.|\n)+?)/, /~~/);
    static supReg = this.createRegExp(/\^\^(?!\^)/, /((?:.|\n)+?)/, /\^\^/);
    static subReg = this.createRegExp(/,,(?!,)/, /((?:.|\n)+?)/, /,,/);

    static hrReg = this.combineRegExps(/(?<=\n)/, this.createRegExp(/(----\n)/));

    static anchorReg = this.createRegExp(/\[\[(?!\[)/, /(.+?)/, /\]\]/);
    static noteReg = this.createRegExp(/\(\((?!\()/, /(.+?)/, /\)\)/);
    static splitReg = this.createRegExp(/\|/);

    static titleReg = this.combineRegExps(/(?<=\n)/, this.escapeReg, /(#{1,5})(.+)(?=\n)/);

    static uListReg = this.createRegExp(/:\(/, new RegExp(`(.(?:(?<!${this.escapeReg.source}:\\().|\n)*?)`), /\):/);
    static splitUListReg = new RegExp(`\n?${this.escapeReg.source}\\)\\(|${this.escapeReg.source}\\)\n?\\(`, 'g');
    static oListReg = this.createRegExp(/:{/, new RegExp(`(.(?:(?<!${this.escapeReg.source}:{).|\n)*?)`), /}:/);
    static splitOListReg = new RegExp(`\n?${this.escapeReg.source}}{|${this.escapeReg.source}}\n?{`, 'g');

    static tableReg = this.createRegExp(/:\[/, new RegExp(`(.(?:(?<!${this.escapeReg.source}:\\[).|\n)*?)`), /\]:/);
    static splitTrReg = new RegExp(`\n${this.escapeReg.source}\\]\\[|${this.escapeReg.source}\\]\n\\[`, 'g');
    static splitTdReg = this.createRegExp(/\]\[/);
    static tdReg = /^(?:([0-9]*)\[([0-9]*)\[)?((?:.|\n)+)$/g;

    // static imageReg = /./g;

    // {={indent}}
    // static indentReg = /(?<!\\)::/g;

    // {?{span}}
    // static spanReg = /./g;

    // static codeReg = /./g;
    // static quoteReg = /./g;

    // static mathReg = /./g;

    static combineRegExps(...regArr: RegExp[]): RegExp {
        return new RegExp(regArr.map(reg => reg.source).join(''), 'g');
    }

    static createRegExp(openReg: RegExp, captureReg?: RegExp, closeReg?: RegExp): RegExp {
        if (captureReg && closeReg) {
            return this.combineRegExps(this.escapeReg, openReg, captureReg, this.escapeReg, closeReg);
            // } else if (captureReg && !closeReg) {
            //     return new RegExp(this.escapeReg.source + openReg, 'g')
        } else {
            return this.combineRegExps(this.escapeReg, openReg);
        }
    }

    static toBold(content: string): string {
        return content.replaceAll(
            this.boldReg,
            (_match, content) => `<strong>${content.trim()}</strong>`
        );
    }

    static toItalic(content: string): string {
        return content.replaceAll(
            this.italicReg,
            (_match, content) => `<em>${content.trim()}</em>`
        );
    }

    static toUnder(content: string): string {
        return content.replaceAll(
            this.underReg,
            (_match, content) => `<u>${content.trim()}</u>`
        );
    }

    static toDelete(content: string): string {
        return content.replaceAll(
            this.deleteReg,
            (_match, content) => `<s>${content.trim()}</s>`
        );
    }

    static toSup(content: string): string {
        return content.replaceAll(
            this.supReg,
            (_match, content) => `<sup>${content.trim()}</sup>`
        );
    }

    static toSub(content: string): string {
        return content.replaceAll(
            this.subReg,
            (_match, content) => `<sub>${content.trim()}</sub>`
        );
    }

    static toHr(content: string): string {
        return content.replaceAll(this.hrReg, '<hr>');
    }

    static toAnchor(content: string): string {
        return content.replaceAll(
            this.anchorReg,
            (_match, captured) => {
                let [parsedTitle, parsedLink, parsedName] = this.parseAnchorAttributes(captured.split(this.splitReg)[0].trim(), captured.split(this.splitReg).slice(1).join('|').trim());

                return `<a title="${parsedTitle}" href="${parsedLink}">${parsedName}</a>`;
            }
        );
    }

    /**  Please override this method to parse the anchor as you want.
    * Returned Array will be used like this: `<a title="${returns[0]}" href="${returns[1]}">${returns[2]}</a>`; */
    static parseAnchorAttributes(link: string, name?: string): [string, string, string] {
        if (!name) name = link;
        return [link, link, name];
    }

    static toNote(content: string): string {
        const noteList: string[] = []; // [note1, note2, ...]
        const indexList: string[] = []; // [1, 2, text, 4, 5, ...]
        const indexCntMap = new Map<number, number>(); // { orderOfIndex1: cnt, orderOfIndex2: cnt, ...}
        let parsedContent = content.replaceAll(
            this.noteReg,
            (_match, captured) => {
                const note = captured.split(this.splitReg)[0].trim()
                const index = captured.split(this.splitReg).slice(1).join('|').trim()
                if (index === '') {
                    // only note
                    noteList.push(note);
                    const idx = noteList.length;
                    indexList.push(String(idx));
                    return `<sup><a id="n-${idx}" href="#f-${idx}">[${idx}]</a></sup>`;
                } else {
                    // index and note
                    let indexOrder = indexList.indexOf(index) + 1; // Index of "the index(name) of the footnote" of indexList.
                    if (indexOrder === 0) {
                        // new index
                        if (!isNaN(parseInt(index)))
                            throw new Error('The name of custom anchor cannot be numbers!');

                        indexList.push(index);
                        noteList.push(note);
                        indexOrder = indexList.length;
                        indexCntMap.set(indexOrder, 0);
                    }
                    const indexCnt = indexCntMap.get(indexOrder) as number + 1;
                    indexCntMap.set(indexOrder, indexCnt);
                    return `<sup><a id="n-${indexOrder}-${indexCnt}" href="#f-${indexOrder}-${indexCnt}">[${index}]</a></sup>`;
                }
            }
        );
        parsedContent = parsedContent.concat(
            this.addFootnote(indexList, indexCntMap, noteList)
        );
        return parsedContent;
    }

    static addFootnote(indexList: string[], indexCntMap: Map<number, number>, noteList: string[]): string {
        let content = '<hr id="content-footnote"><div id="footnote">';
        for (let i = 0; i < indexList.length; i++) {
            if (!isNaN(parseInt(indexList[i]))) {
                content = content.concat(
                    `<p><a id="f-${indexList[i]}" href="#n-${indexList[i]}">[${indexList[i]}]</a> ${noteList[i]}</p>`
                );
            } else {
                const footAnchor = this.makeFootAnchor(
                    i + 1,
                    indexCntMap.get(i + 1) as number
                );
                content = content.concat(
                    `<p>[${indexList[i]}]<sup>${footAnchor}</sup> ${noteList[i]}</p>`
                );
            }
        }
        content += '</div>';
        return content;
    }

    /**
     *
     * @param {number} indexOrder - The main number of order of the note
     * @param {number} indexCnt - The total count of the same indexes
     * @returns {string} HTML elements of the footnote
     */
    static makeFootAnchor(indexOrder: number, indexCnt: number): string {
        let footAnchor = '';
        for (let i = 1; i <= indexCnt; i++) {
            footAnchor = footAnchor.concat(
                ` <a id="f-${indexOrder}-${i}" href="#n-${indexOrder}-${i}">${indexOrder}.${i}</a>`
            );
        }
        return footAnchor;
    }

    static toTitle(content: string): string {
        let level = 0; // 1 ~ 5
        let indexArr: number[] = [0, 0, 0, 0, 0];
        const indexArrArr: number[][] = [];
        const titleArr: string[] = [];

        let parsedContent = content.replaceAll(
            this.titleReg,
            (_match, captured, title) => {
                if (captured.length <= level+1 && captured.length >= 1) {
                    title = title.trim();
                    level = captured.length;
                    indexArrArr.push([...this.updateIndexArr(indexArr, level)]);
                    titleArr.push(title)
                    return this.makeTitleHtml(indexArr, level, title);
                } else {
                    // The most common reason might be the below.
                    // The level of title cannot be increased more than one in a step.
                    throw new Error('Wrong level of title!');
                }
            }
        );

        parsedContent = this.addTitleIndex(indexArrArr, titleArr).concat(parsedContent);

        return parsedContent;
    }

    static updateIndexArr(indexArr: number[], level: number): number[] {
        indexArr[level-1] += 1;
        while(level <= 4) {
            level+=1;
            indexArr[level-1] = 0;
        }
        return indexArr;
    }

    static makeTitleHtml(indexArr: number[], level: number, content: string): string {
        const parsedIdx = this.parseIndexArr(indexArr);
        return `<h${level + 1} id="p-${parsedIdx.type2}"><a href="#index">${parsedIdx.type1
            }</a> ${content}</h${level + 1}>`;
    }

    // indexArr: [1, 3, 2, 0, 0]
    // type1: 1.3.2.
    // type2: 1-3-2
    // level: 3 (length of valid index)
    static parseIndexArr(indexArr: number[]): { type1: string, type2: string } {
        const parsedIndexArr = indexArr.filter(index => index !== 0);
        return {
            type1: parsedIndexArr.join('.').concat('.'),
            type2: parsedIndexArr.join('-'),
        };
    }

    static addTitleIndex(indexArr: number[][], titleArr: string[]): string {
        if (titleArr.length === 0) {
            // If there isn't any title
            return '<div id="index" style="display: none;"></div>';
        } else {
            let content = '<div id="index">';
            for (let i=0; i<titleArr.length; i++) {
                const parsedIdx = this.parseIndexArr(indexArr[i]);
                content = content.concat(
                    `<p><a href="#p-${parsedIdx.type2}">${parsedIdx.type1}</a> ${titleArr[i]}</p>`
                );
            }
            return content.concat('</div><hr id="index-content">');
        }
    }

    static toBlocks(content: string): string {
        while (true) {
            let uIndex = content.search(this.uListReg);
            let oIndex = content.search(this.oListReg);
            let tIndex = content.search(this.tableReg);

            if (uIndex === -1 && oIndex === -1 && tIndex === -1) {
                break;
            }

            uIndex = uIndex < 0 ? Infinity : uIndex;
            oIndex = oIndex < 0 ? Infinity : oIndex;
            tIndex = tIndex < 0 ? Infinity : tIndex;

            const MIN_INDEX = Math.min(uIndex, oIndex, tIndex);

            if (MIN_INDEX === uIndex) {
                content = this.toUList(content);
            } else if (MIN_INDEX === oIndex) {
                content = this.toOList(content);
            } else if (MIN_INDEX === tIndex) {
                content = this.toTable(content);
            } else {
                throw new Error('Something is wrong in block grammar!');
            }
        }
        return content;
    }

    static checkInside(mainReg: RegExp, splitReg: RegExp, content: string, translateFunction: (arr: string[]) => string) {
        return content.replaceAll(mainReg, (_match, capture) => {
            let lineArr: string[] = capture.trim().split(splitReg);
            lineArr = lineArr.map((line) => {
                return this.toBlocks(line.trim());
            });
            return translateFunction(lineArr);
        });
    }

    /**
     * Connect the items in the item list.
     * @param {string} type - The type of the list | 'ul' or 'ol'
     * @param {Array} liList - The list of items
     * @returns A HTML content of the list.
     */
    static concatListItems(type: string, liList: string[]): string {
        let listHTML = `<${type}><li>`;
        listHTML = listHTML.concat(liList.join('</li><li>'));
        listHTML = listHTML.concat(`</li></${type}>`);
        return listHTML;
    }

    static toUList(content: string): string {
        return this.checkInside(
            this.uListReg,
            this.splitUListReg,
            content,
            (liArr) => {
                return this.concatListItems('ul', liArr);
            }
        );
    }

    static toOList(content: string): string {
        return this.checkInside(
            this.oListReg,
            this.splitOListReg,
            content,
            (liArr) => {
                return this.concatListItems('ol', liArr);
            }
        );
    }

    static toTable(content: string): string {
        return this.checkInside(
            this.tableReg,
            this.splitTrReg,
            content,
            (trArr) => {
                let tableHTML = '<table><tbody><tr>';
                trArr = trArr.map((tr) => {
                    let tdArr = tr.split(this.splitTdReg);
                    tdArr = tdArr.map((td) => {
                        return td.replaceAll(
                            this.tdReg,
                            (_match, col, row, text) => {
                                col = !col ? 1 : col;
                                row = !row ? 1 : row;
                                text = this.toBlocks(text);
                                return `<td colspan="${col}" rowspan="${row}">${text}</td>`;
                            }
                        );
                    });
                    return tdArr.join('');
                });
                tableHTML = tableHTML.concat(trArr.join('</tr><tr>'));
                tableHTML = tableHTML.concat('</tr></tbody></table>');
                return tableHTML;
            }
        );
    }

    /*

    static toImage() {
        return new Promise(async (resolve, reject) => {
            let imageNameList = [];
            content.replaceAll(Translator.imageReg, (_match, imageName) => {
                imageNameList.push(Translator.getImageUrl(imageName));
                return _match;
            });
            let imageUrlList = await Promise.all(imageNameList);
            let parsedContent = content.replaceAll(
                Translator.imageReg,
                (_match, imageName, imageStyle) => {
                    return `<img class="docImg" src="${imageUrlList.shift()}" style="${imageStyle}" alt="X">`;
                }
            );
            content = parsedContent;
            resolve();
        });
    }

    static toCode() {
        return new Promise((resolve) => {
            let parsedContent = content.replaceAll(
                Translator.codeReg,
                '<code>$1</code>'
            );
            content = parsedContent;
            resolve();
        });
    }

    static toQuote() {
        return new Promise((resolve, reject) => {
            let parsedContent = content.replaceAll(
                Translator.quoteReg,
                (_match, level, content) => {
                    switch (level) {
                        case 1:
                            return `<blockquote class="smallBlockquote">${content}</blockquote>`;
                        case 2:
                            return `<blockquote class="">${content}</blockquote>`;
                        case 3:
                            return `<blockquote class="">${content}</blockquote>`;
                        default:
                            reject();
                            break;
                    }
                }
            );
            content = parsedContent;
            resolve();
        });
    }

    static toIndent(content: string): string {
        return content.replaceAll(this.indentReg, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }

    static toSpan() {
        return new Promise((resolve) => {
            let parsedContent = content.replaceAll(
                Translator.spanReg,
                '<span style="$1">$2</span>'
            );
            content = parsedContent;
            resolve();
        });
    }

    static toMath() {
        return new Promise((resolve, reject) => {
            let parsedContent = content.replaceAll(
                Translator.mathReg,
                (_match, letter, content) => {
                    if (letter === 'm') {
                        return `$|${content}|$`;
                    } else if (letter === 'M') {
                        return `$$|${content}|$$`;
                    } else {
                        reject();
                    }
                }
            );
            content = parsedContent;
            resolve();
        });
    }

    */

    static toIgnore(content: string): string {
        return content.replaceAll(
            this.ignoreReg,
            (_match, captured) => {
                return `{{${this.toEscape(captured)}}}`;
            }
        );
    }

    static toNormal(content: string): string {
        return content.replaceAll(
            this.ignoreReg,
            (_match, captured) => {
                return this.toUnescape(captured);
            }
        );
    }

    static brListReg = /(<\/ul>|<\/ol>|<\/table>)\n/g;

    /** To clear HTML content by removing unnecessary white spaces. */
    static toClear(content: string): string {
        content = content.replaceAll(this.brListReg, '$1');
    //     content = content.replaceAll(this.brListReg2, (matched, captured) => {
    //         console.log(matched, captured);
    //         return captured
    // });
        return content;
    }

    static brListReg2 = /\n(<\/div><h[2-6])/g;
    static toClearTitleLineBreaks(content: string): string {
        console.log(content);
        content = content.replaceAll(this.brListReg2, '$1');
        return content;
    }

    /** Remove \ before the special characters */
    static toUnescape(content: string): string {
        const reg = /\\(\\|\*|\/|~|_|-|\#|\[|\]|\(|\)|\{|\}|,|\^|\:|\|)/g;
        content = content.replaceAll(reg, '$1');
        return content;
    }

    /** Add \ in front of the special characters */
    static toEscape(content: string): string {
        const reg = /(\\|\*|\/|~|_|-|\#|\[|\]|\(|\)|\{|\}|,|\^|\:|\|)/g;
        content = content.replaceAll(reg, '\\$1');
        return content;
    }


    static paragraphReg =
        /(?<=(?:<\/h[2-6]>|<div.*?id="content".*?>))\n?((?:.|\n)*?\n?)(?=(?:<h[2-6].*?id=".+?".*?>|<\/div><hr.*?id="content-footnote".*?>))/g;

    /** Make paragraphs between all h elements. */
    static toParagraph(content: string): string {
        content = content.replaceAll(this.paragraphReg, '<div>$1</div>');

        return content;
    }

    static translate(content: string, allowHtml?: boolean, customGrammarFunc?: (arg1: string)=>string): string {
        try {
            if (!allowHtml) {
                content = content.replaceAll(/</g, '&lt;').replaceAll(/>/g, '&gt;');
            }

            content = '<div id="content">\n' + content + '\n</div>';

            content = this.toIgnore(content);

            content = this.toBold(content);
            content = this.toItalic(content);
            content = this.toDelete(content);
            content = this.toUnder(content);
            content = this.toSup(content);
            content = this.toSub(content);
            content = this.toHr(content);

            content = this.toAnchor(content);
            content = this.toNote(content);

            content = this.toTitle(content);
            content = this.toBlocks(content);

            // content = this.toImage(content);
            // content = this.toIndent(content);
            // content = this.toCode(content);
            // content = this.toQuote(content);

            // content = this.toSpan(content);
            // content = this.toMath(content);

            if (customGrammarFunc) {
                content = customGrammarFunc(content);
            }

            content = this.toNormal(content);

            content = this.toClear(content); // This should be done after from lists and table.
            content = this.toUnescape(content); // This should be the second from the last
            content = this.toParagraph(content); // This should be the last
            content = this.toClearTitleLineBreaks(content); // This should be after the paragraph

            // content = content.replace(/(?<=\n?)((?:.|\n)*)(?=\n?)/, '$1');

            content = content.replaceAll(/\n/g, '<br>');

            return content;
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new Error(e.message);
            } else {
                throw e;
            }
        }
    }
}

export default Translator;
