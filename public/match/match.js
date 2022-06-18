class Match {
    constructor({character1, character2, title = { "label": "OVERTHINK" }}) {      //title is optional parameter, if not passed (eg in startup) dafaults to game name
        this.leftCard = new Card (character1, "character-card-left")
        this.rightCard = new Card (character2, "character-card-right")
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

        // // set left card image
        // let leftImage = document.getElementById("vs-participant-left")
        // leftImage.src = this.leftCard.character.image

        // // set left card label
        // document.getElementById("character-label-left").innerText = this.leftCard.character.name

        // // set right card image
        // let rightParticipant = document.getElementById("vs-participant-right")
        // rightParticipant.src = this.rightCard.character.image

        // // set right card label
        // document.getElementById("character-label-right").innerText = this.rightCard.character.name

        updatePieChart()

    }

    resetPoll() {

        this.voters.left.clear()
        this.voters.right.clear()

        sw.reset()

        updatePieChart()
    }

    end() {
        
        console.info("Match ended")
        endedMatches.push(this)

        // remove event listener from past cards
        this.leftCard.removeClickListener()
        this.rightCard.removeClickListener()
    }
}