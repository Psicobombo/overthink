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

        updatePieChart()
    }

    resetPoll() {

        this.voters.left.clear()
        this.voters.right.clear()

        sw.reset()

        updatePieChart()
    }

    end() {
        endedMatches.push(this)

        // remove event listener from past cards
        this.leftCard.removeClickListener()
        this.rightCard.removeClickListener()
    }
}