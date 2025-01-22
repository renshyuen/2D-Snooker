function generateBalls()
{
    /** 
     * canvas height = 600
     * the height of the table starts from 125 
     * the height of the table from top to bottom = 350 
     * the starting width of the table is 100
     * */

    /** assuming the distance between the green and yellow ball is equal to 1/3 of the table height */
    green = Bodies.circle((table_width/2)-65, (125+(table_height*(1/3))), radius, {restitution:1, friction:.001});
    brown = Bodies.circle((table_width/2)-65, (125+(table_height/2)), radius, {restitution:1, friction:.001});
    yellow = Bodies.circle((table_width/2)-65, (125+(table_height*(2/3))), radius, {restitution:1, friction:.001});

    /** pink ball to be in the middle of right half of snooker table */
    /** black ball to be also in the middle between the right end of table and last row of red balls */
    blue = Bodies.circle(100+(table_width/2), (125+(table_height/2)), radius, {restitution:1, friction:.001});
    pink = Bodies.circle((100+(table_width/2))+((table_width/2)/2), (125+(table_height/2)), radius, {restitution:1, friction:.001});
    black = Bodies.circle((100+(table_width/2))+((table_width/2)/2)+((table_width/2)/2)/2, height/2, radius, {restitution:1, friction:.001});

    /** taking x position of pink ball and add a fixed distance calculations for the red balls */
    for (var i = 0; i < 5; ++i)
    {
        var red = Bodies.circle((100+(table_width/2))+((table_width/2)/2)+((5*2)*radius), ((height/2)+(4*radius))-i*diameter, radius, {restitution:1, friction:.001});
        World.add(engine.world, [red]);
        red_balls.push(red);
    }

    for (var i = 0; i < 4; ++i)
    {
        var red = Bodies.circle((100+(table_width/2))+((table_width/2)/2)+((4*2)*radius), ((height/2)+(3*radius))-i*diameter, radius, {restitution:1, friction:.001});
        World.add(engine.world, [red]);
        red_balls.push(red);
    }

    for (var i = 0; i < 3; ++i)
    {
        var red = Bodies.circle((100+(table_width/2))+((table_width/2)/2)+((3*2)*radius), ((height/2)+(2*radius))-i*diameter, radius, {restitution:1, friction:.001});
        World.add(engine.world, [red]);
        red_balls.push(red);
    }

    for (var i = 0; i < 2; ++i)
    {
        var red = Bodies.circle((100+(table_width/2))+((table_width/2)/2)+((2*2)*radius), ((height/2)+(radius))-i*diameter, radius, {restitution:1, friction:.001});
        World.add(engine.world, [red]);
        red_balls.push(red);
    }

    var red_ball = Bodies.circle((100+(table_width/2))+((table_width/2)/2)+((1*2)*radius), height/2, radius, {restitution:1, friction:.001});
    red_balls.push(red_ball);

    World.add(engine.world, [green, brown, yellow, blue, pink, black, red_ball]);
}

function drawBalls()
{
    stroke(0);

    fill(0, 153, 0);
    drawVertices(green.vertices);
    fill(160, 82, 45);
    drawVertices(brown.vertices);
    fill(255, 255, 0);
    drawVertices(yellow.vertices);

    fill(0, 0, 204);
    drawVertices(blue.vertices);
    fill(255, 153, 255);
    drawVertices(pink.vertices);
    fill(0);
    drawVertices(black.vertices);

    push();
    for (var i = 0; i < red_balls.length; ++i)
    {
        fill(255, 0, 0);
        drawVertices(red_balls[i].vertices);

        /** remove red ball if potted */
        if (checkPocketCollision(red_balls[i]) == true)
        {
            World.remove(engine.world, red_balls[i]);
            red_balls.splice(i, 1);
            i--;
            console.log("Red ball potted. Left: " + red_balls.length);
            pocket_sound.play();
        }
    }
    pop();

    /** reset to original position if color ball is potted */
    if (checkPocketCollision(green) == true)
    {
        Body.setPosition(green, {x:(table_width/2)-65, y:(125+(table_height*(1/3)))});
        Body.setVelocity(green, {x:0, y:0});
        pocket_sound.play();
    }
    if (checkPocketCollision(brown) == true)
    {
        Body.setPosition(brown, {x:(table_width/2)-65, y:(125+(table_height/2))});
        Body.setVelocity(brown, {x:0, y:0});
        pocket_sound.play();
    }
    if (checkPocketCollision(yellow) == true)
    {
        Body.setPosition(yellow, {x:(table_width/2)-65, y:(125+(table_height*(2/3)))});
        Body.setVelocity(yellow, {x:0, y:0});
        pocket_sound.play();
    }
    if (checkPocketCollision(blue) == true)
    {
        Body.setPosition(blue, {x:100+(table_width/2), y:(125+(table_height/2))});
        Body.setVelocity(blue, {x:0, y:0});
        pocket_sound.play();
    }
    if (checkPocketCollision(pink) == true)
    {
        Body.setPosition(pink, {x:(100+(table_width/2))+((table_width/2)/2), y:(125+(table_height/2))});
        Body.setVelocity(pink, {x:0, y:0});
        pocket_sound.play();
    }
    if (checkPocketCollision(black) == true)
    {
        Body.setPosition(black, {x:(100+(table_width/2))+((table_width/2)/2)+((table_width/2)/2)/2, y:height/2});
        Body.setVelocity(black, {x:0, y:0});
        pocket_sound.play();
    }
}

