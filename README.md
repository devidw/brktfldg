# brktfldg

Read [about](https://github.com/devidw/brktfldg-demo#about) the project


## Usage

Load the library using the following CDN link:

```
https://cdn.jsdelivr.net/npm/@devidw/brktfldg/dist/brktfldg.js
```

The `brktfldg` variable is available on the `window` object once the library is loaded.

To add collapse/expand functionality to all brackets inside an element and its children, use the `collapseBrackets(el, options)` function.

```html
<p>
    This is a paragraph (and this is something useless).
</p>

<script>
    brktfldg.collapseBrackets(
        document.querySelector('p')
    )
</script>
```


## Configuration

Optionally an options object can be passed to the `collapseBrackets` function to configure the behaviour and look of the interactive brackets.

The following configuration options are available with their default values:

```js
{
    openChar: '(', // Replaces the original opening bracket
    closeChar: ')', // Replaces the original closing bracket
    placeholder: '…', // Displayed as text for the toggle to expand and collapse the content
    shortMaxWords: 1, // Number of words to determine if the content is short, quick expanding is possible on short conent when enabled and the word count is not displayed on short content
    wordCount: true, // Show word count
    expandShortOnHover: true, // Expand brackets with short content on hover
}
```