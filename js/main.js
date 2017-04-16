
var blackTextStyle = { 
    font: "32px Arial", 
    fill: "#000000", 
    align: "center" };
var backgroundColor     = '#0000AA';
var cardArrays          = [];
var cardArrayIndexes    = {pile1: 0, pile2: 1, pile3: 2, pile4: 3, pile5: 4, diamondCards: 5, hpCards: 6, cards: 7};
var cardBumpAmount      = 25;
//var cards               = [];
var currencyLabelText   = 'Currency';
var defaultCardMoveTime = 1000;
var dialogText          = {};
var dialogTextSize      = 25;
var diamondCards        = [];
var diamondGroup        = {};
var diamondSpot         = {};
var disabledButtonAlpha = 0.5;
var displayGroup        = {};
var exitArray           = [];
var exitLabelText       = 'Exit';
var game                = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
var goldLabelSize       = 40;
var healthLabelText     = 'Health';
var hpCards             = [];
var hpGroup             = {};
var hpSpot              = {};
var lootArray           = [];
var leftMargin          = 10;
var lootLabelText       = 'Loot';
var mainDialog          = {};
var actionButtons       = [];
var actionLabels        = [];
var paymentCards        = [];
var pile1Cards          = [];
var pile2Cards          = [];
var pile3Cards          = [];
var pile4Cards          = [];
var pile5Cards          = [];
var pile1Spot           = {x: 50, y: 50};
var pile2Spot           = {};
var pile3Spot           = {};
var pile4Spot           = {};
var pile5Spot           = {};
var playAreaControls    = [];
var preloadKeys         = {};
var redTextStyle        = { font: "32px Arial", fill: "#FF0000", align: "center" };
var smallRedTextStyle   = { font: "18px Arial", fill: "#FF0000", align: "left" };
var spriteGroupArray    = [];
var suits               = { clubs: 'c', diamonds: 'd', hearts: 'h', spades: 's' };
var topMargin           = 10;
var transactionCard     = null;
var transactionMargin   = 25;
var transactionState    = '';
var transactionStates   = {buying: 'buying', trading: 'trading', meleeing: 'meleeing'};
var weaponCard          = null;
var weaponLabelText     = 'Weapon';
var weaponSpot          = {};

function getTopCards(){
    var topCards = [null, null, null, null, null];
    if(pile1Cards.length > 0)
        topCards[0] = pile1Cards[pile1Cards.length - 1];
    if(pile2Cards.length > 0)
        topCards[1] = pile2Cards[pile2Cards.length - 1];
    if(pile3Cards.length > 0)
        topCards[2] = pile3Cards[pile3Cards.length - 1];
    if(pile4Cards.length > 0)
        topCards[3] = pile4Cards[pile4Cards.length - 1];
    if(pile5Cards.length > 0)
        topCards[4] = pile5Cards[pile5Cards.length - 1];
    return topCards;
}

function assessTopCards(){
    var topCards = getTopCards();
    var reassess = false;
    var reassessTime = 0;
    var redCount = 0;
    var options = 0;
    var victory = false;
    var existingCards = 0;
    for(var i = 0; i < topCards.length; i++){
        if(topCards[i]){
            existingCards = existingCards + 1;
        }
    }
    if(existingCards > 0){
        for(var i = 0; i < topCards.length; i++){
            if(topCards[i]){
                var card = topCards[i];
                if(!card.showing)
                    card.flip();
                var pile = null;
                if(i == 0)
                    pile = cardArrayIndexes.pile1;
                if(i == 1)
                    pile = cardArrayIndexes.pile2;
                if(i == 2)
                    pile = cardArrayIndexes.pile3;
                if(i == 3)
                    pile = cardArrayIndexes.pile4;
                if(i == 4)
                    pile = cardArrayIndexes.pile5;
                if(card.suit == suits.diamonds || card.suit == suits.hearts){
                    var baseTime = (redCount + 1) * 500;
                    game.time.events.add(baseTime, collectRedCard, {card: card, pile: pile});
                    if(cardArrays[pile][cardArrays[pile].length - 2]){
                        game.time.events.add(baseTime + 500, cardArrays[pile][cardArrays[pile].length - 2].flip, cardArrays[pile][cardArrays[pile].length - 2]);
                    }
                    redCount = redCount + 1;
                    reassess = true;
                    reassessTime = baseTime;
                }
            }else{
                if(i < 3){
                    if(lootArray[i].alpha == 0){
                        lootArray[i].alpha = 1;
                    }
                }if(i == 3 || i == 4){
                    if(exitArray[i - 3].alpha == 0){
                        exitArray[i - 3].alpha = 1;
                        exitArray[i - 3].animations.play('glow',10,true);
                    }
                }
            }
        }
    }else{
        // Player has cleared the deck
        clearActionButtons();
        lootArray[0].alpha = 1;
        lootArray[1].alpha = 1;
        lootArray[2].alpha = 1;
        exitArray[0].alpha = 1;
        exitArray[0].animations.play('glow',10,true);
        exitArray[1].alpha = 1;
        exitArray[1].animations.play('glow',10,true);
    var instructionLabel = game.add.bitmapText(mainDialog.spriteGroup.children[0].x + leftMargin, mainDialog.spriteGroup.children[0].y + topMargin, preloadKeys.dialogFont,'Victory!',dialogTextSize);
        actionLabels.push(instructionLabel);
        victory = true;
        var diamondCount = diamondCards.length;
        var hpCount = hpCards.length;
        var weaponCount = 0;
        if(weaponCard)
            weaponCount = 1;
        game.time.events.add(2000, function(){
            if(weaponCard)
                fadeAndBurnCard(weaponCard);
            if(diamondCards.length > 0){
                for(var i = 0; i < diamondCards.length; i++){
                    game.time.events.add((i + 1) * 100,function(){
                        fadeAndBurnCard(this);
                    },diamondCards[i]);
                }
            }
            if(hpCards.length > 0){
                for(var i = 0; i < hpCards.length; i++){
                    game.time.events.add((i + 1) * 100 + (100 * diamondCount),function(){
                        fadeAndBurnCard(this);
                    },hpCards[i]);
                }
            }
        },this);
        
        game.time.events.add(3000 + hpCount * 100 + diamondCount * 100 + weaponCount * 100,function(){
            clearPlayArea();
        },this);
    }
    if(!victory){
        if(reassess){
            game.time.events.add(reassessTime + 500, assessTopCards, this);
        }else{
            if(!mainDialog){
                var dialogY = 420;
                mainDialog = new DialogBox(leftMargin * 2,dialogY,425,160,'');
                var dialogTween = game.add.tween(mainDialog.spriteGroup).from( { width: 0, height: 0, x: leftMargin, y:dialogY }, 250, Phaser.Easing.Linear.In, true);
                dialogTween.onComplete.add(function(){
                        layoutActionButtons();    
                    }, this);
            }else{
                options = layoutActionButtons();
                if(options == 0){
                    if(pile4Cards.length == 0 || pile5Cards.length == 0){
                        clearActionButtons();
                        var instructionLabel = game.add.bitmapText(mainDialog.spriteGroup.children[0].x + leftMargin, mainDialog.spriteGroup.children[0].y + topMargin, preloadKeys.dialogFont,'Out of moves - You escaped!',dialogTextSize);
                        actionLabels.push(instructionLabel);
                        clearCards();
                        clearPlayArea();
                    }else{
                        clearActionButtons();
                        var instructionLabel = game.add.bitmapText(mainDialog.spriteGroup.children[0].x + leftMargin, mainDialog.spriteGroup.children[0].y + topMargin, preloadKeys.dialogFont,'Out of moves - You were trapped!',dialogTextSize);
                        actionLabels.push(instructionLabel);
                        clearCards();
                        clearPlayArea();
                    }
                }
            }
        }
    }
}

