function Pockets(x, y, r)
{
    var pos = new p5.Vector(x, y);

    this.show = function()
    {
        /** pocket size 1.5 times of ball diameter */
        fill(0, 0, 0);
        ellipse(pos.x, pos.y, r*1.5);
    }
}

function generatePockets()
{
    /** corners */
    pockets.push(new Pockets(100+7.5, 125+7.5, diameter));
    pockets.push(new Pockets(100+7.5, 475-7.5, diameter));
    pockets.push(new Pockets(800-7.5, 125+7.5, diameter));
    pockets.push(new Pockets(800-7.5, 475-7.5, diameter));
    /** middle */
    pockets.push(new Pockets(width/2, 125+5.5, diameter));
    pockets.push(new Pockets(width/2, 475-5.5, diameter));
    console.log(pockets);
}

function drawPockets()
{
    for (var i = 0; i < pockets.length; ++i)
    {
        pockets[i].show();
    }
}

function checkPocketCollision(ball)
{
    var pos = ball.position;
    var total_radius = radius+(diameter*1.5)*0.75;
    
    /** adjust to 0.3 times for precision, ball will stay at the edge of pocket if not within range */
    if (dist(pos.x, pos.y, 100+7.5, 125+7.5) < (total_radius*0.3))
    {
        return true;
    }
    else if (dist(pos.x, pos.y, 100+7.5, 475-7.5) < (total_radius*0.3))
    {
        return true;
    }
    else if (dist(pos.x, pos.y, 800-7.5, 125+7.5) < (total_radius*0.3))
    {
        return true;
    }
    else if (dist(pos.x, pos.y, 800-7.5, 475-7.5) < (total_radius*0.3))
    {
        return true;
    }
    else if (dist(pos.x, pos.y, width/2, 125+5.5) < (total_radius*0.3))
    {
        return true;
    }
    else if (dist(pos.x, pos.y, width/2, 475-5.5) < (total_radius*0.3))
    {
        return true;
    }
    else
    {
        return false;
    }
}