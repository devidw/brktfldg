# brktfldg

Read [about](https://github.com/devidw/brktfldg-demo#about) the project


## Usage

Load the library using the following CDN link:

```
https://cdn.jsdelivr.net/npm/@devidw/brktfldg/dist/brktfldg.js
```

To add collapse/expand functionality to all brackets inside an element and its children, use the `collapseBrackets(el, options)` function.

```html
<p>
    This is a paragraph (and this is something useless).
</p>

<script type="module">
    import { collapseBrackets } from 'https://cdn.jsdelivr.net/npm/@devidw/brktfldg/dist/brktfldg.js'

    collapseBrackets(
        document.querySelector('p')
    )
</script>
```


## Configuration

Optionally an options object can be passed to the `collapseBrackets` function to configure the behaviour and look of the interactive brackets.

The following configuration options are available with their default values:

```js
    {
        needles: ["(", ")"], // The characters to search for
        needleRegex: /\((?!\))|(?<!\()\)/g, // The regex to test text nodes for
        replacements: ["(", ")"], // Replaces the original opening and closing bracket characters with the given ones
        placeholder: "…", // Displayed as text for the toggle to expand and collapse the content
        shortMaxWords: 1, // Number of words to determine if the content is short, quick expanding is possible on short conent when enabled and the word count is not displayed on short content
        wordCount: true, // Show word count
        expandShortOnHover: true, // Expand brackets with short content on hover
        ignoreTags: ["script", "style", "pre", "code", "brktfldg-container"], // Ignore these tags
    }
```

<!--
<br>
<br>

<p align=center>
<a href="https://www.producthunt.com/posts/brktfldg-bracket-folding?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-brktfldg&#0045;bracket&#0045;folding" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=353553&theme=dark" alt="brktfldg&#0032;&#0183;&#0032;Bracket&#0032;Folding - Get&#0032;rid&#0032;of&#0032;all&#0032;these&#0032;brackets&#0058;&#0032;Read&#0032;less&#0044;&#0032;understand&#0032;more&#0046; | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</p>
-->
