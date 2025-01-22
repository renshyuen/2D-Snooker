/** 
 *  CANVAS & TABLE LAYOUT:
 *  First, I set up a canvas size (width = 900, height = 600) just big enough to 
 *  contain both displaying texts and the snooker table itself. Since a full-size 
 *  snooker table measures about 12ft x 6ft, I decided to choose a sizing of 700 
 *  and 350 pixels (half of 700). The x and y point from the top left of my snooker 
 *  table will be 100 to the right (width) and 125 downwards (height) respectively. 
 *  I chose to design my snooker balls with smaller size for my snooker application 
 *  since snooker balls are supposed to look smaller compared to pool and the size 
 *  of the snooker table. 
 * 
 *  WALLS & CUSHIONS:
 *  I implemented rigid body models (rectangles for walls and trapezoids for cushions)
 *  from Matter.js. I set them to static and also gave my cushions restitution and slop
 *  properties to simulate bounciness and proper collision response. 
 * 
 *  POCKETS:
 *  The pocket size is set to 1.5 times of the ball diameter. I prefer realism, which 
 *  means that any ball must be almost all the way in within the size of pocket 
 *  (75% of the ball to be exact) for it to be counted a pot. Otherwise, the ball will 
 *  just stay on the edge.
 * 
 *  SNOOKER BALLS:
 *  As per instructions, red balls will be removed from arrays and coloured balls will 
 *  return to their initial set position when potted. I decided to implement key 
 *  interactions for adjusting starting positions and insertion of the cue ball. Users 
 *  will need to press the C key to generate or regenerate (if in the event the cue ball 
 *  is potted or snooker application is reset) the cue ball. UP, DOWN or LEFT arrow keys 
 *  can also be pressed for adjusting to desired starting position beforehand.
 * 
 *  CUE:
 *  I want the controls of my cue for this snooker application to be user-friendly 
 *  and able to somewhat simulate physics of a real-life snooker cue. To do that, I 
 *  implemented mouse-based functionalities to control the cue. User must only click 
 *  onto the cue ball to start drawing a cue stick and the stick follows wherever the 
 *  mouse hovers while pointing towards the ball. While holding the click, the user 
 *  can adjust the force by dragging the mouse. The cue stick will always be pointed 
 *  towards the ball, but the direction is determined by wherever the user’s mouse hovers. 
 *  Cue stick will only apply the hit once mouse is released.
 * 
 *  EXTENSIONS:
 *  Inspired by the fast-paced element in a classic pinball game, I decided to implement
 *  spinning obstacles for my snooker application. This introduces complexity and challenge
 *  to the game, hoping to make it more engaging for users. The spinning motion adds a
 *  visual flair to the gameplay, creating a more dynamic and unpredictable environment.
 *  Snooker games typically focus on precision and strategies, I believe that the addition
 *  of spinning obstacles brings relatively unique and interesting twist to the traditional
 *  snooker experience.
 * 
 *  I have also added sound effects for immersive experience.
**/

var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Query = Matter.Query;

var engine;

var table_width = 700;
var table_height = 350;

/** ball diameter = 350 / 36
 *  ball radius = diameter / 2
 */
var diameter = table_height/36; // 9.72222
var radius = diameter/2; // 4.86111

var cue_ball;
/** to check if cue ball is drawn or hit */
var is_hit;
var draw_cue_ball = false;

var wall_1, wall_2, wall_3, wall_4, wall_5, wall_6;
var cushion_1, cushion_2, cushion_3, cushion_4, cushion_5, cushion_6;
var green, brown, yellow, blue, pink, black;
var red_balls = [];
var pockets = [];

var cue;
var drawing_cue = false;

var force, forceX, forceY;
var adjustments = 0;
var last_collided = " ";

/** extended variables */
var element_1, element_2, element_3, element_4, element_5, element_6, element_7, element_8;
var angle = 0;
var spin = 0;
var draw_elements = false;

/* REFERENCES */
// Matter.Bodies.rectangle(x, y, width, height, [options]) 
// Matter.Bodies.circle(x, y, radius, [options], [maxSides])
// Matter.Body.applyForce(body, position, force)

/** source sound effects */
var hit_sound, pocket_sound;
function preload()
{
    hit_sound = loadSound("cuehitsound.mp3");
    pocket_sound = loadSound("pocketsound.mp3");
}

function setup()
{
    createCanvas(900, 600);
    angleMode(DEGREES);
    engine = Engine.create();
    engine.world.gravity.y = 0;

    generatePockets();
    generateWalls();
    generateCushions();
    generateElements();
    generateCueBall();
    generateBalls();

}

function draw()
{
    background(96, 96, 96);
    Engine.update(engine);

    drawSnookerTable();
    drawWhiteLines();
    drawCushions();
    drawTableWalls();

    if (draw_elements)
    {
        drawElements();
        spinElements();
    }

    drawPockets();
    drawBalls();
    drawCollisionPrompt();

    if (draw_cue_ball)
    {
        drawCueBall();
    }

    if (drawing_cue)
    {
        drawCue();
    }

    drawTexts();
}