function clearPlayArea(){
    clearActionButtons();
    mainDialog.spriteGroup.destroy();
    mainDialog = null;
    for(var i = 0; i < playAreaControls.length; i++){
        playAreaControls[i].destroy();
    }
    mainDialog = new DialogBox(leftMargin * 3,leftMargin * 3, game.world.width - leftMargin * 6, game.world.height - leftMargin * 6,'');
    var dialogTween = game.add.tween(mainDialog.spriteGroup).from( { width: 0, height: 0, x: game.world.width - leftMargin * 6, y:game.world.height - leftMargin * 6 }, 250, Phaser.Easing.Linear.In, true);
    dialogTween.onComplete.add(function(){
        var summaryLabel = game.add.bitmapText(game.world.centerX, 200, preloadKeys.dialogFont,'Summary',dialogTextSize);
        summaryLabel.anchor.setTo(0.5);
        actionLabels.push(summaryLabel);
    }, this);
}

function clearCards(){
    for(var i = 0; i < cardArrays.length; i++){
        for(var j = 0; j < cardArrays[i].length; j++){
            if(!cardArrays[i][j].showing)
                cardArrays[i][j].flip();
            fadeAndBurnCard(cardArrays[i][j]);
        }
    }
}

function addCardToGroup(arrayIndex, card){
    cardArrays[arrayIndex].push(card);
}

function bumpCardLeft(card){
    card.spriteGroup.x = card.spriteGroup.x - transactionMargin;
}

function bumpCardUp(card){
    card.spriteGroup.y = card.spriteGroup.y - transactionMargin; 
}

function burnCard(card){
    for(var i = 0; i < spriteGroupArray.length; i++){
        var spriteGroup = spriteGroupArray[i];
        spriteGroup.remove(card.spriteGroup);
    }
    unDeckCard(card);
    for(var i = 0; i < card.spriteGroup.children.length; i++){
        card.spriteGroup.children[i].kill();
    }
    if(card.suit == suits.diamonds){
        sortRedGroup(suits.diamonds);
        displayDiamondGroup();
    }if(card.suit == suits.hearts){
        sortRedGroup(suits.hearts);
        displayHpGroup();
    }
}       

function unDeckCard(card){
    for(var i = 0; i < cardArrays.length; i++){
        var cardArray = cardArrays[i];
        var position = cardArray.indexOf(card);
        if(position > -1)
            cardArray.splice(position,1);
    }
}

function cancelPurchase(){
    if(transactionCard){
        transactionCard.spriteGroup.y = transactionCard.spriteGroup.y + transactionMargin;
        transactionCard = null;
    }
    for(var i = 0; i < paymentCards.length; i++){
//                if(cards.indexOf(paymentCards[i])>-1){
//                    paymentCards[i].spriteGroup.y = paymentCards[i].spriteGroup.y + cardBumpAmount;
        if(diamondCards.indexOf(paymentCards[i])>-1){
            paymentCards[i].spriteGroup.x = paymentCards[i].spriteGroup.x + cardBumpAmount;
        }
        paymentCards.splice(paymentCards.indexOf(paymentCards[i],1));
        i = i - 1;
    }
    transactionState = null;
}

function clearActionButtons(){
    for(var i = 0; i < actionLabels.length; i++){
        actionLabels[i].destroy();
    }
    for(var i = 0; i < actionButtons.length; i++){
        actionButtons[i].destroy();
    }
    actionLabels = [];
    actionButtons = [];
}