/** randomise all balls */
function randomAllBalls()
{
    Body.setPosition(green, {x:random(150, 750), y:random(175, 425)});
    Body.setVelocity(green, {x:0, y:0});

    Body.setPosition(brown, {x:random(150, 750), y:random(175, 425)});
    Body.setVelocity(brown, {x:0, y:0});

    Body.setPosition(yellow, {x:random(150, 750), y:random(175, 425)});
    Body.setVelocity(yellow, {x:0, y:0});

    Body.setPosition(blue, {x:random(150, 750), y:random(175, 425)});
    Body.setVelocity(blue, {x:0, y:0});

    Body.setPosition(pink, {x:random(150, 750), y:random(175, 425)});
    Body.setVelocity(pink, {x:0, y:0});

    Body.setPosition(black, {x:random(150, 750), y:random(175, 425)});
    Body.setVelocity(black, {x:0, y:0});

    for (var i = 0; i < red_balls.length; ++i)
    {
        Body.setPosition(red_balls[i], {x:random(150, 750), y:random(175, 425)});
        Body.setVelocity(red_balls[i], {x:0, y:0});
    }
}

/** randomise only red balls */
function randomRedBalls()
{
    for (var i = 0; i < red_balls.length; ++i)
    {
        Body.setPosition(red_balls[i], {x:random(150, 750), y:random(175, 425)});
        Body.setVelocity(red_balls[i], {x:0, y:0});
    }
}

/** reset everything */
function resetBalls()
{
    draw_cue_ball = false;

    Body.setPosition(green, {x:(table_width/2)-65, y:(125+(table_height*(1/3)))});
    Body.setVelocity(green, {x:0, y:0});

    Body.setPosition(brown, {x:(table_width/2)-65, y:(125+(table_height/2))});
    Body.setVelocity(brown, {x:0, y:0});
     
    Body.setPosition(yellow, {x:(table_width/2)-65, y:(125+(table_height*(2/3)))});
    Body.setVelocity(yellow, {x:0, y:0});
     
    Body.setPosition(blue, {x:100+(table_width/2), y:(125+(table_height/2))});
    Body.setVelocity(blue, {x:0, y:0});
     
    Body.setPosition(pink, {x:(100+(table_width/2))+((table_width/2)/2), y:(125+(table_height/2))});
    Body.setVelocity(pink, {x:0, y:0});

    Body.setPosition(black, {x:(100+(table_width/2))+((table_width/2)/2)+((table_width/2)/2)/2, y:height/2});
    Body.setVelocity(black, {x:0, y:0});

    /** additional check to ensure every red ball potted is refilled */
    if (red_balls.length < 15)
    {
        for (var i = 0; i < red_balls.length; ++i)
        {
            World.remove(engine.world, red_balls[i]);
            red_balls.splice(i, 1);
            i--;
        }

        for (var i = 0; i < 5; ++i)
        {
            var red = Bodies.circle((100+(table_width/2))+((table_width/2)/2)+((5*2)*radius), ((height/2)+(4*radius))-i*diameter, radius, {restitution:1, friction:.001});
            World.add(engine.world, [red]);
            red_balls.push(red);
        }
    
        for (var i = 0; i < 4; ++i)
        {
            var red = Bodies.circle((100+(table_width/2))+((table_width/2)/2)+((4*2)*radius), ((height/2)+(3*radius))-i*diameter, radius, {restitution:1, friction:.001});
            World.add(engine.world, [red]);
            red_balls.push(red);
        }
    
        for (var i = 0; i < 3; ++i)
        {
            var red = Bodies.circle((100+(table_width/2))+((table_width/2)/2)+((3*2)*radius), ((height/2)+(2*radius))-i*diameter, radius, {restitution:1, friction:.001});
            World.add(engine.world, [red]);
            red_balls.push(red);
        }
    
        for (var i = 0; i < 2; ++i)
        {
            var red = Bodies.circle((100+(table_width/2))+((table_width/2)/2)+((2*2)*radius), ((height/2)+(radius))-i*diameter, radius, {restitution:1, friction:.001});
            World.add(engine.world, [red]);
            red_balls.push(red);
        }
    
        var red_ball = Bodies.circle((100+(table_width/2))+((table_width/2)/2)+((1*2)*radius), height/2, radius, {restitution:1, friction:.001});
        red_balls.push(red_ball);

        World.add(engine.world, [red_ball]);
    }
    /** else reset all red balls back to original positions */
    else
    {
        for (var i = 0; i < 5; ++i) {
            Body.setPosition(red_balls[i], {
                x: (100+(table_width/2))+((table_width/2)/2)+((5*2)*radius),
                y: ((height/2)+(4*radius))-i*diameter
            });
            Body.setVelocity(red_balls[i], {x: 0, y: 0});
        }
    
        for (var i = 0; i < 4; ++i) {
            Body.setPosition(red_balls[i + 5], {
                x: (100+(table_width/2))+((table_width/2)/2)+((4*2)*radius),
                y: ((height/2)+(3*radius))-i*diameter
            });
            Body.setVelocity(red_balls[i + 5], {x: 0, y: 0});
        }
    
        for (var i = 0; i < 3; ++i) {
            Body.setPosition(red_balls[i + 9], {
                x: (100+(table_width/2))+((table_width/2)/2)+((3*2)*radius),
                y: ((height/2)+(2*radius))-i*diameter
            });
            Body.setVelocity(red_balls[i + 9], {x: 0, y: 0});
        }
    
        for (var i = 0; i < 2; ++i) {
            Body.setPosition(red_balls[i + 12], {
                x: (100+(table_width/2))+((table_width/2)/2)+((2*2)*radius),
                y: ((height/2)+(radius))-i*diameter
            });
            Body.setVelocity(red_balls[i + 12], {x: 0, y: 0});
        }
    
        Body.setPosition(red_balls[14], {
            x: (100+(table_width/2))+((table_width/2)/2)+((1*2)*radius),
            y: height/2
        });
        Body.setVelocity(red_balls[14], {x: 0, y: 0});
    }

}