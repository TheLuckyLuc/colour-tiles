const header = document.querySelector("header");
const headerColor = document.querySelector("#rgba");
const title = document.querySelector("#title");
const container = document.querySelector(".container");
const squares = document.querySelectorAll(".container__square");
const squaresNormal = document.querySelectorAll(".container__square--normal");
const newGame = document.querySelector("#buttonbar__new");
const normalGame = document.querySelector("#buttonbar__normal");
const hardGame = document.querySelector("#buttonbar__hard");
const body = document.querySelector("body");
let winningColor;
let backgroundWinner;

// run the init function to make sure the game loads as a 'clean slate'
init();

// functions for the 'normal', 'new game' and 'hard' buttons
newGame.addEventListener("click", generateSquares);

hardGame.addEventListener("click", makeItHard);

normalGame.addEventListener("click", makeItNormal);

// attach an event listener to each square that's visible on the screen, to listen out for a click
squares.forEach(function(square) {
    square.addEventListener("click", function() {
        // if the clicked square is the winning colour, run the 'fillSquares' function to colour them all the same and change the background colour
        if (this.style.backgroundColor === winningColor) {
            fillSquares();
            body.style.backgroundColor = backgroundWinner;
            header.style.backgroundColor = winningColor;
            title.innerHTML = "Correct!";
            newGame.innerHTML = "Restart";
        } else {
            // if it isn't the winning colour, make it disappear and remove any transition delay that might have been applied through pressing 'new game' previously - otherwise it could take up to 1800ms for the square to disappear
            this.style.transitionDelay = "0ms";
            this.classList.add("hidden");
        }
    });
});

// as the function name suggests, this will generate the square colours and pick the winning colour
function generateSquares() {
    // first make sure everything is reset
    reset();
    // delay counter for the 'squareMove' class below
    let squareDelay = 0;
    // delay counter for changing the colour of each square
    let transitionTime = 0;
    
    // ternary operator - if the game has been set to 'hard' i.e. the class of 'container__hard' is applied, select a random number from 0-8 (as we're working with indexes) and set it into a variable. Otherwise, select a random number from 0-5.
    let randomNum = container.classList.contains("container__hard") ? Math.floor(Math.random() * 9) : Math.floor(Math.random() * 6);

    // loop through each visible square
    for (let i = 0; i < squares.length; i++) {
        // increment the transitionTime variable by 200ms
        transitionTime+= 200;
        // if the current index matches the randomly selected number, run the theWinner() function, so it's set as the 'winning colour'
        if (i === randomNum) {
            // apply a transition delay with the current variable value
            squares[i].style.transitionDelay = `${transitionTime}ms`;
            squares[i].style.backgroundColor = theWinner();
            // set the winning colour as the current square
            winningColor = squares[i].style.backgroundColor;
        } else {
            // same as above, just this time it's running a colour picking function that doesn't set a 'winning colour'
            squares[i].style.transitionDelay = `${transitionTime}ms`;
            squares[i].style.backgroundColor = pickColor();
        }

        // run a function that adds the 'squareMove' class after an increasing delay, so you get the 'around in a circle popping' effect
        setTimeout(function(){
            squares[i].classList.add("squareMove");
        }, squareDelay);
        squareDelay+= 200;
        
        // remove the 'squareMove' class once the cycle has completed
        setTimeout(function(){
            squares[i].classList.remove("squareMove");
        }, 1900);
    }
    // set the winning rgb values as the hint in the header
    headerColor.innerHTML = `>>> ${winningColor} <<<`;
}

// this function does near enough the exact same as the generateSquares() function, aside from setting the transitionDelay to 0 across the board & not running the popping animation.
// i've got this separate function because it looks strange if you switch between 'normal' & 'hard' mode, as some of the colours pop into place before the popping animation is done
function init() {
    reset();
    let randomNum = container.classList.contains("container__hard") ? Math.floor(Math.random() * 9) : Math.floor(Math.random() * 6);
    for (let i = 0; i < squares.length; i++) {
        if (i === randomNum) {
            squares[i].style.transitionDelay = "0ms";
            squares[i].style.backgroundColor = theWinner();
            winningColor = squares[i].style.backgroundColor;
        } else {
            squares[i].style.transitionDelay = "0ms";
            squares[i].style.backgroundColor = pickColor();
        }
    }
    headerColor.innerHTML = `>>> ${winningColor} <<<`;
}

// this function sets the winning square
function theWinner() {
    // set random numbers between 0-256
    let r = Math.floor(Math.random() * 257);
    let g = Math.floor(Math.random() * 257);
    let b = Math.floor(Math.random() * 257);
    let colour = `rgb(${r}, ${g}, ${b})`; // this will show as rgb(number, number, number)
    backgroundWinner = `rgba(${r}, ${g}, ${b}, 0.5)`; // so the background colour changes once the winner is clicked
    return colour;
}

// identical to the above function, minus setting the background colour
function pickColor() {
    let r = Math.floor(Math.random() * 257);
    let g = Math.floor(Math.random() * 257);
    let b = Math.floor(Math.random() * 257);
    let colour = `rgb(${r}, ${g}, ${b})`;
    return colour;
}

function reset() {
    // set all the backgrounds and text to their default values
    header.style.backgroundColor = "black";
    body.style.background = "none";
    title.innerHTML = "Guess The Colour";
    newGame.innerHTML = "New Game";
    // loop through each square
    for (let i = 0; i < squares.length; i++) {
        // if the current square is invisible, remove the 0.5s opacity transition delay with the 'delayChange' class and make it visible - without the change in delay their 'pop in' seems out of sync
        if (squares[i].classList.contains("hidden")) {
            // changing the delay in opacity only makes a noticeable difference if someone presses restart halfway through the game before winning
            squares[i].classList.add("delayChange");
            squares[i].classList.remove("hidden");
            // remove the 'delayChange' class after it's gone through all squares, so the opacity delay is 0.5s again
            setTimeout(function(){
                squares[i].classList.remove("delayChange");
            }, 1900);
        }
    }
}

// this function will only run when the winner has been clicked
function fillSquares() {
    // loop over each square
    for (let i = 0; i < squares.length; i++) {
        squares[i].style.transitionDelay = "0ms"; // remove any transition delays
        squares[i].classList.remove("hidden"); // make them all visible
        squares[i].style.backgroundColor = winningColor; // set them all the same colour as the winner
    }
}

// this function will make all 9 squares appear
function makeItHard() {
    // apply/remove the relevant class styling for the grid
    container.classList.remove("container__normal");
    container.classList.add("container__hard");
    init(); // so it's a 'clean slate'
    for (let i = 0; i < squares.length; i++) { // loop over the squares and apply/remove the relevant style classes
        squares[i].classList.remove("container__square--normal");
        squares[i].classList.add("container__square--hard");
        if (i > 5) { // if the current index is above 5, make the remaining squares visible
            squares[i].classList.remove("disappear");
        }
    }
}

// exactly the same as above, just the other way around
function makeItNormal() {
    container.classList.add("container__normal");
    container.classList.remove("container__hard");
    init();
    for (let i = 0; i < squares.length; i++) {
        squares[i].classList.add("container__square--normal");
        squares[i].classList.remove("container__square--hard");
        if (i > 5) {
            squares[i].classList.add("disappear");
        }
    }
}