function completePurchase(callback, context){
    for(var i = 0; i < paymentCards.length; i++){
        var card = paymentCards[i];
        fadeAndBurnCard(card);
        paymentCards.splice(paymentCards.indexOf(card),1);

        i = i - 1;
    }
    if(transactionState == transactionStates.trading){
        fadeAndBurnCard(weaponCard);
        weaponCard = transactionCard;
        if(pile1Cards.indexOf(transactionCard) > -1)
            pile1Cards.splice(pile1Cards.indexOf(weaponCard),1);
        if(pile2Cards.indexOf(transactionCard) > -1)
            pile2Cards.splice(pile2Cards.indexOf(weaponCard),1);
        if(pile3Cards.indexOf(transactionCard) > -1)
            pile3Cards.splice(pile3Cards.indexOf(weaponCard),1);
        if(pile4Cards.indexOf(transactionCard) > -1)
            pile4Cards.splice(pile4Cards.indexOf(weaponCard),1);
        if(pile5Cards.indexOf(transactionCard) > -1)
            pile5Cards.splice(pile5Cards.indexOf(weaponCard),1);
        transactionCard = null;
        var finalTween = game.add.tween(weaponCard.spriteGroup).to( { x: weaponSpot.x, y: weaponSpot.y}, defaultCardMoveTime, Phaser.Easing.Circular.InOut, true);
    }
    if(transactionState == transactionStates.buying){
        var completeTransaction = true;
        if(weaponCard){
            if(weaponCard.value < transactionCard.value){
                fadeAndBurnCard(weaponCard);
            }else{
                if(pile1Cards.indexOf(transactionCard) > -1)
                pile1Cards.splice(pile1Cards.indexOf(transactionCard),1);
            if(pile2Cards.indexOf(transactionCard) > -1)
                pile2Cards.splice(pile2Cards.indexOf(transactionCard),1);
            if(pile3Cards.indexOf(transactionCard) > -1)
                pile3Cards.splice(pile3Cards.indexOf(transactionCard),1);
            if(pile4Cards.indexOf(transactionCard) > -1)
                pile4Cards.splice(pile4Cards.indexOf(transactionCard),1);
            if(pile5Cards.indexOf(transactionCard) > -1)
                pile5Cards.splice(pile5Cards.indexOf(transactionCard),1);
                fadeAndBurnCard(transactionCard);
                transactionCard = null;
                completeTransaction = false;
            }
        }
        if(completeTransaction){
            weaponCard = transactionCard;
            if(pile1Cards.indexOf(transactionCard) > -1)
                pile1Cards.splice(pile1Cards.indexOf(weaponCard),1);
            if(pile2Cards.indexOf(transactionCard) > -1)
                pile2Cards.splice(pile2Cards.indexOf(weaponCard),1);
            if(pile3Cards.indexOf(transactionCard) > -1)
                pile3Cards.splice(pile3Cards.indexOf(weaponCard),1);
            if(pile4Cards.indexOf(transactionCard) > -1)
                pile4Cards.splice(pile4Cards.indexOf(weaponCard),1);
            if(pile5Cards.indexOf(transactionCard) > -1)
                pile5Cards.splice(pile5Cards.indexOf(weaponCard),1);
            transactionCard = null;
            var finalTween = game.add.tween(weaponCard.spriteGroup).to( { x: weaponSpot.x, y: weaponSpot.y}, defaultCardMoveTime, Phaser.Easing.Circular.InOut, true);
        }
        transactionState = null;
        paymentCards = [];
        sortRedGroup(suits.diamonds);
        displayDiamondGroup();
    }if(transactionState == transactionStates.meleeing){
        fadeAndBurnCard(transactionCard);
        transactionState = null;
        paymentCards = [];
        sortRedGroup(suits.hearts);
        displayHpGroup();
    }
    if(callback){
        if(completeTransaction){
            finalTween.onComplete.add(function(){
                game.time.events.add(500, callback, context);
            }, context);
        }else{
            game.time.events.add(500, callback, context);
        }
    }
}

function collectRedCard(){
    var card = this.card;
    var pile = this.pile;
    if(card.suit == suits.diamonds){
        //addCardToGroup(cardArrayIndexes.diamondCards,card);
        diamondGroup.add(card.spriteGroup);
        diamondCards.push(card);
        sortRedGroup(suits.diamonds);
        displayDiamondGroup();
    }if(card.suit == suits.hearts){
        //addCardToGroup(cardArrayIndexes.hpCards,card);
        hpGroup.add(card.spriteGroup);
        hpCards.push(card);
        sortRedGroup(suits.hearts);
        displayHpGroup();
    }
    removeCardFromGroup(pile, card);
}

function create() {
    var tableBg = game.add.image(0,0,preloadKeys.tableBg);
    mainDialog = new DialogBox(leftMargin * 2,leftMargin * 2,game.world.width - leftMargin * 4, game.world.height - leftMargin * 4,'');
    var tweenIn = game.add.tween(mainDialog.spriteGroup).from( { width: 0, height: 0, x: leftMargin * 2, y: leftMargin * 2 }, 500, Phaser.Easing.Linear.In, true);
    tweenIn.onComplete.add(function(){
        var titleText = game.add.bitmapText(game.world.centerX, 200,preloadKeys.dialogFont,'Loot Solitaire',dialogTextSize);
        titleText.anchor.setTo(0.5);
        actionLabels.push(titleText);
        
        var pendingText = game.add.bitmapText(game.world.centerX, titleText.bottom + leftMargin * 2, preloadKeys.dialogFont, '(Artwork pending)',dialogTextSize);
        pendingText.anchor.setTo(0.5);
        actionLabels.push(pendingText);
        
        var newGameText = game.add.bitmapText(game.world.centerX, 400, preloadKeys.dialogFont, 'New Game', dialogTextSize);
        newGameText.anchor.setTo(0.5);
        actionLabels.push(newGameText);
        
        var newGameButton = game.add.button(newGameText.x, newGameText.y, newGameText.key, newGameClick, this);
        newGameButton.anchor.setTo(0.5);
        newGameButton.width = newGameText.width;
        newGameButton.height = newGameText.height;
        actionButtons.push(newGameButton);
    },this);
}

function newGameClick(){
    clearActionButtons();
    mainDialog.spriteGroup.destroy();
    mainDialog = null;
    shuffleAndDeal();
}

