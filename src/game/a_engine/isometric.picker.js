class IsometricPicker {

    constructor(tileSize){
        this.tileSize = tileSize;
    }

    worldToTilePosition(worldPosition){
        var nonIsoTilePosition = {
            x: Math.floor((worldPosition.x + (this.tileSize.x / 2.0)) / this.tileSize.x),
            y: Math.floor(worldPosition.Y / this.tileSize.y)
        }

        var tileSegment = this.calculateIsoSegment(worldPosition, nonIsoTilePosition);
        
        var tilePosition = {
            x: nonIsoTilePosition.y + nonIsoTilePosition.x,
            y: nonIsoTilePosition.x - nonIsoTilePosition.y -1
        }

        if(tileSegment.direction == 0 || tileSegment.direction == 1) tilePosition.x--;
        if(tileSegment.direction == 0 || tileSegment.direction == 3) tilePosition.y++;

        return tilePosition;
    }

    calculateIsoSegment(worldPosition, nonIsoTilePosition){
        var halfWidth = this.tileSize.x / 2.0;

        var xScalar = ((worldPosition.x - ((nonIsoTilePosition.x * this.tileSize.x) - halfWidth)) / halfWidth) - 1.0;
        var yScalar = ((worldPosition.y - (nonIsoTilePosition.y * this.tileSize.y)) / (this.tileSize.y / 2.0)) - 1.0;

        var a = xScalar + yScalar;
        var b = xScalar - yScalar;

        if (a >= 0 && b > 0) return {direction: 3}; // East
        if (a > 0 && b <= 0) return {direction: 2}; // South
        if (a <= 0 && b < 0) return {direction: 1}; // West
        if (a < 0 && b >= 0) return {direction: 0}; // North
        return {direction: -1};
    }
}