class Translator {
    static boldReg = /(?<!\\)\*\*(?:((?:.|\n)+?))\*\*/g;
    static italicReg = /(?<!\\)\/\/(?:((?:.|\n)+?))\/\//g;
    static underReg = /(?<!\\)__(?:((?:.|\n)+?))__/g;
    static deleteReg = /(?<!\\)~~(?:((?:.|\n)+?))~~/g;
    static supReg = /(?<!\\)\^\^(?:((?:.|\n)+?))\^\^/g;
    static subReg = /(?<!\\),,(?:((?:.|\n)+?)),,/g;
    static indentReg = /(?<!\\)::/g;
    static hrReg = /(?<=\n)(?<!\\)(----\n)/g;
    static anchorReg = /(?<!\\)\[\[(?:(?:([^|]+?))|(?:(.+?)(?<!\\)\|(.+?)))]]/g;
    static noteReg = /(?<!\\)\(\((?:(?:([^|]+?))|(?:(.+?)(?<!\\)\|(.*?)))\)\)/g;
    static titleReg = /(?<=\n)(?<!\\)(={1,5}) (.+)(?=\n)/g;
    static paragraphReg =
        /(?<=(?:<\/h[2-6]>|<div.*?id="content".*?>))\n?((?:.|\n)*?\n?)(?=(?:<h[2-6].*?id=".+?".*?>|<\/div><hr.*?id="content-footnote".*?>))/g;

    // static spanReg = /./g;
    // static codeReg = /./g;
    // static quoteReg = /./g;
    // static mathReg = /./g;
    // static searchUListReg = /./g;
    // static uListReg = /./g;
    // static splitUListReg = /./g;
    // static searchOListReg = /./g;
    // static oListReg = /./g;
    // static splitOListReg = /./g;
    // static searchTableReg = /./g;
    // static tableReg = /./g;
    // static splitTrReg = /./g;
    // static splitTdReg = /./g;
    // static tdReg = /./g;
    // static imageReg = /./g;
    // static highClassReg = /./g;
    // static frameReg = /./g;

    static toBold(content) {
        return content.replaceAll(this.boldReg, '<strong>$1</strong>');
    }

    static toItalic(content) {
        return content.replaceAll(this.italicReg, '<em>$1</em>');
    }

    static toUnder(content) {
        return content.replaceAll(this.underReg, '<u>$1</u>');
    }

    static toDelete(content) {
        return content.replaceAll(this.deleteReg, '<s>$1</s>');
    }

    static toSup(content) {
        return content.replaceAll(this.supReg, '<sup>$1</sup>');
    }

    static toSub(content) {
        return content.replaceAll(this.subReg, '<sub>$1</sub>');
    }