function shuffleAndDeal(){
    
    var cards = [];

//    game.stage.backgroundColor = backgroundColor;

    var cardImage = game.cache.getImage(preloadKeys.cardBack);
//            var exit = game.add.sprite(game.world.width - 100, 0, preloadKeys.exit);
//            var exitGlow = exit.animations.add('glow',[0,1,2,3,4,5,6,7,8,8,7,6,5,4,3,2,1]);
//            exit.animations.play('glow',10,true);

    weaponSpot.x = game.world.width - leftMargin * 3 - cardImage.width * 3;
    weaponSpot.y = game.world.height - topMargin * 5 - cardImage.height;
    playAreaControls.push(game.add.image(weaponSpot.x, weaponSpot.y, preloadKeys.cardSpot));
    var weaponLabel = game.add.bitmapText(weaponSpot.x + cardImage.width / 2, weaponSpot.y + cardImage.height + topMargin * 2, preloadKeys.goldFont, weaponLabelText, goldLabelSize);
    weaponLabel.anchor.setTo(0.5);
    playAreaControls.push(weaponLabel);

    diamondSpot.x = weaponSpot.x + cardImage.width + leftMargin;
    diamondSpot.y = weaponSpot.y;
    playAreaControls.push(game.add.image(diamondSpot.x, diamondSpot.y, preloadKeys.cardSpot));
    var currencyLabel = game.add.bitmapText(weaponLabel.x + cardImage.width + leftMargin, weaponLabel.y, preloadKeys.goldFont, currencyLabelText, goldLabelSize);
    currencyLabel.anchor.setTo(0.5);
    playAreaControls.push(currencyLabel);

    hpSpot.x = diamondSpot.x + cardImage.width + leftMargin;
    hpSpot.y = diamondSpot.y;
    playAreaControls.push(game.add.image(hpSpot.x, hpSpot.y, preloadKeys.cardSpot));
    var healthLabel = game.add.bitmapText(currencyLabel.x + cardImage.width + leftMargin, currencyLabel.y, preloadKeys.goldFont, healthLabelText, goldLabelSize);
    healthLabel.anchor.setTo(0.5);
    playAreaControls.push(healthLabel);

    playAreaControls.push(game.add.image(pile1Spot.x, pile1Spot.y, preloadKeys.cardSpot));
    var loot1 = game.add.image(pile1Spot.x, pile1Spot.y, preloadKeys.loot);
    loot1.alpha = 0;
    playAreaControls.push(loot1);
    var pile1Label = game.add.bitmapText(pile1Spot.x + cardImage.width / 2, pile1Spot.y - topMargin * 2, preloadKeys.goldFont, lootLabelText, goldLabelSize);
    pile1Label.anchor.setTo(0.5);
    playAreaControls.push(pile1Label);

    pile2Spot.x = pile1Spot.x + cardImage.width + leftMargin * 2;
    pile2Spot.y = pile1Spot.y;
    playAreaControls.push(game.add.image(pile2Spot.x, pile2Spot.y, preloadKeys.cardSpot));
    var loot2 = game.add.image(pile2Spot.x, pile2Spot.y, preloadKeys.loot);
    loot2.alpha = 0;
    playAreaControls.push(loot2);
    var pile2Label = game.add.bitmapText(pile2Spot.x + cardImage.width / 2, pile2Spot.y - topMargin * 2, preloadKeys.goldFont, lootLabelText, goldLabelSize);
    pile2Label.anchor.setTo(0.5);
    playAreaControls.push(pile2Label);

    pile3Spot.x = pile2Spot.x + cardImage.width + leftMargin * 2;
    pile3Spot.y = pile1Spot.y;
    playAreaControls.push(game.add.image(pile3Spot.x, pile3Spot.y, preloadKeys.cardSpot));
    var loot3 = game.add.image(pile3Spot.x, pile3Spot.y, preloadKeys.loot);
    loot3.alpha = 0;
    playAreaControls.push(loot3);
    var pile3Label = game.add.bitmapText(pile3Spot.x + cardImage.width / 2, pile3Spot.y - topMargin * 2, preloadKeys.goldFont, lootLabelText, goldLabelSize);
    pile3Label.anchor.setTo(0.5);
    playAreaControls.push(pile3Label);

    lootArray = [loot1,loot2,loot3];

    pile4Spot.x = pile1Spot.x + leftMargin + cardImage.width / 2;
    pile4Spot.y = pile1Spot.y + cardImage.height * 1.3 + topMargin * 3;
    playAreaControls.push(game.add.image(pile4Spot.x, pile4Spot.y, preloadKeys.cardSpot));
    var exit1 = game.add.sprite(pile4Spot.x, pile4Spot.y, preloadKeys.exit);
    playAreaControls.push(exit1);
    var exit1Glow = exit1.animations.add('glow',[0,1,2,3,4,5,6,7,8,8,7,6,5,4,3,2,1]);
    var pile4Label = game.add.bitmapText(pile4Spot.x + cardImage.width / 2, pile4Spot.y - topMargin * 2, preloadKeys.goldFont, exitLabelText, goldLabelSize);
    exit1.alpha = 0;
    pile4Label.anchor.setTo(0.5);
    playAreaControls.push(pile4Label);

    pile5Spot.x = pile4Spot.x + cardImage.width + leftMargin * 2;
    pile5Spot.y = pile4Spot.y;
    playAreaControls.push(game.add.image(pile5Spot.x, pile5Spot.y, preloadKeys.cardSpot));
    var exit2 = game.add.sprite(pile5Spot.x, pile5Spot.y, preloadKeys.exit);
    playAreaControls.push(exit2);
    var exit2Glow = exit2.animations.add('glow',[0,1,2,3,4,5,6,7,8,8,7,6,5,4,3,2,1]);
    exit2.alpha = 0;
    var pile5Label = game.add.bitmapText(pile5Spot.x + cardImage.width / 2, pile5Spot.y - topMargin * 2, preloadKeys.goldFont, exitLabelText, goldLabelSize);
    pile5Label.anchor.setTo(0.5);
    exitArray = [exit1, exit2];
    playAreaControls.push(pile5Label);

    displayGroup = game.add.group();
    hpGroup = game.add.group();
    diamondGroup = game.add.group();
    spriteGroupArray = [displayGroup, hpGroup, diamondGroup];
    cardArrays = [pile1Cards, pile2Cards, pile3Cards, pile4Cards, pile5Cards, diamondCards, hpCards, cards];
    for(var i = 0; i < 4; i++){
        var suit = suits.clubs;
        if(i == 1){
            suit = suits.diamonds;
        }else if(i == 2){
            suit = suits.hearts;
        }else if(i == 3){
            suit = suits.spades;
        }
        for(var j = 2; j < 15; j++){
            var card = new Card(j,suit);
            cards.push(card);

            var cardSprite = card.spriteGroup.children[0];

        }
    }
    shuffle(cards);

    //Pile 1
    while(pile1Cards.length < 10){
        var card = cards[0];
        var i = 0;
        if(pile1Cards.length > 0)
            i = pile1Cards.length - 1;
        game.add.tween(card.spriteGroup).to( { x: pile1Spot.x, y: pile1Spot.y + i * 3 }, defaultCardMoveTime + i * 50, Phaser.Easing.Circular.InOut, true);
        removeCardFromGroup(cardArrayIndexes.cards,card);
        addCardToGroup(cardArrayIndexes.pile1,card);
    }
    pile1Cards[pile1Cards.length - 1].flip();

    //Pile 2
    while(pile2Cards.length < 10){
        var card = cards[0];
        var i = 0;
        if(pile2Cards.length > 0)
            i = pile2Cards.length - 1;
        game.add.tween(card.spriteGroup).to( { x: pile2Spot.x, y: pile2Spot.y + i * 3 }, defaultCardMoveTime + i * 60, Phaser.Easing.Circular.InOut, true);
        removeCardFromGroup(cardArrayIndexes.cards,card);
        addCardToGroup(cardArrayIndexes.pile2,card);
    }
    pile2Cards[pile2Cards.length - 1].flip();

    //Pile 3
    while(pile3Cards.length < 10){
        var card = cards[0];
        var i = 0;
        if(pile3Cards.length > 0)
            i = pile3Cards.length - 1;
        game.add.tween(card.spriteGroup).to( { x: pile3Spot.x, y: pile3Spot.y + i * 3}, defaultCardMoveTime + i * 70, Phaser.Easing.Circular.InOut, true);
        removeCardFromGroup(cardArrayIndexes.cards,card);
        addCardToGroup(cardArrayIndexes.pile3,card);
    }
    pile3Cards[pile3Cards.length - 1].flip();

    //Pile 4
    while(pile4Cards.length < 11){
        var card = cards[0];
        var i = 0;
        if(pile4Cards.length > 0)
            i = pile4Cards.length - 1;
        game.add.tween(card.spriteGroup).to( { x: pile4Spot.x, y: i * 3 + pile4Spot.y }, defaultCardMoveTime + i * 80, Phaser.Easing.Circular.InOut, true);
        removeCardFromGroup(cardArrayIndexes.cards,card);
        addCardToGroup(cardArrayIndexes.pile4,card);
    }
    pile4Cards[pile4Cards.length - 1].flip();

    //Pile 5
    while(pile5Cards.length < 11){
        var card = cards[0];
        var i = 0;
        if(pile5Cards.length > 0)
            i = pile5Cards.length - 1;
        var lastTween = game.add.tween(card.spriteGroup).to( { x: pile5Spot.x, y: i * 3 + pile5Spot.y }, defaultCardMoveTime + i * 90, Phaser.Easing.Circular.InOut, true);
        removeCardFromGroup(cardArrayIndexes.cards,card);
        addCardToGroup(cardArrayIndexes.pile5,card);
        if(i == 9){
            lastTween.onComplete.add(function(){
                assessTopCards();    
            }, this);
        }
    }
    pile5Cards[pile5Cards.length - 1].flip();

    //assessTopCards();
}