function mousePressed()
{
    /** checks if mouse clicked is on cue ball */
    var pos = cue_ball.position;
    var distance = dist(mouseX, mouseY, pos.x, pos.y);
    if (distance < radius)
    {
        drawing_cue = true;
    }
    else
    {
        drawing_cue = false;
    }
}

function mouseDragged()
{
   if (drawing_cue)
   {
        /** the mouse affects the distance pulled for cue stick */
        var distance = dist(cue_ball.position.x, cue_ball.position.y, mouseX, mouseY);
        var movements = map(distance, 0, 1000, 0, 100);
        if (adjustments >= 200)
        {
            adjustments = 200;
        }
        else
        {
            adjustments = movements;
        }  
   }
}

function mouseReleased()
{
    /** apply force to cue ball and reset */
    if (drawing_cue)
    {
        applyCueForce();
        is_hit = true;
        drawing_cue = false;
        adjustments = 0;

        /** play hitting sound effect */
        hit_sound.play();
    }
}

/** combination of keys for different game modes */
function keyTyped()
{
    if (key == 'z'|| key == 'Z')
    {
        console.log("Z key pressed");
        randomAllBalls();
        draw_elements = false;
    }
    if (key == 'x'|| key == 'X')
    {
        console.log("X key pressed");
        randomRedBalls();
        draw_elements = false;
    }
    /** reset everything to square one */
    if (key == 'r' || key == 'R')
    {
        /** cue ball is physically is there but not visibly seen, thus need to re-position it */
        Body.setPosition(cue_ball, {x:(table_width/2)-100, y:height/2});
        Body.setVelocity(cue_ball, {x:0, y:0});
        console.log("R key pressed");
        resetBalls();
        if (draw_elements == true)
        {
            draw_elements = false;
            World.remove(engine.world, [element_1, element_2, element_3, element_4, element_5, element_6, element_7, element_8]);
            console.log("Fun elements removed");
        }
    }
    /** insert cue ball */
    if (key == 'c' || key == 'C')
    {
        console.log("C key pressed");
        if (draw_cue_ball == false)
        {
            draw_cue_ball = true;
            Body.setPosition(cue_ball, {x:(table_width/2)-100, y:height/2});
            Body.setVelocity(cue_ball, {x:0, y:0});
            is_hit = false;
        }
    }
    /** key for extension mode */
    if (key == 'f' || key == 'F')
    {
        console.log("F key pressed");
        if (draw_elements == false)
        {
            World.add(engine.world, [element_1, element_2, element_3, element_4, element_5, element_6, element_7, element_8]);
            draw_elements = true;
            console.log("Fun elements activated");
        }
    }
}

