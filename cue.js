function drawCue()
{
    var pos = cue_ball.position;
    var direction = createVector((mouseX - pos.x), (mouseY - pos.y));
    direction.normalize();

    var line_startX = pos.x + direction.x * (10 + adjustments);
    var line_startY = pos.y + direction.y * (10 + adjustments);
    var line_endX = pos.x + direction.x * (300 + adjustments);
    var line_endY = pos.y + direction.y * (300 + adjustments);

    push();
    stroke(153, 76, 0);
    strokeWeight(2);
    line(line_startX, line_startY, line_endX, line_endY);
    pop();
}

function applyCueForce()
{
    var pos = cue_ball.position;

    /** specified limit to prevent excessive speed */
    var maximum_force = 0.002;

    /** calculate force based on mouse positions */
    force = 100000;
    forceX = (pos.x - mouseX) / force;
    forceY = (pos.y - mouseY) / force;

    /** scales down to ensure it does not exceed the specified limit */
    var magnitude = Math.sqrt(forceX * forceX + forceY * forceY);
    if (magnitude > maximum_force)
    {
        forceX *= maximum_force / magnitude;
        forceY *= maximum_force / magnitude;
    }

    var applied_force = {x:forceX, y:forceY};

    // console.log("Force X applied: " + forceX);
    // console.log("Force Y applied: " + forceY);

    Body.applyForce(cue_ball, {x:pos.x, y:pos.y}, applied_force);
}