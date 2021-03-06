import "./index.styl"

class BrktFldg {
    options = {
        needles: ["(", ")"], // The characters to search for
        needleRegex: /\((?!\))|(?<!\()\)/g, // The regex to test text nodes for
        replacements: ["(", ")"], // Replaces the original opening and closing bracket characters with the given ones
        placeholder: "…", // Displayed as text for the toggle to expand and collapse the content
        shortMaxWords: 1, // Number of words to determine if the content is short, quick expanding is possible on short conent when enabled and the word count is not displayed on short content
        wordCount: true, // Show word count
        expandShortOnHover: true, // Expand brackets with short content on hover
        ignoreTags: ["script", "style", "pre", "code", "brktfldg-container"], // Ignore these tags
    }

    constructor(el, options = {}) {
        this.el = el

        // Merge options
        this.options = { ...this.options, ...options }
    }

    /**
     * Find all brackets in the given element
     *
     * Loop through the child nodes and build an array of the following structure:
     * [ { "char": "(|)", "node": <node>, "offset": <offset> }, ... ]
     */
    getBrackets(el) {
        const brackets = []

        if (!el.hasChildNodes()) {
            return brackets
        }

        for (const child of el.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                let txt = child.nodeValue
                const matches = txt.match(this.options.needleRegex)

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
                        offset: originalIndex,
                    })
                }
            }
            // In case of an element, recurse
            else if (
                child.nodeType === Node.ELEMENT_NODE &&
                child.hasChildNodes() &&
                !this.options.ignoreTags.includes(child.tagName.toLowerCase())
            ) {
                brackets.push(...this.getBrackets(child))
            }
        }

        return brackets
    }

    /**
     * Get pairs of brackets from the given found brackets
     *
     * [ [ {}, {}, ], [ {}, {}, ], ... ]
     */
    getPairs(brackets) {
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

        const paris = brackets2pairs(brackets)

        // Remove if the pair is not valid, check on length and if the characters match
        const filtered = paris.filter((pair) => {
            return typeof pair[0] === "object"
                && typeof pair[1] === "object"
                && pair[0].char === this.options.needles[0]
                && pair[1].char === this.options.needles[1]
        })

        return filtered
    }

    /**
     * Apply needed changes to the DOM
     *
     * We add additional markup around the brackets and their contents to achieve the desired functionality for callapsing and expanding them
     */
    wrapBrackets(pairs) {
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

            const container = document.createElement("brktfldg-container")
            container.setAttribute(
                "data-brktfldg-open-char",
                this.options.replacements[0]
            )
            container.setAttribute(
                "data-brktfldg-close-char",
                this.options.replacements[1]
            )
            const toggle = document.createElement("brktfldg-toggle")
            toggle.setAttribute(
                "data-brktfldg-placeholder",
                this.options.placeholder
            )
            const content = document.createElement("brktfldg-content")

            try {
                // range.surroundContents(content)
                content.appendChild(range.extractContents())
                range.insertNode(content)
            } catch (e) {
                console.error(e)
                continue
            }

            content.parentElement.insertBefore(container, content)
            container.appendChild(toggle)
            container.appendChild(content)

            // Remove "(" from the content, first character
            function rmOpenCharHelper(textNode, char) {
                if (textNode.nodeValue.charAt(0) === char) {
                    textNode.nodeValue = textNode.nodeValue.slice(1)
                }
            }

            // Remove ")" from the content, last character
            function rmCloseCharHelper(textNode, char) {
                if (textNode.nodeValue.charAt(textNode.nodeValue.length - 1) === char) {
                    textNode.nodeValue = textNode.nodeValue.slice(0, -1)
                }
            }

            function applyRmToEl(el, callback, char) {
                if (el.nodeType === Node.TEXT_NODE) {
                    callback(el, char)
                }
                // If the content does not start with a text node we have to find the bracket in the first child node, go deeper if necessary
                else if (el.nodeType === Node.ELEMENT_NODE) {
                    for (const child of el.childNodes) {
                        applyRmToEl(child, callback, char)
                    }
                }
            }

            applyRmToEl(content.firstChild, rmOpenCharHelper, this.options.needles[0])
            applyRmToEl(content.lastChild, rmCloseCharHelper, this.options.needles[1])
        }
    }

    /**
     * Process each bracket's content and calculate its word count
     *
     * The word count can be configured to be displayed inside the toggle element instead of the placeholder, when the brackets are closed
     * The short count is also used to determine if the bracket's content is short and therefore the word count indicator should be displayed and quick expanded on hover is possible if enabled
     */
    processWordCounts() {
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

        const containers = this.el.querySelectorAll("brktfldg-container")
        containers.forEach((container) => {
            const content = container.querySelector("brktfldg-content")
            const toggle = container.querySelector("brktfldg-toggle")
            const wordCount = getWordCount(content.innerHTML)

            if (this.options.wordCount) {
                toggle.setAttribute("data-brktfldg-word-count", wordCount)
            }

            const isShort = wordCount <= this.options.shortMaxWords
            if (isShort) {
                container.classList.add("brktfldg-container--short")
            }
        })
    }

    /**
     * Add toggle functionality to the toggle elements
     */
    addEventListeners() {
        const toggles = this.el.querySelectorAll("brktfldg-toggle")
        toggles.forEach((toggle) => {
            const container = toggle.parentElement

            toggle.addEventListener("click", (e) => {
                e.stopPropagation()
                e.preventDefault()
                container.classList.toggle("brktfldg-container--open")
            })

            if (this.options.expandShortOnHover) {
                const isShort = container.classList.contains(
                    "brktfldg-container--short"
                )

                if (isShort) {
                    toggle.addEventListener("mouseover", () => {
                        if (
                            !container.classList.contains(
                                "brktfldg-container--open"
                            )
                        ) {
                            container.classList.add("brktfldg-container--open")
                        }
                    })
                }
            }
        })
    }

    /**
     * Main function to process the content and make all brackets collapsible
     */
    collapseBrackets() {
        if (!this.el) {
            return
        }

        const isCollapsed = this.el.querySelector("brktfldg-container")

        if (isCollapsed) {
            return
        }

        const brackets = this.getBrackets(this.el)
        const pairs = this.getPairs(brackets)
        this.wrapBrackets(pairs)

        if (this.options.wordCount || this.options.expandShortOnHover) {
            this.processWordCounts()
        }

        this.addEventListeners()
    }
}

/**
 * Wrapper function to create a new instance of the BracketFolding class
 */
export function collapseBrackets(el, options) {
    const brktfldg = new BrktFldg(el, options)
    brktfldg.collapseBrackets()
}
