const maxCards = 10;
const maxRounds = 2;

const cards = ["attackBlack.jpg", "attackBlue.jpg", "attackBrown.jpg", "attackRed.jpg", "attackGolden.jpg", 
               "goalBlack.jpg", "goalBlue.jpg", "goalBrown.jpg", "goalRed.jpg", "goalGolden.jpg"];
const board = $(".board");
const startBtn = $(".board__btn")[0];
const howToBtn = $(".board__btn")[1];
const restartBtn = $(".board__btn")[2];
const backBtn = $(".board__btn")[3];
const title = $(".container__header");
const scoreStatus = $(".board__score");
const playerDeck = $(".board__player-deck");
const AIDeck = $(".board__AI-deck");
const preview = $(".board__preview");
let round = 1;
let playerScore = 0;
let AIScore = 0;
let turn;
let pending = false;

$(startBtn).click(() => {
    startGame();
    new Audio("../sfx/click.ogg").play();
});
$(howToBtn).click(() => {
    $(startBtn).addClass("hidden");
    $(howToBtn).addClass("hidden");
    $(backBtn).removeClass("hidden");
    $(".container__howToPlay").removeClass("hidden");

    new Audio("../sfx/click.ogg").play();
});
$(backBtn).click(() => {
    $(startBtn).removeClass("hidden");
    $(howToBtn).removeClass("hidden");
    $(backBtn).addClass("hidden");
    $(".container__howToPlay").addClass("hidden");
    new Audio("../sfx/click.ogg").play();
});

$(restartBtn).click(() => {
    round = 1;
    playerScore = 0;
    AIScore = 0;
    startGame();
    $(restartBtn).addClass("hidden");
    new Audio("../sfx/click.ogg").play();
});

function startGame() {
    $(startBtn).addClass("hidden");
    $(howToBtn).addClass("hidden");
    scoreStatus.removeClass("hidden");
    playerDeck.removeClass("hidden");
    AIDeck.removeClass("hidden");
    preview.removeClass("hidden");

    title.html("Round "+round);
    scoreStatus.html("Score  "+playerScore+" : "+AIScore);
    let pick;
    for(let i = 0; i < maxCards; i++){
        pick = Math.floor(Math.random() * cards.length);
        AIDeck.append("<img class='card' src='./img/cardBack.jpg' id='e"+i+"' name='"+pick+"' />");
    }


    for(let i = 0; i < maxCards; i++){
        pick = Math.floor(Math.random() * cards.length);
        playerDeck.append("<img class='card card__player' src='./img/"+cards[pick]+"' id='p"+i+"' name='"+pick+"' />")
        $("#p"+i).click(playerTurn)

    }
    turn = Math.floor(Math.random() * 2);
    if(turn === 1) AIattack();
}

function playerTurn(e){
    if(turn == 0 && !pending){
        new Audio("../sfx/kick.mp3").play();
        preview.append("<img name='"+e.target.name+"' class='board__preview-player' src='./img/"+cards[e.target.name]+"' />");
        $("#"+e.target.id).remove();
        pending = true;
        setTimeout(AIdefend, 600);
    }

    if(turn == 1 && !pending){
        preview.append("<img name='"+e.target.name+"' class='board__preview-player' src='./img/"+cards[e.target.name]+"' />");
        new Audio("../sfx/kick.mp3").play();
        $("#"+e.target.id).remove();
        let AIcard = parseInt($(".board__preview-AI").attr("name"));
        if(parseInt(e.target.name) !== AIcard +5 && AIcard < 5){
            AIScore++;
            new Audio("../sfx/goal.ogg").play();
            scoreStatus.html("Score  "+playerScore+" : "+AIScore);
        }
        pending = true;
        turn = 0;
        setTimeout(clearPreview, 3000);
    }
}

function AIdefend(){
    let playerTurn = parseInt($(".board__preview-player").attr("name"));
    let defended = false;
    for(let i = 0; i < 5; i++){
        if(i === playerTurn){
            AIDeck.children('img').each(function () {
                if(parseInt(this.name) === (playerTurn+5) && !defended){
                    defended = true;
                    preview.append("<img name='"+this.name+"' class='board__preview-AI' src='./img/"+cards[this.name]+"' />");
                    $("#"+this.id).remove();
                }
            });
        }
    }
    new Audio("../sfx/kick.mp3").play();
    if(!defended) {
        let selected = false;
        AIDeck.children('img').each(function() {
            if(parseInt(this.name) > 4 && parseInt(this.name) < 10 && !selected) {
                selected = true;
                preview.append("<img name='"+this.name+"' class='board__preview-AI' src='./img/"+cards[this.name]+"' />");
                $("#"+this.id).remove();
            }
        })
        if(!selected){
            let first = $(".board__AI-deck img")

            preview.append("<img name='"+first.first().attr('name')+"' class='board__preview-AI' src='./img/"+cards[first.first().attr('name')]+"' />");
            $("#"+first.first().attr('id')).remove();
        }
        if(playerTurn < 5){
            playerScore++;
            new Audio("../sfx/goal.ogg").play();
            scoreStatus.html("Score  "+playerScore+" : "+AIScore);
        }
    }
    pending = true;
    turn = 1;
    setTimeout(clearPreview, 3000);
}

function AIattack(){
    let randomId;
    let attackCards = [];
    let allCards = [];
    let cardName;

    new Audio("../sfx/kick.mp3").play();
    AIDeck.children('img').each(function() {
        allCards.push(this.id);
        if(parseInt(this.name) > -1  && parseInt(this.name) < 5) attackCards.push(this.id);
    })
    if(attackCards.length > 0) {
        randomId = Math.floor(Math.random() * attackCards.length);
        cardName = $("#"+attackCards[randomId]).attr('name');
        preview.append("<img name='"+cardName+"' class='board__preview-AI' src='./img/"+cards[cardName]+"' />");
        $("#"+attackCards[randomId]).remove();
    }
    else {
        randomId = Math.floor(Math.random() * allCards.length);
        cardName = $("#"+allCards[randomId]).attr('name');
        preview.append("<img name='"+cardName+"' class='board__preview-AI' src='./img/"+cards[cardName]+"' />");
        $("#"+allCards[randomId]).remove();
    }
    

    pending = false;
}

function clearPreview() {
    preview.empty();
    if(playerDeck.children().length == 0 && AIDeck.children().length == 0){
        round++;
        if(round > maxRounds){
            pending = false;
            playerDeck.addClass("hidden");
            AIDeck.addClass("hidden");
            preview.addClass("hidden");

            scoreStatus.html("Score  "+playerScore+" : "+AIScore);
            if(playerScore > AIScore){
                title.html("You win!");
            } else if(playerScore < AIScore) {
                title.html("You lose!");
            } else {
                title.html("Draw!");
            }
            $(restartBtn).removeClass("hidden");

        } else{
            pending = false;
            startGame();
        }
    }else
    if(turn == 1) setTimeout(AIattack, 600);
    else pending = false;
}
