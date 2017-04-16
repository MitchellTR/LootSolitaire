function Card(value,suit){
    this.showing = false;
    this.style = {};
    this.cardSprite = {};
    this.value = value;
    this.suit = suit;
    if(this.suit == suits.diamonds || this.suit == suits.hearts){
        this.style = redTextStyle;
    }else{
        this.style = blackTextStyle;
    }

    if(suit == suits.clubs)
        this.labelText = getValueLabelText(value).concat('♣');
    if(suit == suits.diamonds)
        this.labelText = getValueLabelText(value).concat('♦');
    if(suit == suits.hearts)
        this.labelText = getValueLabelText(value).concat("♥");
    if(suit == suits.spades)
        this.labelText = getValueLabelText(value).concat('♠');
    this.spriteGroup = game.add.group();
    this.cardSprite = game.add.sprite(0,0,preloadKeys.cardBack);
    this.spriteGroup.add(this.cardSprite);
    var label = game.add.text(this.spriteGroup.width / 2,this.spriteGroup.height / 2,'',this.style);
    label.anchor.set(0.5);
    this.spriteGroup.add(label);
    this.spriteGroup.y = game.world.height - this.spriteGroup.height;
    displayGroup.add(this.spriteGroup);
    this.flip = function(){
        if(!this.showing){
            var cardSprite = this.spriteGroup.children[0];
            var label = this.spriteGroup.children[1];
            cardSprite.loadTexture(preloadKeys.cardFront);
            label.setText(this.labelText);
            this.showing = true;
        }else{
            var cardSprite = this.spriteGroup.children[0];
            var label = this.spriteGroup.children[1];
            cardSprite.loadTexture(preloadKeys.cardBack);
            label.setText('');
            this.showing = false;
        }
    }
    this.setLocation = function(x,y){
        game.add.tween(this.spriteGroup).to( { x: x, y: y }, defaultCardMoveTime, Phaser.Easing.Circular.Out, true);
    }
}