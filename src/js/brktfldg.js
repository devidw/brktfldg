/**
 * Find all brackets in the given element
 * 
 * Loop through the child nodes and build an array of the following structure:
 * 
 * [
 *   {
 *     "char": "(|)",
 *     "node": <node>,
 *     "offset": <offset>
 *   }
 * ]
 */
function getBrackets(el) {
    const brackets = []

    if (!el.hasChildNodes()) {
        return brackets
    }

    for (const child of el.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            let txt = child.nodeValue
            const matches = txt.match(/\(|\)/g)

            if (!matches) {
                continue
            }

            const txtLen = txt.length

            for (const match of matches) {
                // Get index of the match in the text and trim the text for the next iteration accordingly, since we shorten the text on each iteration, we have to recalculate the index based on the original text length and the trimmed text length
                const txtLenDiff = txtLen - txt.length
                const currIndex = txt.indexOf(match)
                const originalIndex = txtLenDiff + currIndex
                txt = txt.slice(currIndex + 1)

                brackets.push({
                    char: match,
                    node: child,
                    offset: originalIndex
                })
            }
        }
        // In case of an element, recurse
        else if (child.nodeType === Node.ELEMENT_NODE) {
            brackets.push(...getBrackets(child))
        }
    }

    return brackets
}

/**
 * Get pairs of brackets from the given found brackets
 * 
 * [ [ {}, {}, ], [ {}, {}, ], ]
 */
function getPairs(brackets) {

    /**
     * Validate that matches are "(" and ")" after each other
     */
    function hasOnlyPairs(arr) {
        return arr.reduce((acc, curr, i) => {
            if (i % 2 === 0) {
                return acc && curr.char === '('
            }
            return acc && curr.char === ')'
        }, true)
    }

    // if (!hasOnlyPairs(brackets)) {
    //     return []
    // }

    /**
     * Transform: [0,1,2,3] => [[0,1],[2,3]]
     */
    function brackets2pairs(arr) {
        const pairs = []
        for (let i = 0; i < arr.length; i += 2) {
            pairs.push([arr[i], arr[i + 1]])
        }
        return pairs
    }

    return brackets2pairs(brackets)
}

/**
 * Apply needed changes to the DOM
 * 
 * We add additional markup around the brackets and their contents to achieve the desired functionality for callapsing and expanding them
 */
function wrapBrackets(pairs) {

    if (!pairs.length) {
        return
    }

    // Reverse the pairs array to avoid breaking offsets due to changes in the DOM by inserting new wrappers for each pair after each other
    pairs.reverse()

    // Make ranges and wrap our markup around them
    for (const pair of pairs) {
        const [open, close] = pair

        // Range goes from the openening bracket to the closing bracket
        const range = document.createRange()
        range.setStart(open.node, open.offset)
        range.setEnd(close.node, close.offset + 1)

        const container = document.createElement('brktfldg-container')
        const toggle = document.createElement('brktfldg-toggle')
        toggle.innerText = '⋅⋅⋅'
        const content = document.createElement('brktfldg-content')

        range.surroundContents(content)

        content.parentElement.insertBefore(container, content)
        container.appendChild(toggle)
        container.appendChild(content)

        // Remove "(" and ")" from the content, first and last characters
        content.firstChild.nodeValue = content.firstChild.nodeValue.slice(1)
        content.lastChild.nodeValue = content.lastChild.nodeValue.slice(0, -1)
    }
}

/**
 * Process word counts and add indicators to the containers
 */
function processWordCounts(el) {
    /**
     * Helper function to get the word count of a string
     */
    function getWordCount(str) {
        /**
         * Helper function to strip html from a string
         */
        function stripHtml(html) {
            let tmp = document.createElement("DIV")
            tmp.innerHTML = html
            return tmp.textContent || tmp.innerText || ""
        }

        str = stripHtml(str)
        str = str.trim()
        str = str.replace(/\s+/g, " ")
        return str.split(" ").length
    }

    const containers = el.querySelectorAll("brktfldg-container")
    containers.forEach((container) => {
        const content = container.querySelector("brktfldg-content")
        const wordCount = getWordCount(content.innerHTML)
        container.setAttribute('data-brktfldg-word-count', wordCount)

        const isShort = wordCount <= 1
        if (isShort) {
            container.classList.add('brktfldg-container--short')
        }
    })
}

/** 
 * Add toggle functionality to the toggle elements
 */
function setEventListeners(el) {
    const toggles = el.querySelectorAll("brktfldg-toggle")
    toggles.forEach((toggle) => {
        const container = toggle.parentElement

        // const isShort = container.classList.contains('brktfldg-container--short')

        // if (isShort) {
        //     toggle.addEventListener('mouseover', () => {
        //         if (!container.classList.contains('brktfldg-container--open')) {
        //             container.classList.add('brktfldg-container--open')
        //         }
        //     })
        // }

        toggle.addEventListener('click', () => {
            container.classList.toggle('brktfldg-container--open')
        })
    })
}

/**
 * Main function to process the content and make all brackets collapsible
 */
export function collapseBrackets(el) {
    const brackets = getBrackets(el)
    const pairs = getPairs(brackets)
    wrapBrackets(pairs)
    processWordCounts(el)
    setEventListeners(el)
}