function diamondClick(){
    if(this.card.showing){
        if(transactionState != transactionStates.buying){
            if(diamondCards.indexOf(this.card) == -1){
                diamondCards.push(this.card);
                cards.splice(cards.indexOf(this.card),1);
                diamondGroup.add(this.card.spriteGroup);
                sortRedGroup(suits.diamonds);
                displayDiamondGroup();
            }
        }else{
            paymentCards.push(this.card);
            if(getCardsSum(paymentCards) >= transactionCard.value){
                completePurchase();
            }else{
                if(cards.indexOf(this.card) >= 0)
                    bumpCardUp(this.card);
                if(diamondCards.indexOf(this.card) >= 0)
                    bumpCardLeft(this.card);
            }
        }
    }else{
        this.card.flip();
    }            
}

function displayDiamondGroup(){
    for(var i = 0; i < diamondCards.length; i++){
        diamondCards[i].setLocation(diamondSpot.x, diamondSpot.y - (diamondCards.length - 1) * 30 + i * 30);
        if(i < diamondCards.length - 1){
            var label = diamondCards[i].spriteGroup.children[1];
            label.setStyle(smallRedTextStyle);
            label.anchor.set(0,0);
            label.x = 8;
            label.y = 8;
        }else{
            var label = diamondCards[i].spriteGroup.children[1];
            label.setStyle(redTextStyle);
            label.anchor.set(0.5);
            label.x = diamondCards[i].spriteGroup.children[0].width / 2;
            label.y = diamondCards[i].spriteGroup.children[0].height / 2;
        }
    }            
}

function displayHpGroup(){
    for(var i = 0; i < hpCards.length; i++){
        hpCards[i].setLocation(hpSpot.x, hpSpot.y - (hpCards.length - 1) * 30 + i * 30);
        if(i < hpCards.length - 1){
            var label = hpCards[i].spriteGroup.children[1];
            label.setStyle(smallRedTextStyle);
            label.anchor.set(0,0);
            label.x = 8;
            label.y = 8;
        }else{
            var label = hpCards[i].spriteGroup.children[1];
            label.setStyle(redTextStyle);
            label.anchor.set(0.5);
            label.x = hpCards[i].spriteGroup.children[0].width / 2;
            label.y = hpCards[i].spriteGroup.children[0].height / 2;
        }
    }
}

function enemyClick(){
    if(this.card.showing){
        if(transactionState == transactionStates.buying){
            cancelPurchase();
        }else{
            if(transactionState == transactionStates.meleeing){
                cancelPurchase();
            }
            var allowMelee = true;
            if(weaponCard){
                if(weaponCard.value >= this.card.value){
                    fadeAndBurnCard(this.card);

                    allowMelee = false;
                }
            }if(allowMelee && getCardsSum(hpCards) >= this.card.value){
                bumpCardUp(this.card);
                transactionState = transactionStates.meleeing;
                transactionCard = this.card;
            }
        }
    }else{
        this.card.flip();
    }
}

function fadeAndBurnCard(card){
    unDeckCard(card);
    var tween = game.add.tween(card.spriteGroup).to( { alpha: 0, x: card.spriteGroup.x - 50, y: card.spriteGroup.y - 50}, defaultCardMoveTime, Phaser.Easing.Circular.Out, true);
    tween.onComplete.add(function(){
        burnCard(card);
    }, this);
}

function getCardLocation(card){
    var groupIndex = -1;
    var cardIndex = -1;
    for(var i = 0; i < cardArrays.length; i++){
        var thisIndex = cardArrays[i].indexOf(card);
        if(thisIndex > -1){
            groupIndex = i;
            cardIndex = thisIndex;
        }
    }
    return [groupIndex, cardIndex];
}

function getCardsSum(cardArray){
    var total = 0;
    for(var i = 0; i < cardArray.length; i++){
        total = total + cardArray[i].value;
    }
    return total;
}

function getValueLabelText(value) {
    if(value < 11){
        return value.toString();
    }else if(value == 11){
        return 'J';
    }else if(value == 12){
        return 'Q';
    }else if(value == 13){
        return 'K';
    }else if(value == 14){
        return 'A';
    }
}

