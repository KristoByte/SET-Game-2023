"use strict";

(function() {
let diff;
let timer;
let time;
let interval;
let startButton;
let board;
let menuView;
let gameView;
let backButton;
let refreshButton;

window.addEventListener("load", init);

function init() {
    backButton = id("back-btn");
    menuView = id("menu-view");
    gameView = id("game-view");
    refreshButton = id("refresh-btn");
    board = id("board");
    Math.random("hello");
    startButton = id("start-btn");
    
    startButton.addEventListener("click", startGame);
    backButton.addEventListener("click", backToMenu);
    refreshButton.addEventListener("click", refreshBoard);
}

function startGame() {
    menuView.classList.toggle("hidden");
    gameView.classList.toggle("hidden");
    let isEasy;

    let select = qs("select");
    timer = select.value;
    countdown('time', 0, timer);
    let radios = document.getElementsByName("diff");
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          diff = radios[i].value;
          break;
        }
    }
    if(diff == "easy") {
        isEasy = true;
    } else {
        isEasy = false;
    }

    for (let i = 0; i < 12; i++) {
        board.appendChild(generateUniqueCard(isEasy));
    }

}

function backToMenu() {
    menuView.classList.toggle("hidden");
    gameView.classList.toggle("hidden");
    clearInterval(interval);
    id("set-count").textContent = 0;
    id("time").textContent = "00:00";
    board.innerHTML = " "
}

function refreshBoard(){
    let cards = qsa(".card");
    let isEasy;
    let radios = document.getElementsByName("diff");
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          diff = radios[i].value;
          break;
        }
    }
    if(diff == "easy") {
        isEasy = true;
    } else {
        isEasy = false;
    }
    for (let i = 0; i < cards.length; i++) {
        cards[i].replaceWith(generateUniqueCard(isEasy))        
    }
}

function generateUniqueCard(isEasy) {
    let cardsLengths = qsa(".card").length;
    if(cardsLengths == 0) { 
        let attributes = generateRandomAttributes(isEasy);
        
        let srcString = attributes[0] + "-" + attributes[1] + "-" + attributes[2];
        let idString = attributes.join('-');

        let newCard = document.createElement("div");
        newCard.classList.add("card");
        newCard.id = idString;
        for (let i = 0; i < attributes[3]; i++) {
            let img = document.createElement("img");
            img.src = "img/"+srcString+".png";
            img.alt = idString;  
            newCard.appendChild(img); 
        }
        newCard.addEventListener("click", cardSelected);
        return newCard;
    } else {
        let unique = false;
        let cards = qsa(".card");

        while(!unique) {
            let attributes = generateRandomAttributes(isEasy);
            
            let idString = attributes.join('-');

            for (let i = 0; i < cards.length; i++) {
                if(idString == cards[i].id) {
                    unique = false;
                    break;
                } else {
                    unique = true;
                }
            }

            if(unique) {
                let srcString = attributes[0] + "-" + attributes[1] + "-" + attributes[2];
        
                let newCard = document.createElement("div");
                newCard.classList.add("card");
                newCard.id = idString;
                for (let i = 0; i < attributes[3]; i++) {
                    let img = document.createElement("img");
                    img.src = "img/"+srcString+".png";
                    img.alt = idString;  
                    newCard.appendChild(img); 
                }
                newCard.addEventListener("click", cardSelected);
                return newCard;
            }
        }
    }
}

function generateRandomAttributes(isEasy) {
    let attributes;
    let colors = ["green", "purple", "red"];
    let fill = ["outline", "solid", "striped"];
    let shape = ["diamond", "squiggle", "oval"];
    if(isEasy) {
        attributes = [colors[Math.floor(Math.random() * 3)], "solid", shape[Math.floor(Math.random() * 3)], Math.floor(Math.random() * 3+1)];
    } else {
        attributes = [colors[Math.floor(Math.random() * 3)], fill[Math.floor(Math.random() * 3)], shape[Math.floor(Math.random() * 3)], Math.floor(Math.random() * 3+1)];
    }
    return attributes;
}

function cardSelected() {
    this.classList.toggle("selected"); 
    let selectedCards = qsa(".selected");
    if(selectedCards.length == 3) {
        let setBoo = isASet(selectedCards);
        if(setBoo) {
            let score = parseInt(id("set-count").textContent);
            
            id("set-count").textContent = score + 1;
            for (let i = 0; i < selectedCards.length; i++) {
                let para = document.createElement("p");
                para.textContent = "SET!"
                selectedCards[i].appendChild(para);
                selectedCards[i].classList.toggle("hide-imgs");
            }

            let isEasy;
            let radios = document.getElementsByName("diff");
            for (var i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                diff = radios[i].value;
                break;
                }
            }
            if(diff == "easy") {
                isEasy = true;
            } else {
                isEasy = false;
            }
            setTimeout(function(){
                for (let i = 0; i < selectedCards.length; i++) {
                    selectedCards[i].classList.toggle("selected");
                    selectedCards[i].replaceWith(generateUniqueCard(isEasy));   
                }
            }, 1000)
        } else {
            for (let i = 0; i < selectedCards.length; i++) {
                let para = document.createElement("p");
                para.textContent = "Not a set :(";
                selectedCards[i].appendChild(para);
                selectedCards[i].classList.toggle("hide-imgs");
            }

            setTimeout(function(){
                for (let i = 0; i < selectedCards.length; i++) {
                    selectedCards[i].classList.toggle("selected");
                    selectedCards[i].classList.toggle("hide-imgs");
                    selectedCards[i].removeChild(qs(".card > p"));
                    time -= 5;

                }
            }, 1000)

        }
    }
}

function countdown(element, minutes, seconds) {
    seconds--;
    time = minutes*60 + seconds;
    interval = setInterval(function() {
        var el = document.getElementById(element);
        if (time < 0) {
            setTimeout(function() {
                countdown('clock', 0, 5);
            }, 2000);
            clearInterval(interval);
            let cards = qsa(".card");
            for (let i = 0; i < cards.length; i++) {
                cards[i].removeEventListener("click", cardSelected);
            }
            refreshButton.removeEventListener("click", refreshBoard);
            id("time").textContent = "00:00";

            return;
        }
        var minutes = Math.floor( time / 60 );
        if (minutes < 10) minutes = "0" + minutes;
        var seconds = time % 60;
        if (seconds < 10) seconds = "0" + seconds; 
        var text = minutes + ':' + seconds;
        el.innerHTML = text;
        time--;
    }, 1000);
}

function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let allSame = attributes[0][i] === attributes[1][i] &&
                    attributes[1][i] === attributes[2][i];
      let allDiff = attributes[0][i] !== attributes[1][i] &&
                    attributes[1][i] !== attributes[2][i] &&
                    attributes[0][i] !== attributes[2][i];
      if (!(allDiff || allSame)) {
        return false;
      }
    }
    return true;
  }

/////////////////////////////////////////////////////////////////////
// Helper functions
function id(id) {
    return document.getElementById(id);
}
  
function qs(selector) {
    return document.querySelector(selector);
}
  
function qsa(selector) {
    return document.querySelectorAll(selector);
}
})();