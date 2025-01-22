/** ADDITIONAL FEATURES (EXTENSIONS)
 *  set up spinning obstacles
 */

function generateElements()
{
    /** create static rectangles at specified locations */
    element_1 = Bodies.rectangle(100+(table_width/2)+75, 125+((table_height/2)/2)+15, 95, 5, {isStatic:true, restitution:0.9, angle:0});
    element_2 = Bodies.rectangle(100+(table_width/2)+75, 475-((table_height/2)/2)-15, 95, 5, {isStatic:true, restitution:0.9, angle:0});
    element_3 = Bodies.rectangle(100+(table_width/2)-75, 125+((table_height/2)/2)+15, 95, 5, {isStatic:true, restitution:0.9, angle:0});
    element_4 = Bodies.rectangle(100+(table_width/2)-75, 475-((table_height/2)/2)-15, 95, 5, {isStatic:true, restitution:0.9, angle:0});

    element_5 = Bodies.rectangle(100+60, 125+60, 50, 5, {isStatic:true, restitution:0.9, angle:0});
    element_6 = Bodies.rectangle(800-60, 125+60, 50, 5, {isStatic:true, restitution:0.9, angle:0});
    element_7 = Bodies.rectangle(100+60, 475-60, 50, 5, {isStatic:true, restitution:0.9, angle:0});
    element_8 = Bodies.rectangle(800-60, 475-60, 50, 5, {isStatic:true, restitution:0.9, angle:0});
}

function drawElements()
{
    fill(0);
    drawVertices(element_1.vertices);
    drawVertices(element_2.vertices);
    drawVertices(element_3.vertices);
    drawVertices(element_4.vertices);
    drawVertices(element_5.vertices);
    drawVertices(element_6.vertices);
    drawVertices(element_7.vertices);
    drawVertices(element_8.vertices);
}

function spinElements()
{
    /** add spinning physics to rectangles */
    spin += 0.001;
    Body.setAngle(element_1, angle);
    Body.setAngle(element_2, -angle);
    Body.setAngle(element_3, -angle);
    Body.setAngle(element_4, angle);
    Body.setAngle(element_5, angle);
    Body.setAngle(element_6, -angle);
    Body.setAngle(element_7, angle);
    Body.setAngle(element_8, -angle);
    Body.setAngularVelocity(element_1, spin);
    Body.setAngularVelocity(element_2, -spin);
    Body.setAngularVelocity(element_3, -spin);
    Body.setAngularVelocity(element_4, spin);
    Body.setAngularVelocity(element_5, spin);
    Body.setAngularVelocity(element_6, -spin);
    Body.setAngularVelocity(element_7, spin);
    Body.setAngularVelocity(element_8, -spin);
    angle += spin;

    var rotation_speed_limit = 0.1;
    if (spin > rotation_speed_limit)
    {
        spin = rotation_speed_limit;
    }
}