    static toIndent(content) {
        return content.replaceAll(this.indentReg, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }

    static toHr(content) {
        return content.replaceAll(this.hrReg, '<hr>');
    }

    static toAnchor(content) {
        return content.replaceAll(
            this.anchorReg,
            (_match, linkName, name, link) => {
                if (linkName !== undefined) {
                    //only link
                    let parsedLinkName = this.parseAnchorLink(linkName);
                    return `<a title="${parsedLinkName}" href="${parsedLinkName}">${linkName}</a>`;
                } else {
                    // name | link
                    link = this.parseAnchorLink(link);
                    return `<a title="${link}" href="${link}">${name}</a>`;
                }
            }
        );
    }

    /**
     * Please override this method to parse the link as you want.
     * @param {string} link - original link
     * @returns {string} parsed link
     */
    static parseAnchorLink(link) {
        return link;
    }

    static toNote(content) {
        let noteList = []; // [note1, note2, ...]
        let indexList = []; // [1, 2, text, 4, 5, ...]
        let indexMap = new Map(); // { orderOfIndex1: cnt, orderOfIndex2: cnt, ...}
        let parsedContent = content.replaceAll(
            this.noteReg,
            (_match, noteAndIndex, index, note) => {
                if (noteAndIndex !== undefined) {
                    // only note
                    noteList.push(noteAndIndex);
                    indexList.push(noteList.length);
                    const idx = noteList.length;
                    return `<sup><a href="#f-${idx}" id="n-${idx}">[${idx}]</a></sup>`;
                } else {
                    // index and note
                    let indexOrder = indexList.indexOf(index) + 1; // Index of 'the index(name) of the footnote" of indexList.
                    if (indexOrder === 0) {
                        // new index
                        if (isNaN(parseInt(index))) {
                            indexList.push(index);
                            noteList.push(note);
                            indexOrder = indexList.length;
                            indexMap.set(indexOrder, 0);
                        } else {
                            throw new Error(
                                'Name of custom anchor cannot be numbers!'
                            );
                        }
                    } else {
                        // not new index
                    }
                    const indexCnt = indexMap.get(indexOrder) + 1;
                    indexMap.set(indexOrder, indexCnt);
                    return `<sup><a href="#f-${indexOrder}-${indexCnt}" id="n-${indexOrder}.${indexCnt}">[${index}]</a></sup>`;
                }
            }
        );
        parsedContent = parsedContent.concat(
            this.addFootnote(indexList, indexMap, noteList)
        );
        return parsedContent;
    }

    static addFootnote(indexList, indexMap, noteList) {
        let content = '<hr id="content-footnote"><div id="footnote">';
        for (let i = 0; i < indexList.length; i++) {
            if (typeof indexList[i] === 'number') {
                content = content.concat(
                    `<p><a id="f-${indexList[i]}" href="#n-${indexList[i]}">[${indexList[i]}]</a> ${noteList[i]}</p>`
                );
            } else {
                const footAnchor = this.makeFootAnchor(
                    i + 1,
                    indexMap.get(i + 1)
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
    static makeFootAnchor(indexOrder, indexCnt) {
        let footAnchor = '';
        for (let i = 1; i <= indexCnt; i++) {
            footAnchor = footAnchor.concat(
                ` <a id="f-${indexOrder}-${i}" href="#n-${indexOrder}-${i}">${indexOrder}.${i}</a>`
            );
        }
        return footAnchor;
    }

    static toTitle(content) {
        let titleLevel = 1; // 1 ~ 5
        let titleMap = new Map(); // { titleIndex: title } | ex) {10000: 'a', 11000: 'b', ... }
        let titleIndex = 0;
        let parsedContent = content.replaceAll(
            this.titleReg,
            (_match, capture, content) => {
                if (capture.length <= titleLevel + 1 && capture.length >= 1) {
                    titleLevel = capture.length;
                    titleIndex = this.changeTitleIndex(titleIndex, titleLevel);
                    titleMap.set(titleIndex, content);
                    return this.makeTitle(titleIndex, titleLevel, content);
                } else {
                    // The most common reason might be the below.
                    // The level of title cannot be increased more than one in a step.
                    throw new Error('Wrong level of title!');
                }
            }
        );
        parsedContent = this.addTitleIndex(titleMap).concat(parsedContent);
        return parsedContent;
    }

    static changeTitleIndex(index, level) {
        const weight = 10 ** (5 - level);
        return (Math.floor(index / weight) + 1) * weight;
    }

    static makeTitle(index, level, content) {
        const idx = this.convertIndex(index);
        return `<h${level + 1} id="p-${idx.type2}"><a href="#index">${
            idx.type1
        }</a> ${content}</h${level + 1}>`;
    }

    /**
     * Return two types of index
     * @param {number} index - index number | ex) 12300
     * @returns {{type1: string, type2: string, level: number}} ex) type1: 1.2.3. | type2: 1-2-3
     */
    static convertIndex(index) {
        let level = 0;
        const indexArray = [];
        let indexOfLevel;
        while (level < 5) {
            indexOfLevel = String(index)[level];
            if (indexOfLevel !== '0') {
                indexArray.push(indexOfLevel);
            } else {
                break;
            }
            level += 1;
        }
        return {
            type1: indexArray.join('.').concat('.'),
            type2: indexArray.join('-'),
            level: level,
        };
    }

    static addTitleIndex(titleMap) {
        if (titleMap.size === 0) {
            // If there isn't any title
            return '<div id="index" style="display: none;"></div>';
        } else {
            let content = '<div id="index">';
            for (let [index, title] of titleMap) {
                const idx = this.convertIndex(index);
                content = content.concat(
                    `<p><a href="#p-${idx.type2}">${idx.type1}</a> ${title}</p>`
                );
            }
            return content.concat('</div><hr id="index-content">');
        }
    }

    /*
    static checkInsideLoop(searchReg, reg, content, TranslatorFunction) {
        return new Promise((resolve, reject) => {
            while (true) {
                if (content.search(searchReg) !== -1) {
                    // There is something to change.
                    let parsedContent = content.replaceAll(
                        reg,
                        function (_match, capture) {
                            if (capture.search(searchReg) !== -1) {
                                // It isn't what Translator most inside.
                                return _match;
                            } else {
                                // It must be changed.
                                return TranslatorFunction(capture);
                            }
                        }
                    );
                    if (parsedContent === content) {
                        // It can't happen.
                        // Translator Error!
                        alert(
                            'You mistaked the wiki Translator!! Try again after checking it.'
                        );
                        reject();
                    } else {
                        resolve(parsedContent);
                    }
                } else {
                    // There are no more things to change.
                    resolve(content);
                }
            }
        });
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


    static toUList() {
        return Promise((resolve) => {
            Translator.checkInsideLoop(
                Translator.searchUListReg,
                Translator.uListReg,
                content,
                (capture) => {
                    let uList = capture.split(Translator.splitUListReg);
                    let content = '<ul>';
                    for (let text of uList) {
                        content = content.concat(`<li>${text}</li>`);
                    }
                    content = content.concat('</ul>');
                    return content;
                }
            ).then((content) => {
                content = content;
                resolve();
            });
        });
    }

    static toOList() {
        return Promise((resolve) => {
            Translator.checkInsideLoop(
                Translator.searchOListReg,
                Translator.oListReg,
                content,
                (capture) => {
                    let oList = capture.split(Translator.splitOListReg);
                    let content = '<ol>';
                    for (let text of oList) {
                        content = content.concat(`<li>${text}</li>`);
                    }
                    content = content.concat('</ol>');
                    return content;
                }
            ).then((content) => {
                content = content;
                resolve();
            });
        });
    }

    static toTable() {
        return Promise((resolve) => {
            Translator.checkInsideLoop(
                Translator.searchTableReg,
                Translator.tableReg,
                content,
                (capture) => {
                    let trList = capture.split(Translator.splitTrReg);
                    let content = '<table><tbody>';
                    for (let tr of trList) {
                        content = content.concat('<tr>');
                        let tdList = tr.split(Translator.splitTdReg);
                        for (let td of tdList) {
                            content = content.concat(
                                td.replaceAll(
                                    Translator.tdReg,
                                    (_match, col, row, text) => {
                                        col ??= 1;
                                        row ??= 1;
                                        return `<td colspan="${col}" rowspan="${row}">${text}</td>`;
                                    }
                                )
                            );
                        }
                    }
                    content = content.concat('</tbody></table>');
                    return content;
                }
            ).then((content) => {
                content = content;
                resolve();
            });
        });
    }

    // /^(?:([^\]]+)\|)?(?:([0-9]*)\]([0-9]*)\])?((?:.|\n)+)/g, to use for table

    // static getImageUrl(name) {
    //     return new Promise((resolve, reject) => {
    //         Translator.firebase
    //             .fstorage()
    //             .child('image/' + name)
    //             .getDownloadURL()
    //             .then((url) => resolve)
    //             .catch((error) => reject);
    //         // width 최소 20rem click시 해당 이미지 문서로 이동.
    //     });
    // }

    static toHighClass() {
        return new Promise((resolve, reject) => {
            let highClassList = [];
            let parsedContent = content.replaceAll(
                Translator.highClassReg,
                (_match, capture) => {
                    highClassList.push(capture);
                    return '';
                }
            );
            parsedContent =
                Translator.makeHighClassContent(highClassList).concat(parsedContent);
            content = parsedContent;
            resolve();
        });
    }

    static makeHighClassContent(highClassList) {
        let content = '<div>분류:&nbsp;';
        for (let highClass of highClassList) {
            content = content.concat(
                `<a href="w/분류:${highClass} title="분류:${highClass}>${highClass}</a>`
            );
        }
        content = content.concat('</div><hr>');
        return content;
    }

    static toFrame() {
        return new Promise((resolve, reject) => {
            // TODO: to frame.
        });
    }

    */

    /** Remove \\ before the grammars at the last */
    static toNormal(content) {
        const boldReg = /\\(\*\*(?:.|\n)+?\*\*)/g;
        const italicReg = /\\(\/\/(?:.|\n)+?\/\/)/g;
        const underReg = /\\(__(?:.|\n)+?__)/g;
        const deleteReg = /\\(~~(?:.|\n)+?~~)/g;
        const supReg = /\\(\^\^(?:.|\n)+?\^\^)/g;
        const subReg = /\\(,,(?:.|\n)+?,,)/g;
        const indentReg = /\\(::)/g;
        const hrReg = /(?<=\n)\\(----)(?=\n)/g;
        const anchorReg = /\\(\[\[(?:[^|]+?|.+?(?<!\\)\|.+?)]])/g;
        const noteReg = /\\(\(\((?:[^|]+?|.+?(?<!\\)\|.*?)\)\))/g;
        const titleReg = /(?<=\n)\\(={2,6} .+)(?=\n)/g;

        content = content.replaceAll(boldReg, '$1');
        content = content.replaceAll(italicReg, '$1');
        content = content.replaceAll(underReg, '$1');
        content = content.replaceAll(deleteReg, '$1');
        content = content.replaceAll(supReg, '$1');
        content = content.replaceAll(subReg, '$1');
        content = content.replaceAll(indentReg, '$1');
        content = content.replaceAll(hrReg, '$1');
        content = content.replaceAll(anchorReg, '$1');
        content = content.replaceAll(noteReg, '$1');
        content = content.replaceAll(titleReg, '$1');

        return content;
    }

    /** Make paragraphs between all h elements. */
    static toParagraph(content) {
        content = content.replaceAll(this.paragraphReg, '<div>$1</div>');

        return content;
    }

    static translate(content) {
        const result = {
            content: '',
            highClassList: [],
            keywordList: [],
        };

        try {
            content = '<div id="content">\n' + content + '\n</div>';

            content = this.toBold(content);
            content = this.toItalic(content);
            content = this.toDelete(content);
            content = this.toUnder(content);
            content = this.toSup(content);
            content = this.toSub(content);
            content = this.toIndent(content);
            content = this.toHr(content);
            content = this.toAnchor(content);
            content = this.toNote(content);
            content = this.toTitle(content);

            // content = this.toSpan(content);
            // content = this.toImage(content);
            // content = this.toQuote(content);
            // content = this.toOList(content);
            // content = this.toUList(content);
            // content = this.toTable(content);
            // content = this.toFrame(content);
            // content = this.toHighClass(content);
            // content = this.toMath(content);
            // content = this.toCode(content);

            content = this.toNormal(content); // This should be the second from the last
            content = this.toParagraph(content); // This should be the last

            // content = content.replace(/(?<=\n?)((?:.|\n)*)(?=\n?)/, '$1');

            content = content.replaceAll(/\n/g, '<br>');

            result.content = content;

            return result;
        } catch (e) {
            alert(e);
            throw e;
        }
    }
}

export default Translator;