function keyPressed()
{
    /** adjust starting positions of cue ball beforehand */
    if (keyCode === UP_ARROW)
    {
        console.log("UP arrow key pressed");
        if (is_hit == false && draw_cue_ball == true)
        {
            draw_cue_ball = true;
            Body.setPosition(cue_ball, {x:(table_width/2)-65, y:(height/2)-30});
            Body.setVelocity(cue_ball, {x:0, y:0});
        }
    }
    if (keyCode === DOWN_ARROW)
    {
        console.log("DOWN arrow key pressed");
        if (is_hit == false && draw_cue_ball == true)
        {
            draw_cue_ball = true;
            Body.setPosition(cue_ball, {x:(table_width/2)-65, y:(height/2)+30});
            Body.setVelocity(cue_ball, {x:0, y:0});
        }
    }
    if (keyCode === LEFT_ARROW)
    {
        console.log("LEFT arrow key pressed");
        if (is_hit == false && draw_cue_ball == true)
        {
            draw_cue_ball = true;
            Body.setPosition(cue_ball, {x:(table_width/2)-100, y:height/2});
            Body.setVelocity(cue_ball, {x:0, y:0});
        }
    }
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function generateWalls()
{
    wall_1 = Bodies.rectangle(100+((table_width/2)/2), 125, (table_width/2), 8, {isStatic: true});
    wall_2 = Bodies.rectangle(100+((table_width/2)/2), 475, (table_width/2), 8, {isStatic: true});
    wall_3 = Bodies.rectangle(100, height/2, 8, table_height, {isStatic: true});
    wall_4 = Bodies.rectangle(800, height/2, 8, table_height, {isStatic: true});
    wall_5 = Bodies.rectangle(800-((table_width/2)/2), 125, (table_width/2), 8, {isStatic: true});
    wall_6 = Bodies.rectangle(800-((table_width/2)/2), 475, (table_width/2), 8, {isStatic: true});

    World.add(engine.world, [wall_1, wall_2, wall_3, wall_4, wall_5, wall_6]);
}

function generateCueBall()
{
    cue_ball = Bodies.circle((table_width/2)-100, height/2, radius, {restitution:1, friction:.001});
    World.add(engine.world, [cue_ball]);
}

function generateCushions()
{
    /** slop property provides a buffer around the body for visual appearance of simulation */ 
    cushion_1 = Bodies.trapezoid(100+((table_width/2)/2)+3.5, 125+6, (table_width/2)-40, 12.5, -0.085, {isStatic: true, restitution:0.9, slop:0.06});
    cushion_2 = Bodies.trapezoid(800-((table_width/2)/2)-3.5, 125+6, (table_width/2)-40, 12.5, -0.085, {isStatic: true, restitution:0.9, slop:0.06});
    cushion_3 = Bodies.trapezoid(100+6, height/2, table_height-20, 12.5, 0.085, {isStatic: true, angle:Math.PI/2, restitution:0.9, slop:0.06});
    cushion_4 = Bodies.trapezoid(800-6, height/2, table_height-20, 12.5, 0.085, {isStatic: true, angle:-(Math.PI/2), restitution:0.9, slop:0.06});
    cushion_5 = Bodies.trapezoid(100+((table_width/2)/2)+3.5, 475-6, (table_width/2)-15.5, 12.5, 0.085, {isStatic: true, restitution:0.9, slop:0.06});
    cushion_6 = Bodies.trapezoid(800-((table_width/2)/2)-3.5, 475-6, (table_width/2)-15.5, 12.5, 0.085, {isStatic: true, restitution:0.9, slop:0.06});

    World.add(engine.world, [cushion_1, cushion_2, cushion_3, cushion_4, cushion_5, cushion_6]);
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function drawSnookerTable()
{
    fill(38, 135, 35);
    stroke(0);
    rect(100, 125, table_width, table_height);
}

function drawCueBall()
{
    fill(255);
    stroke(0);
    drawVertices(cue_ball.vertices);

    if (checkPocketCollision(cue_ball) == true)
    {
        draw_cue_ball = false;
        pocket_sound.play();
        console.log("Cue ball potted, press C to re-insert cue ball");
    }
}

function drawTableWalls()
{

    fill(102, 51, 0);
    stroke(0);
    drawVertices(wall_1.vertices);
    drawVertices(wall_2.vertices);
    drawVertices(wall_3.vertices);
    drawVertices(wall_4.vertices);
    drawVertices(wall_5.vertices);
    drawVertices(wall_6.vertices);

    fill(255, 255, 0);
    stroke(0);
    square(95, 120, 20, 6);
    square(785, 120, 20, 6);
    square(95, 460, 20, 6);
    square(785, 460, 20, 6);
    rect((width/2)-10, 120, 20, 10, 3); 
    rect((width/2)-10, 470, 20, 10, 3);
}

function drawCushions()
{
    fill(0, 102, 0);
    stroke(0);
    drawVertices(cushion_1.vertices);
    drawVertices(cushion_2.vertices);
    drawVertices(cushion_3.vertices);
    drawVertices(cushion_4.vertices);
    drawVertices(cushion_5.vertices);
    drawVertices(cushion_6.vertices);
}

function drawWhiteLines()
{
    fill(255);
    stroke(255);
    line((width/2)-165, 125, (width/2)-165, height-125);

    /** assuming that the radius of the semi-circle is 1/6 of 
     *  the distance between the left end of table and brown ball */
    var r = (((table_width/2)-65)-100)*(1/6);

    noFill();
    stroke(255);
    // arc(x, y, w, h, start, stop, [mode], [detail])
    arc((table_width/2)-65, 125+(table_height/2), r*3.8, table_height*(1/3), 90, 270, OPEN);
}

/** for cue ball collision detection */
function drawCollisionPrompt()
{
    /** combine the colored balls into the red balls array */
    var array = red_balls.concat([green, brown, yellow, blue, pink, black]);

    /** check for collisions */
    var collisions = Matter.Query.collides(cue_ball, array);    
    if (collisions.length > 0)
    {
        var object = collisions[0].bodyB;
        if (red_balls.includes(object))
        {       
            last_collided = "cue ball - red ball";
        }
        else if ([green].includes(object))
        {
            last_collided = "cue ball - green ball";
        }
        else if ([brown].includes(object))
        {
            last_collided = "cue ball - brown ball";
        }
        else if ([yellow].includes(object))
        {
            last_collided = "cue ball - yellow ball";
        }
        else if ([blue].includes(object))
        {
            last_collided = "cue ball - blue ball";
        }
        else if ([pink].includes(object))
        {
            last_collided = "cue ball - pink ball";
        }
        else if ([black].includes(object))
        {
            last_collided = "cue ball - black ball";
        }
    }
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
function drawVertices(vertices)
{
    beginShape();
    for (var i = 0; i < vertices.length; ++i)
    {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

function drawTexts()
{
    textStyle(BOLD);
    /** collision detection text */
    stroke(0);
    fill(255);
    text("Collision detected: " + last_collided, 100, 110);

    /** instructions */
    stroke(0);
    fill(255);
    text("CLICK ON THE CUE BALL TO PLAY", 100, 95);

    stroke(0);
    fill(255);
    text("Press C to generate cue ball", 100, 500);
    text("Press Z to randomise all balls positions", 100, 515);
    text("Press X to randomise red balls positions", 100, 530);
    text("Press F for fun!", 100, 545);
    text("Press R to reset (cue ball too)", 100, 560);
    text("UP/DOWN/LEFT arrow keys: Adjust the starting position of cue ball", 100, 575);    
}