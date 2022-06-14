class Match {
    constructor({character1, character2, title = { "label": "OVERTHINK" }}) {      //title is optional parameter, if not passed (eg in startup) dafaults to game name
        this.leftCharacter = character1
        this.rightCharacter = character2
        this.title =  title
        this.voters = {
            left: new Set(),
            right: new Set()
        }

        this.display()
    }

    get leftPercentage() {

        return this.voters.left.size / (this.voters.left.size + this.voters.right.size) || 0.5
    }


    display() {

        activeMatch = this

        let titleDiv = document.getElementById("title")
        titleDiv.innerText = this.title.label

        // set left card image
        let leftImage = document.getElementById("vs-participant-left")
        leftImage.src = this.leftCharacter.url

        // set left card label
        document.getElementById("character-label-left").innerText = this.leftCharacter.label

        // set right card image
        let rightParticipant = document.getElementById("vs-participant-right")
        rightParticipant.src = this.rightCharacter.url

        // set right card label
        document.getElementById("character-label-right").innerText = this.rightCharacter.label

        updatePieChart()

    }

    resetPoll() {

        this.voters.left.clear()
        this.voters.right.clear()

        sw.reset()

        updatePieChart()
    }

}