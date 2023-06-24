<script>
    import Translator from 'ken-markup'

    let translated = '여기에 번역된 결과가 나타납니다.';
    let content = "";

    function translate() {
        translated = Translator.translate(content).content;
    }
    
    function handleKeyUp(e) {
        console.log(e);
        if (e.code === 'Enter' && e.ctrlKey) {
            translate();
        }
    }

</script>

<h1><span style="color: rgb(0, 50, 104);">K</span><span style="color: rgb(0, 132, 202);">E</span><span style="color: rgb(21, 192, 242);">N</span>-MARKUP TEST</h1>

<section>
<article id="input">

<pre>
**굵게**
//기울임//
~~취소선~~
__밑줄__
[[링크]]
((각주))
= 제목
---- 구분선
:: 들여쓰기
</pre>

<textarea placeholder="내용을 입력하세요" name="content" bind:value={content} on:keyup={translate} />

</article>

<!-- <button id="translateBtn" on:click={translate()}>Translate!</button> -->

    <article contenteditable="false" bind:innerHTML={translated} id="output"></article>
</section>

<style lang="scss">
    @import "./markup.scss";

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
        padding: .7rem 1.2rem .3rem 1.2rem;
        /* border: solid rgb(21, 192, 242) .5rem; */
        border: solid black .3rem;
        border-radius: 1rem;
    }

    pre {
        margin: .5rem;
        padding: 1rem;
        background-color: white;
        border: grey solid .05rem;
    }

    textarea {
        margin: .5rem;
        min-width: 30rem;
        font-size: 1rem;
        padding: .5rem;
    }

    #input {
        display: flex;
        justify-content: center;
        margin: .5rem;
    }

    #output {
        border: grey solid .05rem;
        padding: 1rem;
        margin: .5rem;
        width: 45rem;
        background-color: white;
    }
</style>