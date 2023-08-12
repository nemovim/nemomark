<script>
    import Translator from 'ken-markup';

    let translated = '여기에 번역된 결과가 나타납니다.';
    let errorMsg = '문법 오류 발생 시 여기에 표시됩니다.';
    let content = '';

    function translate() {
        try {
            translated = Translator.translate(content);
            errorMsg = '문법 오류 발생 시 여기에 표시됩니다.';
        } catch(e) {
            errorMsg = e;
        }
    }

    // function handleKeyUp(e) {
    //     console.log(e);
    //     if (e.code === 'Enter' && e.ctrlKey) {
    //         translate();
    //     }
    // }

    let description = `[ver. 0.2.1]
\\ 문법 취소
**굵게**
//기울임//
~~취소선~~
__밑줄__
[[링크]]
((각주))
# 제목
---- 구분선
:: 들여쓰기
:(순서 없는 목록
)(두 번째 항목):
:{순서 있는 목록
}{두 번째 항목}:
:[표][가로 2
][세로 1][세로 2]:
`;
</script>

<h1>
    <span style="color: rgb(0, 50, 104);">K</span><span
        style="color: rgb(0, 132, 202);">E</span
    ><span style="color: rgb(21, 192, 242);">N</span>-MARKUP TEST
</h1>

<section>
    <article id="input">
        <pre contenteditable="false" bind:innerText={description} />

        <textarea
            placeholder="내용을 입력하세요"
            name="content"
            bind:value={content}
            on:keyup={translate}
        />
    </article>

    <article>
        <p contenteditable="false" bind:innerText={errorMsg} id="errorP" />
    </article>
    <article contenteditable="false" bind:innerHTML={translated} id="output" />
</section>

<style lang="scss">
    @import './markup.scss';

    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    h1 {
        text-align: center;
        background-color: white;
        width: fit-content;
        margin: 2rem auto 1rem auto;
        padding: 0.7rem 1.2rem 0.3rem 1.2rem;
        /* border: solid rgb(21, 192, 242) .5rem; */
        border: solid black 0.3rem;
        border-radius: 1rem;
    }

    pre {
        margin: 0;
        margin-right: 0.5rem;
        padding: 1rem;
        background-color: white;
        border: grey solid 0.05rem;
    }

    textarea {
        margin: 0;
        margin-left: 0.5rem;
        min-width: 30rem;
        font-size: 1rem;
        padding: 0.5rem;
    }

    #input {
        margin: 1rem;
        display: flex;
        justify-content: center;
    }

    #errorP {
        color: red;
        font-weight: 700;
        font-size: 0.8rem;
        background-color: rgb(255, 230, 230);
        padding: 0.2rem 0.5rem;
    }

    #output {
        margin: 1rem;
        border: grey solid 0.05rem;
        padding: 1rem;
        width: 45rem;
        background-color: white;
    }
</style>
