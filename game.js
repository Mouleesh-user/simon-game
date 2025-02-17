$(document).ready(function () {
    var clicks = [];
    let gen = []; // Stores the generated sequence (moved outside keydown)
    let con = 1;
    let state = false;
    let color = ["green", "red", "yellow", "blue"];

    $(document).keydown(function () {
        if (!state) {
            $("h1").text("Level " + con);
            state = true;
            generateSequence(); // Start game when key is pressed
        }
    });

    // Function to generate a new step in the sequence
    function generateSequence() {
        let num = Math.floor(Math.random() * 4);
        let autoclick = color[num];

        gen.push(autoclick); // Add to sequence
        console.log("Generated Sequence:", gen); // Debugging

        setTimeout(() => {
            animateClick(autoclick); // Animate button
            switchState(autoclick); // Play sound
        }, 500);
    }

    // Function to check the player's input
    function checkanswer() {
        let i = clicks.length - 1; // Compare the last input

        if (clicks[i] === gen[i]) {
            console.log("Success");

            if (clicks.length === gen.length) {
                setTimeout(() => {
                    clicks = []; // Reset for the next round
                    con++; // Increase level
                    $("h1").text("Level " + con);
                    generateSequence(); // Generate new step
                }, 1000);
            }
        } else {
            console.log("Wrong! Game Over.");
            resetGame();
        }
    }

    // Function to handle player clicks
    $(".btn").click(function () {
        if (!state) return; // Ignore clicks before game starts

        let click = $(this).attr("id");
        clicks.push(click);
        console.log("Player Clicks:", clicks);

        animateClick(click);
        switchState(click);
        checkanswer();
    });

    // Function to reset the game
    function resetGame() {
        console.log("Game Over. Restarting...");
        $("h1").text("Game Over! Press Any Key to Restart");
        gen = [];
        clicks = [];
        con = 1;
        state = false;
    }

    // Function to play sound
    function switchState(click) {
        let audio = new Audio(`sounds/${click}.mp3`);
        audio.play();
    }

    // Function to animate button click
    function animateClick(event) {
        let $btn = $("#" + event);
        $btn.addClass("pressed");
        setTimeout(() => {
            $btn.removeClass("pressed");
        }, 100);
    }
});
