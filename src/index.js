const cards = ["attackBlack.jpg", "attackBlue.jpg", "attackBrown.jpg", "attackGolden.jpg", "attackRed.jpg", 
               "goalBlack.jpg", "goalBlue.jpg", "goalBrown.jpg", "goalGolden.jpg", "goalRed.jpg"];
const board = $(".board");
const startBtn = $(".board__btn")[0];
const howToBtn = $(".board__btn")[1];
const title = $(".container__header");
const msg = $(".board__msg");
const scoreStatus = $(".board__score");
const playerDeck = $(".board__player-deck");
const AIDeck = $(".board__AI-deck");
const preview = $(".board__preview");
const previewPlayer = $(".board__preview-player");
const previewAI = $(".board__preview-AI");
let round = 1;
let playerScore = 0;
let AIScore = 0;

startBtn.addEventListener("click", startGame);

function startGame() {
    $(startBtn).addClass("hidden");
    $(howToBtn).addClass("hidden");
    msg.removeClass("hidden");
    scoreStatus.removeClass("hidden");
    playerDeck.removeClass("hidden");
    AIDeck.removeClass("hidden");
    preview.removeClass("hidden");

    title.html("Round "+round);
    scoreStatus.html("Score: "+playerScore+":"+AIScore);
    let pick;
    for(let i = 0; i < 10; i++){
        pick = Math.floor(Math.random() * cards.length);
        AIDeck.append("<img class='card' src='./img/"+cards[pick]+"' id='"+i+"' />");
    }


    for(let i = 0; i < 10; i++){
        pick = Math.floor(Math.random() * cards.length);
        playerDeck.append("<img class='card' src='./img/"+cards[pick]+"' id='"+i+"' />");
    }

    preview.append("<img class='board__preview-player' src='./img/attackBlack.jpg' />");
    preview.append("<img class='board__preview-AI' src='./img/attackBlack.jpg' />");
   // enemy.add(img)
}