function hpClick(){
    if(this.card.showing){
        if(transactionState == transactionStates.buying){
            cancelPurchase();
        }else if(transactionState == transactionStates.meleeing){
            paymentCards.push(this.card);
            if(getCardsSum(paymentCards) >= transactionCard.value){
                completePurchase();
            }else{
                if(cards.indexOf(this.card)>=0)
                    bumpCardUp(this.card);
                if(hpCards.indexOf(this.card)>=0)
                    bumpCardLeft(this.card);
            }
        }else{
            if(cards.indexOf(this.card)>-1){
                hpCards.push(this.card);
                cards.splice(cards.indexOf(this.card),1);
                hpGroup.add(this.card.spriteGroup);
                sortRedGroup('h');
                displayHpGroup();
            }
        }
    }else{
        this.card.flip();
    }
}

function layoutActionButtons(){
    var canWeaponAttack = false;
    var canMeleeAttack = false;
    var canPurchaseWeapon = false;
    var canTradeWeapon = false;
    var options = 0;

    var weaponText = game.add.bitmapText(mainDialog.spriteGroup.children[0].x + leftMargin, mainDialog.spriteGroup.children[0].y + leftMargin,preloadKeys.dialogFont,'Weapon Attack',dialogTextSize);
    var meleeText = game.add.bitmapText(weaponText.x, weaponText.bottom + leftMargin,preloadKeys.dialogFont,'Melee Attack',dialogTextSize);
    var purchaseText = game.add.bitmapText(weaponText.x, meleeText.bottom + leftMargin,preloadKeys.dialogFont,'Purchase Weapon',dialogTextSize);
    var tradeText = game.add.bitmapText(weaponText.x, purchaseText.bottom + leftMargin,preloadKeys.dialogFont,'Trade Weapon',dialogTextSize);

    var topCards = getTopCards();
    var currency = getCardsSum(diamondCards);
    var hp = getCardsSum(hpCards);
    for(var i = 0; i < topCards.length; i++){
        if(topCards[i]){
            if(topCards[i].suit == suits.clubs){
                if(weaponCard){
                    if(weaponCard.value >= topCards[i].value){
                        canWeaponAttack = true;
                        options = options + 1;
                    }
                }
                if(hp >= topCards[i].value){
                    canMeleeAttack = true;
                    options = options + 1;
                }
            }
            if(topCards[i].suit == suits.spades){
                if(currency >= topCards[i].value){
                    canPurchaseWeapon = true;
                    options = options + 1;
                }
                if(weaponCard){
                    if(topCards[i].suit == suits.spades && weaponCard.value >= topCards[i].value){
                        canTradeWeapon = true;
                        options = options + 1;
                    }
                }
            }
        }
    }

    if(canWeaponAttack){
        var weaponButton = game.add.button(weaponText.x, weaponText.y, weaponText.key, weaponAttackClick, this);
        weaponButton.width = weaponText.width;
        weaponButton.height = weaponText.height;
        actionButtons.push(weaponButton);
    }else{
        weaponText.alpha = disabledButtonAlpha;
    }

    if(canMeleeAttack){
        var meleeButton = game.add.button(meleeText.x, meleeText.y, meleeText.key, meleeAttackClick, this);
        meleeButton.width = weaponText.width;
        meleeButton.height = weaponText.height;
        actionButtons.push(meleeButton);
    }else{
        meleeText.alpha = disabledButtonAlpha;
    }

    if(canPurchaseWeapon){ 
        var purchaseButton = game.add.button(purchaseText.x, purchaseText.y, purchaseText.key, purchaseWeaponClick, this);
        purchaseButton.width = purchaseText.width;
        purchaseButton.height = purchaseText.height;
        actionButtons.push(purchaseButton);
    }else{
        purchaseText.alpha = disabledButtonAlpha;
    }

    if(canTradeWeapon){
        var tradeButton = game.add.button(tradeText.x, tradeText.y, tradeText.key, tradeWeaponClick, this);
        tradeButton.width = tradeText.width;
        tradeButton.height = tradeText.height;
        actionButtons.push(tradeButton);
    }else{
        tradeText.alpha = disabledButtonAlpha;
    }

    actionLabels = [purchaseText, meleeText, weaponText, tradeText];

    return options;
}

function weaponAttackClick(){
    clearActionButtons();
    var tweenOut = game.add.tween(weaponCard.spriteGroup).to( { x: weaponCard.spriteGroup.x - cardBumpAmount * 2, y: weaponCard.spriteGroup.y - cardBumpAmount * 2}, 100, Phaser.Easing.Linear.In, false);
    var tweenIn = game.add.tween(weaponCard.spriteGroup).to( { x: weaponCard.spriteGroup.x, y: weaponCard.spriteGroup.y}, 100, Phaser.Easing.Linear.In, false);
    tweenOut.chain(tweenIn);
    tweenIn.onComplete.add(function(){
        var topCards = getTopCards();
        for(var i = 0; i < topCards.length; i++){
            var card = topCards[i];
            var pile = cardArrays[i];
            var nextCard = pile[pile.length - 2];
            if(card){
                if(card.suit == suits.clubs && card.value <= weaponCard.value){
                    var slash = game.add.sprite(card.spriteGroup.x, card.spriteGroup.y, preloadKeys.slash);
                    var slashAnimation = slash.animations.add('slashing',[0,1,2]);
                    slash.animations.play('slashing',10,false);
                    slash.events.onAnimationComplete.add(function(){
                        fadeAndBurnCard(this.card);
                        if(this.nextCard){
                            game.time.events.add(500, this.nextCard.flip, this.nextCard);
                        }
                        this.slash.destroy();
                    },{card:card, nextCard:nextCard, slash:slash});
                }if(card.suit == suits.clubs && card.value > weaponCard.value){
                    var blockOut = game.add.tween(card.spriteGroup).to( { x: card.spriteGroup.x - cardBumpAmount}, 100, Phaser.Easing.Linear.In, false);
    var blockIn = game.add.tween(card.spriteGroup).to( { x: card.spriteGroup.x}, 100, Phaser.Easing.Linear.In, false);
    blockOut.chain(blockIn);
                    blockOut.start();
                }
            }
        }
        game.time.events.add(1000, assessTopCards); 
    }, this);
    tweenOut.start();
}

