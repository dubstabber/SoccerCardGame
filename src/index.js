const cards = ["attackBlack.jpg", "attackBlue.jpg", "attackBrown.jpg", "attackRed.jpg", "attackGolden.jpg", 
               "goalBlack.jpg", "goalBlue.jpg", "goalBrown.jpg", "goalRed.jpg", "goalGolden.jpg"];
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
let turn;
let pending = false;

$(startBtn).click(startGame);

function startGame() {
    $(startBtn).addClass("hidden");
    $(howToBtn).addClass("hidden");
    msg.removeClass("hidden");
    scoreStatus.removeClass("hidden");
    playerDeck.removeClass("hidden");
    AIDeck.removeClass("hidden");
    preview.removeClass("hidden");

    title.html("Round "+round);
    scoreStatus.html("Score  "+playerScore+" : "+AIScore);
    let pick;
    for(let i = 0; i < 10; i++){
        pick = Math.floor(Math.random() * cards.length);
        AIDeck.append("<img class='card' src='./img/cardBack.jpg' id='e"+i+"' name='"+pick+"' />");
    }


    for(let i = 0; i < 10; i++){
        pick = Math.floor(Math.random() * cards.length);
        playerDeck.append("<img class='card' src='./img/"+cards[pick]+"' id='p"+i+"' name='"+pick+"' />")
        $("#p"+i).click(playerTurn)

    }
    turn = Math.floor(Math.random() * 2);
    if(turn === 1) AIattack();
}

function playerTurn(e){
    if(turn == 0 && !pending){
        preview.append("<img name='"+e.target.name+"' class='board__preview-player' src='./img/"+cards[e.target.name]+"' />");
        $("#"+e.target.id).remove();
        pending = true;
        setTimeout(AIdefend, 500);
    }

    if(turn == 1 && !pending){
        preview.append("<img name='"+e.target.name+"' class='board__preview-player' src='./img/"+cards[e.target.name]+"' />");
        $("#"+e.target.id).remove();
        let AIcard = parseInt($(".board__preview-AI").attr("name"));
        if(parseInt(e.target.name) !== AIcard +5 && AIcard < 5){
            AIScore++;
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
    if(turn == 1) setTimeout(AIattack, 500);
    else pending = false;
    
}
