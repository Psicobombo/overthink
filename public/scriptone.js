var activeMatch = false
var endedMatches = []
var selectedCard



async function getRandomCharacter() {
    const response = await fetch('/api/characters/random')
    const charactersArray = await response.json()
    // console.log(charactersArray)
    return charactersArray[0];
}

async function getRandomTitle() {
    const response = await fetch('/api/titles/random')
    const titlesArray = await response.json()
    // console.log(titlesArray[0])
    return titlesArray[0];
}

async function getRandomModifier() {
    const response = await fetch('/api/modifiers/random')
    const modifiersArray = await response.json()
    // console.log(modifiersArray[0])
    return modifiersArray[0]
}


const settings = {
    twitchSafeMode: false,
    updateTwitchSafeMode() {
        settings.twitchSafeMode = document.getElementById("twitchSafeMode-checkbox").checked;
        console.log(`Twitch Safe Mode: ${settings.twitchSafeMode}`)
    },
    colors: {
        left: '#ff00b1',
        right: '#8cc63f',

        update() {
            this.left = document.getElementById("color-picker-left").value
            this.right = document.getElementById("color-picker-right").value

            let r = document.querySelector(':root');
            r.style.setProperty('--left-primary', this.left);
            r.style.setProperty('--right-primary', this.right);
        }
    }
}

// listen for load event in the window
window.addEventListener("load", () => {

    // initialize shit
    sw.init()

    twitch.init()

    settingsModal.init()

    customCharacterModal.init()

    newRandomMatch()

});

async function newRandomMatch() {

    if (activeMatch) {activeMatch.end()}

    new Match({
        character1: await getRandomCharacter(),
        character2: await getRandomCharacter(),
        title: await getRandomTitle()
    })

    resetModifiers()
}

async function randomizeTitle() {

    let titleElement = document.getElementById("title")

    currentTitle = titleElement.value

    let randomTitle

    do {
        randomTitle = await getRandomTitle()

    } while (randomTitle.label === currentTitle);  // make sure random title is different than current title

    activeMatch.title = randomTitle
    titleElement.value = randomTitle.label
}

function resetModifiers() {

    activeMatch.leftCard.clearModifier()
    activeMatch.rightCard.clearModifier()
}

function customizeCharacter() {

    inputURL = document.getElementById("customImage-input").value

    if (selectedCard === "left") {
        document.getElementById("vs-participant-left").src = inputURL
    } else {
        document.getElementById("vs-participant-right").src = inputURL
    }
}

function updatePieChart() {

    // update piechart by updating css root variable --leftPercentage
    let r = document.querySelector(':root');
    r.style.setProperty('--leftPercentage', activeMatch.leftPercentage);

    //update percentages labels
    document.getElementById("twitch-left-percentage").innerText = `${Math.round((activeMatch.leftPercentage * 100))}%`
    document.getElementById("twitch-right-percentage").innerText = `${100 - (activeMatch.leftPercentage * 100)}%`

}

function overwritePieChart(percentage) {

    //debug function to overwrite poll percentage

    // update piechart by updating css root variable --leftPercentage
    let r = document.querySelector(':root');
    r.style.setProperty('--leftPercentage', percentage);

    //update percentages labels
    document.getElementById("twitch-left-percentage").innerText = `${Math.round((percentage * 100))}%`
    document.getElementById("twitch-right-percentage").innerText = `${100 - (percentage * 100)}%`

}

function updateMatchData() {

    // push user-made changes to the activeMatch object

    // update title
    let titleDiv = document.getElementById("title")
    activeMatch.title = { "label": titleDiv.innerText, "isTwitchSafe": true, "category": "" }

    // update left card image
    let leftImage = document.getElementById("vs-participant-left")
    activeMatch.leftCharacter.url = leftImage.src

    // update left card label
    activeMatch.leftCharacter.label = document.getElementById("character-label-left").innerText

    // update right card image
    let rightImage = document.getElementById("vs-participant-right")
    activeMatch.rightCharacter.url = rightImage.src

    // update right card label
    activeMatch.rightCharacter.label = document.getElementById("character-label-right").innerText
}

function shuffle(array) {

    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}


const settingsModal = {
    element: null,

    init() {

        this.element = document.getElementById("settings-modal"),
            this.element.addEventListener("click", settingsModal.clickHandler, false)

        this.openButton = document.getElementById("settings-button");
        this.openButton.addEventListener("click", settingsModal.toggleVisibility, false);

        document.getElementById("color-picker-left").onchange = settings.colors.update
        document.getElementById("color-picker-right").onchange = settings.colors.update
    },

    clickHandler(e) {

        // process clicks if inside the dialog
        if (e.target != e.currentTarget) {

            // execute function based on button id
            clickedId = e.target.id
            if
                (clickedId.includes("close-button")) { settingsModal.toggleVisibility() }
            else if
                (clickedId.includes("twitchSafeMode-checkbox")) { settings.updateTwitchSafeMode() }

        } else { settingsModal.toggleVisibility() } // closes the modal if click is not in the modal-dialog

        // prevents event to bubble up and trigger other listeners
        e.stopPropagation();
    },

    toggleVisibility() {
        settingsModal.element.classList.toggle("hidden")
    }
}

const customCharacterModal = {
    element: null,

    init() {

        this.element = document.getElementById("customCharacter-modal")
        this.element.addEventListener("click", customCharacterModal.clickHandler, false)

        this.previewImage = document.getElementById("characterPreview")

        this.customImageInput = document.getElementById("customImage-input")
        this.customImageInput.oninput = () => this.previewImage.src = this.customImageInput.value

    },

    clickHandler(e) {

        // process clicks if inside the dialog
        if (e.target != e.currentTarget) {

            // execute function based on button id
            clickedId = e.target.id
            if
                (clickedId.includes("close-button")) { customCharacterModal.toggleVisibility() }
            else if
                (clickedId.includes("twitchSafeMode-checkbox")) { settings.updateTwitchSafeMode() }

        } else { customCharacterModal.toggleVisibility() } // closes the modal if click is not in the modal-dialog

        // prevents event to bubble up and trigger other listeners
        e.stopPropagation();
    },

    toggleVisibility() {
        customCharacterModal.element.classList.toggle("hidden")
    }
}

function setValidStyle(HTMLelement) {

    HTMLelement.classList.remove('is-invalid');
    HTMLelement.classList.add("is-valid")
}

function setInvalidStyle(HTMLelement) {

    HTMLelement.classList.remove('is-valid');
    HTMLelement.classList.add("is-invalid")
}