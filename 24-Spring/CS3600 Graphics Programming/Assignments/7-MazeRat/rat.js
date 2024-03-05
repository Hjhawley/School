import {drawLineLoop} from "./shapes2d.js";

class Rat{
    constructor(x, y, degrees, maze){
        this.x = x;
        this.y = y;
        this.degrees = degrees;
        this.maze = maze;

        this.SPIN_SPEED = 180; // degrees per second
        this.MOVE_SPEED = 1.0; // cells per second
        this.FATNESS = .1; // for bounding circle
    }

    draw(gl, shaderProgram){
        const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [this.x, this.y, 0] );
        mat4.rotate(modelViewMatrix, modelViewMatrix,(this.degrees*Math.PI/180), [0,0,1]);
        gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

        const vertices = [.3,0, -.2,.1, -.2,-.1];
        drawLineLoop(gl, shaderProgram, vertices, [0,1,1,1]);
    }

    spinLeft(DT){
        this.degrees += this.SPIN_SPEED*DT;
        if (this.degrees >=360){
            this.degrees -= 360;
        }
        if (this.degrees < 0){
            this.degrees += 360;
        }
    }

    spinRight(DT){
        this.spinLeft(-DT);
    }

    scurryForward(DT){
        const dx = Math.cos(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        const dy = Math.sin(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        const newX = this.x + dx;
        const newY = this.y + dy;
        if (this.maze.isSafe(newX,newY, this.FATNESS)){
            this.x = newX;
            this.y = newY;
        }
        else if (this.maze.isSafe(newX, this.y, this.FATNESS)){
            this.x = newX;
        }
        else if (this.maze.isSafe(this.x, newY, this.FATNESS)){
            this.y = newY;
        }
    }

    scurryBackwards(DT){
        this.scurryForward(-DT);
    }

    strafeLeft(DT){
        const dx = Math.cos((this.degrees + 90) * Math.PI / 180) * this.MOVE_SPEED * DT; // cos for x, but offset by 90 degrees
        const dy = Math.sin((this.degrees + 90) * Math.PI / 180) * this.MOVE_SPEED * DT; // sin for y, also offset by 90 degrees
        const newX = this.x + dx;
        const newY = this.y + dy;
        if (this.maze.isSafe(newX, newY, this.FATNESS)){
            this.x = newX;
            this.y = newY;
        }
    }    

    strafeRight(DT){
        this.strafeLeft(-DT);
    }
}

export {Rat};