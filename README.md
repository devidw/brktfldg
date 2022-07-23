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
