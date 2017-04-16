function preload() {
    this.game.scaleMode = Phaser.ScaleManager.RESIZE;
    this.game.scale.refresh();

    preloadKeys.cardBack = 'cardBack';
    preloadKeys.cardFront = 'cardFront';
    preloadKeys.cardSpot = 'cardSpot';
    preloadKeys.dg1 = 'dg1';
    preloadKeys.dg2 = 'dg2';
    preloadKeys.dg3 = 'dg3';
    preloadKeys.dg4 = 'dg4';
    preloadKeys.dg5 = 'dialogBg';
    preloadKeys.dg6 = 'dg6';
    preloadKeys.dg7 = 'dg7';
    preloadKeys.dg8 = 'dg8';
    preloadKeys.dg9 = 'dg9';
    preloadKeys.dialogFont = 'dialogFont';
    preloadKeys.goldFont = 'goldFont';
    preloadKeys.exit = 'exit';
    preloadKeys.loot = 'loot';
    preloadKeys.slash = 'slash';
    preloadKeys.tableBg = 'tableBg';

    this.load.image(preloadKeys.cardBack,'img/CardBack.png');
    this.load.image(preloadKeys.cardFront,'img/CardFront.png');
    this.load.image(preloadKeys.cardSpot,'img/cardSpot.png');
    this.load.image(preloadKeys.dg1,'img/dialogGrid1.png');
    this.load.image(preloadKeys.dg2,'img/dialogGrid2.png');
    this.load.image(preloadKeys.dg3,'img/dialogGrid3.png');
    this.load.image(preloadKeys.dg4,'img/dialogGrid4.png');
    this.load.image(preloadKeys.dg5,'img/dialogBg.png');
    this.load.image(preloadKeys.dg6,'img/dialogGrid6.png');
    this.load.image(preloadKeys.dg7,'img/dialogGrid7.png');
    this.load.image(preloadKeys.dg8,'img/dialogGrid8.png');
    this.load.image(preloadKeys.dg9,'img/dialogGrid9.png');
    game.load.spritesheet(preloadKeys.exit, 'img/exit.png', 100,131, 10);
    game.load.spritesheet(preloadKeys.slash, 'img/slash.png', 100,129,3);
    this.load.image(preloadKeys.loot, 'img/loot1.png');
    this.load.image(preloadKeys.tableBg, 'img/tableBg.png');

    game.load.bitmapFont(preloadKeys.dialogFont, 'font/font.png', 'font/font.xml');
    game.load.bitmapFont(preloadKeys.goldFont, 'font/goldFont.png', 'font/goldFont.xml');
}