function DialogBox(x, y, width, height, text){
    this.spriteGroup = game.add.group();
    var grid1 = game.add.image(x,y,preloadKeys.dg1);
    var grid2 = game.add.image(x + grid1.width, y, preloadKeys.dg2);
    grid2.width = width - grid1.width * 2;
    var grid3 = game.add.image(x + grid1.width + grid2.width, y, preloadKeys.dg3);
    var grid4 = game.add.image(x, y + grid1.height, preloadKeys.dg4);
    grid4.height = height - grid1.height * 2;
    var grid5 = game.add.image(x + grid4.width, y + grid2.height, preloadKeys.dg5);
    grid5.alpha = 0.7;
    grid5.width = width - grid1.width * 2;
    grid5.height = height - grid2.height * 2;
    var grid6 = game.add.image(x + width - grid4.width, y + grid3.height, preloadKeys.dg6);
    grid6.height = height - grid3.height * 2;
    var grid7 = game.add.image(x, y + grid1.height + grid4.height, preloadKeys.dg7);
    var grid8 = game.add.image(x + grid7.width, y + grid2.height + grid5.height, preloadKeys.dg8);
    grid8.width = width - grid7.width * 2;
    var grid9 = game.add.image(x + width - grid7.width, y + height - grid7.height, preloadKeys.dg9);
    this.spriteGroup.add(grid1);
    this.spriteGroup.add(grid2);
    this.spriteGroup.add(grid3);
    this.spriteGroup.add(grid4);
    this.spriteGroup.add(grid5);
    this.spriteGroup.add(grid6);
    this.spriteGroup.add(grid7);
    this.spriteGroup.add(grid8);
    this.spriteGroup.add(grid9);
}