function meleeAttackClick(){
    clearActionButtons();
    var health = getCardsSum(hpCards);
    var instructionLabel = game.add.bitmapText(mainDialog.spriteGroup.children[0].x + leftMargin, mainDialog.spriteGroup.children[0].y + topMargin, preloadKeys.dialogFont,'Select an enemy to attack:',dialogTextSize);
    actionLabels.push(instructionLabel);
    var topCards = getTopCards();

    for(var i = 0; i < topCards.length; i++){
        var card = topCards[i];
        if(card){
            if(card.suit == suits.clubs && card.value <= health){
                if(actionButtons.length == 0){
                    var x = mainDialog.spriteGroup.children[0].x + leftMargin;
                }else{
                    x = actionButtons[actionButtons.length - 1].right + leftMargin * 2;
                }
                var cardLabel = game.add.bitmapText(x, instructionLabel.bottom + topMargin, preloadKeys.dialogFont,'LVL '.concat(getValueLabelText(card.value)),dialogTextSize);
                actionLabels.push(cardLabel);
                var cardButton = game.add.button(cardLabel.x, cardLabel.y, cardLabel.key, enemySelectionClick, card);
                cardButton.width = cardLabel.width; 
                cardButton.height = cardLabel.height;
                actionButtons.push(cardButton);
            }
        }
    }
    var cancelLabel = game.add.bitmapText(instructionLabel.x, actionButtons[0].bottom + topMargin, preloadKeys.dialogFont,'Cancel',dialogTextSize);
    actionLabels.push(cancelLabel);
    var cancelButton = game.add.button(cancelLabel.x, cancelLabel.y, cancelLabel.key, cancelClick, this);
    actionButtons.push(cancelButton);
    cancelButton.width = cancelLabel.width;
    cancelButton.height = cancelLabel.height;
}

function tradeWeaponClick(){
    clearActionButtons();
    var instructionLabel = game.add.bitmapText(mainDialog.spriteGroup.children[0].x + leftMargin, mainDialog.spriteGroup.children[0].y + leftMargin,preloadKeys.dialogFont,'Select a weapon to acquire:',dialogTextSize);
    actionLabels.push(instructionLabel);
    var topCards = getTopCards();

    for(var i = 0; i < topCards.length; i++){
        var card = topCards[i];
        if(card){
            if(card.suit == suits.spades && card.value <= weaponCard.value){
                var x;
                if(actionButtons.length == 0){
                    var x = mainDialog.spriteGroup.children[0].x + leftMargin;
                }else{
                    x = actionButtons[actionButtons.length - 1].right + leftMargin * 2;
                }
                var cardLabel = game.add.bitmapText(x, instructionLabel.bottom + topMargin, preloadKeys.dialogFont,'LVL '.concat(getValueLabelText(card.value)),dialogTextSize);
                actionLabels.push(cardLabel);
                var cardButton = game.add.button(cardLabel.x, cardLabel.y, cardLabel.key, tradeSelectionClick, card);
                cardButton.width = cardLabel.width; 
                cardButton.height = cardLabel.height;
                actionButtons.push(cardButton);
            }
        }
    }

    var cancelLabel = game.add.bitmapText(instructionLabel.x, actionButtons[0].bottom + topMargin, preloadKeys.dialogFont,'Cancel',dialogTextSize);
    actionLabels.push(cancelLabel);
    var cancelButton = game.add.button(cancelLabel.x, cancelLabel.y, cancelLabel.key, cancelClick, this);
    actionButtons.push(cancelButton);
    cancelButton.width = cancelLabel.width;
    cancelButton.height = cancelLabel.height;
}

function tradeSelectionClick(){
    clearActionButtons();
    transactionCard = this;
    transactionState = transactionStates.trading;
    completePurchase(function(){
            assessTopCards();
        }, this);
}

function purchaseWeaponClick(){
    clearActionButtons();
    var currency = getCardsSum(diamondCards);
    var instructionLabel = game.add.bitmapText(mainDialog.spriteGroup.children[0].x + leftMargin, mainDialog.spriteGroup.children[0].y + leftMargin,preloadKeys.dialogFont,'Select a weapon to purchase:',dialogTextSize);
    actionLabels.push(instructionLabel);
    var topCards = getTopCards();

    for(var i = 0; i < topCards.length; i++){
        if(topCards[i]){
            if(topCards[i].suit == suits.spades && topCards[i].value <= currency){
                var x;
                if(actionButtons.length == 0){
                    var x = mainDialog.spriteGroup.children[0].x + leftMargin;
                }else{
                    x = actionButtons[actionButtons.length - 1].right + leftMargin * 2;
                }
                //var cardLabel = game.add.bitmapText(x, instructionLabel.bottom + topMargin, preloadKeys.dialogFont, 'LVL ' + topCards[i].value, dialogTextSize);
                var cardLabel = game.add.bitmapText(x, instructionLabel.bottom + topMargin, preloadKeys.dialogFont,'LVL '.concat(getValueLabelText(topCards[i].value)),dialogTextSize);
                actionLabels.push(cardLabel);
                var cardButton = game.add.button(cardLabel.x, cardLabel.y, cardLabel.key, weaponSelectionClick, topCards[i]);
                cardButton.width = cardLabel.width; 
                cardButton.height = cardLabel.height;
                actionButtons.push(cardButton);
            }
        }
    }

    var cancelLabel = game.add.bitmapText(instructionLabel.x, actionButtons[0].bottom + topMargin, preloadKeys.dialogFont,'Cancel',dialogTextSize);
    actionLabels.push(cancelLabel);
    var cancelButton = game.add.button(cancelLabel.x, cancelLabel.y, cancelLabel.key, cancelClick, this);
    actionButtons.push(cancelButton);
    cancelButton.width = cancelLabel.width;
    cancelButton.height = cancelLabel.height;
}

function cancelClick(){
    if(transactionCard){
        transactionCard.spriteGroup.y = transactionCard.spriteGroup.y + cardBumpAmount;
        transactionCard = null;
    }
    for(var i = 0; i < paymentCards.length; i++){
        paymentCards[i].spriteGroup.x = paymentCards[i].spriteGroup.x + cardBumpAmount;
    }
    paymentCards = [];
    transactionState = '';
    clearActionButtons();
    layoutActionButtons();
}

