class Card {
    constructor(character, HTMLid) {

        this.HTMLid = HTMLid
        this.init()
        this.character = character
        this.modifier = { label: "" }
    }

    init() {

        let CSScardSelector = `#${this.HTMLid}`

        this.elements = {

            // initialize DOM variables
            self: document.querySelector(`${CSScardSelector}`),

            characterNameLabel: document.querySelector(`${CSScardSelector} .character-label`),
            characterPicture: document.querySelector(`${CSScardSelector} .character-img`),
            modifierTextarea: document.querySelector(`${CSScardSelector} .modifier-textarea`)
        }

        // needs to preserve "this" context for the buttons functions => use bind(this)
        // need to be able to remove handler once card is not active => save listener to use it later
        this.elements.self
            .addEventListener(
                "click",
                this.clickListener = this.clickHandler.bind(this),
                false)
    }

    clickHandler(e) {
        // currentTarget = element attached to event listener (card); target = clicked element(button) (icons are ignored via css)
        if (e.target != e.currentTarget) {

            // execute function based on clicked button id
            let clickedId = e.target.id
            if
                (clickedId.includes("randomize-character")) { this.randomizeCharacter() }
            else if
                (clickedId.includes("customize-character")) { this.customizeCharacter() }
            else if
                (clickedId.includes("randomize-modifier")) { this.randomizeModifier() }
            else if
                (clickedId.includes("clear-modifier")) { this.clearModifier() }

        }
        // prevents event to bubble up and trigger other listeners
        e.stopPropagation();

    }

    removeClickListener() {
        this.elements.self.removeEventListener("click", this.clickListener)
    }

    set character(characterObj) {
         // update internal object
        this._character = characterObj

        // update HTML elements
        this.elements.characterNameLabel.innerText = characterObj.name
        this.elements.characterPicture.src = characterObj.image
    }

    set modifier(modifier) {
         // update internal object
        this._modifier = modifier

        // update HTML element
        this.elements.modifierTextarea.value = modifier?.label || ""
    }

    get character() {
        return this._character
    }

    get modifier() {
        return this._modifier
    }

    async randomizeModifier() {
        let randomModifier

        do {
            randomModifier = await getRandomModifier()

        } while (randomModifier.label === this.modifier.label);  // make sure random modifier is different than current modifier

        this.modifier = randomModifier
    }

    clearModifier() {
        this.modifier = {}
    }

    async randomizeCharacter() {

        this.character = (await getRandomCharacter())
        activeMatch.resetPoll()
    }

    customizeCharacter() { }

}