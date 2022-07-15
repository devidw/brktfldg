# brktfldg

Read [about](https://github.com/devidw/brktfldg-demo#about) the project


## Usage

### Browser

```
https://cdn.jsdelivr.net/npm/@devidw/brktfldg/dist/brktfldg.min.css
```

```
https://cdn.jsdelivr.net/npm/@devidw/brktfldg/dist/brktfldg.min.js
```

```html
<p>
    This is a paragraph (and this is something useless).
</p>

<script>
    brktfldg.collapseBrackets(
        document.querySelector('p')
    )

    // Results in:
    // <p>
    //     This is a paragraph (…).
    // </p>
</script>
```