function enemySelectionClick(){
    clearActionButtons();
    transactionCard = this;
    transactionState = transactionStates.meleeing;
    bumpCardUp(this);
    var instructionLabel = game.add.bitmapText(mainDialog.spriteGroup.children[0].x + leftMargin, mainDialog.spriteGroup.children[0].y + leftMargin, preloadKeys.dialogFont, 'Select health cards:',dialogTextSize);
    actionLabels.push(instructionLabel);

    for(var i = 0; i < hpCards.length; i++){
        var x;
        if(i == 0 || i == 7){
            x = mainDialog.spriteGroup.children[0].x + leftMargin;
        }else{
            x = actionButtons[actionButtons.length - 1].right + leftMargin;
        }
        var y;
        if(actionButtons.length < 7){
            y = instructionLabel.bottom + topMargin;
        }else{
            y = actionButtons[0].bottom + topMargin;
        }
        var cardLabel = game.add.bitmapText(x, y, preloadKeys.dialogFont,'[ '.concat(getValueLabelText(hpCards[i].value),' ]'),dialogTextSize);
        actionLabels.push(cardLabel);
        var cardButton = game.add.button(cardLabel.x, cardLabel.y, cardLabel.key, paymentCardClick, {card: hpCards[i], buttonIndex:actionButtons.length, labelIndex:actionLabels.length - 1});
        cardButton.width = cardLabel.width;
        cardButton.height = cardLabel.height; 
        actionButtons.push(cardButton);
    }


    var cancelLabel = game.add.bitmapText(instructionLabel.x, actionButtons[actionButtons.length - 1].bottom + topMargin, preloadKeys.dialogFont,'Cancel',dialogTextSize);
    actionLabels.push(cancelLabel);
    var cancelButton = game.add.button(cancelLabel.x, cancelLabel.y, cancelLabel.key, cancelClick, this);
    actionButtons.push(cancelButton);
    cancelButton.width = cancelLabel.width;
    cancelButton.height = cancelLabel.height;
}

function weaponSelectionClick(){
    clearActionButtons();
    transactionCard = this;
    transactionState = transactionStates.buying;
    bumpCardUp(this);
    var instructionLabel = game.add.bitmapText(mainDialog.spriteGroup.children[0].x + leftMargin, mainDialog.spriteGroup.children[0].y + leftMargin, preloadKeys.dialogFont, 'Select payment cards:',dialogTextSize);
    actionLabels.push(instructionLabel);

    for(var i = 0; i < diamondCards.length; i++){
        var x;
        if(i == 0 || i == 7){
            x = mainDialog.spriteGroup.children[0].x + leftMargin;
        }else{
            x = actionButtons[actionButtons.length - 1].right + leftMargin;
        }
        var y;
        if(actionButtons.length < 7){
            y = instructionLabel.bottom + topMargin;
        }else{
            y = actionButtons[0].bottom + topMargin;
        }
        var cardLabel = game.add.bitmapText(x, y, preloadKeys.dialogFont,'[ '.concat(getValueLabelText(diamondCards[i].value),' ]'),dialogTextSize);
        actionLabels.push(cardLabel);
        var cardButton = game.add.button(cardLabel.x, cardLabel.y, cardLabel.key, paymentCardClick, {card: diamondCards[i], buttonIndex:actionButtons.length, labelIndex:actionLabels.length - 1});
        cardButton.width = cardLabel.width;
        cardButton.height = cardLabel.height; 
        actionButtons.push(cardButton);
    }


    var cancelLabel = game.add.bitmapText(instructionLabel.x, actionButtons[actionButtons.length - 1].bottom + topMargin, preloadKeys.dialogFont,'Cancel',dialogTextSize);
    actionLabels.push(cancelLabel);
    var cancelButton = game.add.button(cancelLabel.x, cancelLabel.y, cancelLabel.key, cancelClick, this);
    actionButtons.push(cancelButton);
    cancelButton.width = cancelLabel.width;
    cancelButton.height = cancelLabel.height;
}

function paymentCardClick(){
    paymentCards.push(this.card);
    if(getCardsSum(paymentCards) >= transactionCard.value){
        clearActionButtons();
        completePurchase(function(){
            assessTopCards();
        }, this);
    }else{
        bumpCardLeft(this.card);
        actionLabels[this.labelIndex].alpha = disabledButtonAlpha;
        actionButtons[this.buttonIndex].onInputUp = null;
    }
}

function removeCardFromGroup(arrayIndex, card){
    cardArrays[arrayIndex].splice(cardArrays[arrayIndex].indexOf(card),1);
}

function reorderZIndex(objectArray){
    for(var i = 0; i < objectArray.length; i++){
        objectArray[i].spriteGroup.z = i;
    }
}

function setDialogText(textString){
    var newTextString = textString;
    var lineIndex = Math.floor(textString.length / 20);
    for(var i = 0; i < lineIndex; i++){
        var lineChars = (i + 1) * 20;
        if(textString.length > lineChars){
            var subString = textString.substring(0,lineChars);
            var spaceIndex = subString.lastIndexOf(' ');
            newTextString = newTextString.substring(0,spaceIndex).concat('\n',textString.substring(spaceIndex+1,textString.length));
        }
    }
    dialogText.text = newTextString;
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    reorderZIndex(o);
    displayGroup.sort();
    return o;
}

function sortCards(a, b){
    return a.value - b.value;
}

function sortRedGroup(suit){
    var suitArray = [];
    var suitGroup = {};
    if(suit == suits.hearts){
        suitArray = hpCards;
        suitGroup = hpGroup;
    }
    if(suit == suits.diamonds){
        suitArray = diamondCards;
        suitGroup = diamondGroup;
    }
    suitArray.sort(sortCards);
    for(var i = 0; i < suitArray.length; i++){
        suitArray[i].spriteGroup.z = i;
    }
    suitGroup.sort();
}

function update() {

}

function weaponClick(){
    if(this.card.showing){
        if(transactionState == transactionStates.trading){
            if(weaponCard == this.card){
                fadeAndBurnCard(weaponCard);
                weaponCard = transactionCard;
                transactionCard = null;
                cards.splice(cards.indexOf(this.card),1);
                weaponCard.setLocation(weaponSpot.x, weaponSpot.y);
            }else{
                cancelPurchase();
            }
        }
        if(transactionState == transactionStates.meleeing){
            cancelPurchase();
        }else{
            if(weaponCard != this.card){
                if(transactionCard != this.card){
                    if(transactionCard){
                        cancelPurchase();
                    }
                    if(getCardsSum(diamondCards) >= this.card.value){
                        transactionState = transactionStates.buying;
                        transactionCard = this.card;
                        bumpCardUp(this.card);
                    }else if(weaponCard){
                        if(weaponCard.value > this.card.value){
                            transactionState = transactionStates.trading;
                            transactionCard = this.card;
                            bumpCardUp(this.card);
                        }
                    }
                }
            }
        }
    }else{
        this.card.flip();
    }
}