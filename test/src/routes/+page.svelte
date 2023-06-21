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

<h1>KEN-MARKUP TEST</h1>
<pre>
**굵게**
//기울임//
~~취소선~~
__밑줄__
[[링크]]
((각주))
== 제목
---- 구분선
:: 들여쓰기
</pre>

<textarea placeholder="내용을 입력하세요" name="content" bind:value={content} on:keyup={translate} />
<button id="translateBtn" on:click={translate()}>Translate!</button>
<hr>
<div contenteditable="true" bind:innerHTML={translated}></div>

<style>
    textarea {
        width: -webkit-fill-available;
        height: 30vh;
    }
</style>