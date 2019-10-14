
class Tilemap{
    constructor(mapX, mapY, mapZ){
        this.mapX = mapX;
        this.mapY = mapY;
        this.mapZ = mapZ;
        this.points = [];
    }

    setTile(x, y, z, tile){        
        this.points.push({"x": x, "y": y, "z": z, "tile": tile, "d": true})
    }
}