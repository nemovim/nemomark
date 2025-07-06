<script lang="ts">
    import Translator from "nemomark";

    let translated = $state<string>("여기에 번역된 결과가 나타납니다.");
    let errorMsg = $state<string>("문법 오류 발생 시 여기에 표시됩니다.");
    let content = $state<string>("");

    function translate() {
        try {
            translated = Translator.translate(content);
            errorMsg = "문법 오류 발생 시 여기에 표시됩니다.";
        } catch (e) {
            if (e instanceof Error) {
                console.error(e);
                errorMsg = e.message;
            }
        }
    }

    // function handleKeyUp(e) {
    //     console.log(e);
    //     if (e.code === 'Enter' && e.ctrlKey) {
    //         translate();
    //     }
    // }

    const description = `[ver. 1.0.1]
\\ 문법 취소
**굵게**
//기울임//
~~취소선~~
__밑줄__
[[링크]]
((각주))
# 제목
---- 구분선
:(순서 없는 목록
)(두 번째 항목):
:{순서 있는 목록
}{두 번째 항목}:
:[표(0,0)][칸(0,1)
][칸(1,0)][칸(1,1)]:
`;
</script>

<h1><span style:color={"rgb(50, 150, 250)"}>NEMOMARK</span> TEST</h1>

<section>
    <article id="input">
        <pre>{description}</pre>

        <textarea
            placeholder="내용을 입력하세요"
            name="content"
            bind:value={content}
            onkeyup={translate}
        ></textarea>
    </article>

    <article>
        <p contenteditable="false" id="errorP">{errorMsg}</p>
    </article>
    <article class="kmu" id="output">{@html translated}</article>
</section>

<style lang="scss">
    @use "./kmu.scss";

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
