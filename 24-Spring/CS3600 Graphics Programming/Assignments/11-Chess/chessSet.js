import { setShaderAttributes, loadTexture } from "./helpers.js";

class ChessSet {
    constructor(gl) {

    }

    async init(gl) {
        this.blackTexture = loadTexture(gl, 'pieces/PiezasAjedrezDiffuseMarmolBlackBrighter.png', [80, 80, 80, 255]);
        this.whiteTexture = loadTexture(gl, 'pieces/PiezasAjedrezDiffuseMarmol.png', [220, 220, 220, 255]);
        this.boardTexture = loadTexture(gl, 'pieces/TableroDiffuse02.png', [255, 171, 0, 255]);
        this.buffers = {};
        await readObj(gl, "pieces/PiezasAjedrezAdjusted.obj", this.buffers);
    }    

    interpolate(t, t0, t1, v0, v1){
        let ratio = (t - t0) / (t1 - t0);
        ratio = Math.max(ratio, 0);
        ratio = Math.min(ratio, 1);
        return v0 + (v1 - v0) * ratio;
    }

    drawPiece(gl, shaderProgram, texture, piece, x, y, z, sx, sy, sz, rx, ry, rz, degrees){
        // Bind the texture for the piece
        gl.bindTexture(gl.TEXTURE_2D, texture);
    
        // Make sure to bind the correct buffer before setting attributes
        const pieceBufferInfo = this.buffers[piece];
        if (pieceBufferInfo) {
            gl.bindBuffer(gl.ARRAY_BUFFER, pieceBufferInfo.buffer);
            setShaderAttributes(gl, shaderProgram);
    
            // Create a model view matrix to move, scale, rotate the piece to the desired location
            var modelViewMatrix = mat4.create();
            mat4.translate(modelViewMatrix, modelViewMatrix, [x, y, z]);
            mat4.scale(modelViewMatrix, modelViewMatrix, [sx, sy, sz]);
            mat4.rotate(modelViewMatrix, modelViewMatrix, degrees * Math.PI / 180, [rx, ry, rz]);
    
            // Pass the model view matrix to the shader
            gl.uniformMatrix4fv(
                gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                false,
                modelViewMatrix
            );
    
            // Draw the piece
            gl.drawArrays(gl.TRIANGLES, 0, pieceBufferInfo.vertexCount);
        } else {
            console.error(`Buffer info for piece ${piece} not found.`);
        }
    }

    draw(gl, shaderProgram, currentTime) {
        // Draw the board
        this.drawPiece(gl, shaderProgram, this.boardTexture, "cube", 0, 0, 0, 1, 1, 1, 0, 1, 0, 0);

        // Draw the white pieces
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "rook", ...chessToCoordinates("a1"), 1, 1, 1, 0, 1, 0, 180);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "knight", ...chessToCoordinates("b1"), 1, 1, 1, 0, 1, 0, 180);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "bishop", ...chessToCoordinates("c1"), 1, 1, 1, 0, 1, 0, 180);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "queen", ...chessToCoordinates("d1"), 1, 1, 1, 0, 1, 0, 180);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "king", ...chessToCoordinates("e1"), 1, 1, 1, 0, 1, 0, 180);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "bishop", ...chessToCoordinates("f1"), 1, 1, 1, 0, 1, 0, 180);
        let [xg1, yg1, zg1] = chessToCoordinates("g1");
        zg1 = this.interpolate(currentTime, 2.5, 3, zg1, zg1-2);
        xg1 = this.interpolate(currentTime, 2.5, 3, xg1, xg1-1);
        yg1 = this.interpolate(currentTime, 2.5, 2.75, yg1, yg1+3); // hop!
        yg1 = this.interpolate(currentTime, 2.75, 3, yg1, yg1-3);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "knight", xg1, yg1, zg1, 1, 1, 1, 0, 1, 0, 180); // third move, f3
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "rook", ...chessToCoordinates("h1"), 1, 1, 1, 0, 1, 0, 180);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "pawn", ...chessToCoordinates("a2"), 1, 1, 1, 0, 1, 0, 180);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "pawn", ...chessToCoordinates("b2"), 1, 1, 1, 0, 1, 0, 180);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "pawn", ...chessToCoordinates("c2"), 1, 1, 1, 0, 1, 0, 180);
        let [xd2, yd2, zd2] = chessToCoordinates("d2");
        zd2 = this.interpolate(currentTime, 4.5, 5, zd2, zd2-2);
        xd2 = this.interpolate(currentTime, 5.5, 6.2, xd2, xd2-2.5); // capture
        yd2 = this.interpolate(currentTime, 5.5, 6.2, yd2, yd2+5);
        zd2 = this.interpolate(currentTime, 5.5, 6.2, zd2, zd2-5);
        let [sxd2, syd2, szd2] = [1, 1, 1]
        // sxd2 = this.interpolate(currentTime, 5.5, 6, sxd2, 0.001) // squish
        let [rxd2, ryd2, rzd2, degreesd2] = [0, 1, 0, 180]
        degreesd2 = this.interpolate(currentTime, 5.5, 6.2, degreesd2, 1800) // rotate
        rxd2 = this.interpolate(currentTime, 5.5, 6.2, rxd2, 1)
        ryd2 = this.interpolate(currentTime, 5.5, 6.2, ryd2, 0)
        rzd2 = this.interpolate(currentTime, 5.5, 6.2, rzd2, 1)
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "pawn", xd2, yd2, zd2, sxd2, syd2, szd2, rxd2, ryd2, rzd2, degreesd2); // fifth move, d4; gets captured later
        let [xe2, ye2, ze2] = chessToCoordinates("e2");
        ze2 = this.interpolate(currentTime, 0.5, 1, ze2, ze2-2);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "pawn", xe2, ye2, ze2, 1, 1, 1, 0, 1, 0, 180); // first move, e4
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "pawn", ...chessToCoordinates("f2"), 1, 1, 1, 0, 1, 0, 180);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "pawn", ...chessToCoordinates("g2"), 1, 1, 1, 0, 1, 0, 180);
        this.drawPiece(gl, shaderProgram, this.whiteTexture, "pawn", ...chessToCoordinates("h2"), 1, 1, 1, 0, 1, 0, 180);

        // Draw a black pieces
        this.drawPiece(gl, shaderProgram, this.blackTexture, "rook", ...chessToCoordinates("a8"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "knight", ...chessToCoordinates("b8"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "bishop", ...chessToCoordinates("c8"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "queen", ...chessToCoordinates("d8"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "king", ...chessToCoordinates("e8"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "bishop", ...chessToCoordinates("f8"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "knight", ...chessToCoordinates("g8"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "rook", ...chessToCoordinates("h8"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "pawn", ...chessToCoordinates("a7"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "pawn", ...chessToCoordinates("b7"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "pawn", ...chessToCoordinates("c7"), 1, 1, 1, 0, 1, 0, 0);
        let [xd7, yd7, zd7] = chessToCoordinates("d7");
        zd7 = this.interpolate(currentTime, 3.5, 4, zd7, zd7+1); // 4th move
        this.drawPiece(gl, shaderProgram, this.blackTexture, "pawn", xd7, yd7, zd7, 1, 1, 1, 0, 1, 0, 0); // fourth move, d6
        let [xe7, ye7, ze7] = chessToCoordinates("e7");
        ze7 = this.interpolate(currentTime, 1.5, 2, ze7, ze7+2); // 2nd move
        xe7 = this.interpolate(currentTime, 5.5, 6, xe7, xe7-1); // 6th move
        ze7 = this.interpolate(currentTime, 5.5, 6, ze7, ze7+1);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "pawn", xe7, ye7, ze7, 1, 1, 1, 0, 1, 0, 0); // second move, e5; sixth move capture d4
        this.drawPiece(gl, shaderProgram, this.blackTexture, "pawn", ...chessToCoordinates("f7"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "pawn", ...chessToCoordinates("g7"), 1, 1, 1, 0, 1, 0, 0);
        this.drawPiece(gl, shaderProgram, this.blackTexture, "pawn", ...chessToCoordinates("h7"), 1, 1, 1, 0, 1, 0, 0);
    }

}

// filename to dictionary this.buffers
async function readObj(gl, filename, buffers) {
    const response = await fetch(filename);
    const text = await response.text()

    const output = {};
    const lines = text.split("\n");
    let objectName = "";
    const vertexList = [];
    const normalList = [];
    const uvList = [];
    let currentFaceList = [];
    output.objectList = {};

    for (const line of lines) {
        const values = line.split(' ');
        if (values[0] == 'o') {
            if (currentFaceList.length > 0) {
                output.objectList[objectName] = currentFaceList
                AddVertexBufferObject(gl, buffers, objectName, vertexList, uvList, normalList, currentFaceList)
                currentFaceList = []
            }
            objectName = values[1];
        }
        else if (values[0] == 'v') {
            vertexList.push(parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]))
        }
        else if (values[0] == 'vn') {
            normalList.push(parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]))
        }
        else if (values[0] == 'vt') {
            uvList.push(parseFloat(values[1]), 1 - parseFloat(values[2]))
        }
        else if (values[0] == 'f') {
            const numVerts = values.length - 1;
            const fieldsV0 = values[1].split('/');
            for (let i = 2; i < numVerts; i++) {
                const fieldsV1 = values[i].split('/');
                const fieldsV2 = values[i + 1].split('/');
                currentFaceList.push(parseInt(fieldsV0[0]) - 1, parseInt(fieldsV0[1]) - 1, parseInt(fieldsV0[2]) - 1);
                currentFaceList.push(parseInt(fieldsV1[0]) - 1, parseInt(fieldsV1[1]) - 1, parseInt(fieldsV1[2]) - 1);
                currentFaceList.push(parseInt(fieldsV2[0]) - 1, parseInt(fieldsV2[1]) - 1, parseInt(fieldsV2[2]) - 1);
            }
        }
    }
    if (currentFaceList.length > 0) {
        output.objectList[objectName] = currentFaceList
        AddVertexBufferObject(gl, buffers, objectName, vertexList, uvList, normalList, currentFaceList)
    }
    output.vertexList = vertexList;
    output.normalList = normalList;
    output.uvList = uvList;
    return output;
}


function AddVertexBufferObject(gl, buffers, objectName, vertexList, uvList, normalList, currentFaceList) {
    const vertices = [];
    for (let i = 0; i < currentFaceList.length; i += 3) {
        const vertexIndex = currentFaceList[i] * 3;
        const uvIndex = currentFaceList[i + 1] * 2;
        const normalIndex = currentFaceList[i + 2] * 3;
        vertices.push(vertexList[vertexIndex + 0], vertexList[vertexIndex + 1], vertexList[vertexIndex + 2], // x,y,x
            uvList[uvIndex + 0], uvList[uvIndex + 1], // u,v
            normalList[normalIndex + 0], normalList[normalIndex + 1], normalList[normalIndex + 2] // nx,ny,nz
        );
    }

    const vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Store additional properties as part of the buffer object for easier access later
    buffers[objectName] = {
        buffer: vertexBufferObject,
        vertexCount: vertices.length / 8,
        // Add any additional properties you may need
    };
}

function chessToCoordinates(position) {
    const fileToX = {
        'a': -3.5, 'b': -2.5, 'c': -1.5, 'd': -0.5,
        'e': 0.5, 'f': 1.5, 'g': 2.5, 'h': 3.5
    };
    const rankToZ = {
        '8': -3.5, '7': -2.5, '6': -1.5, '5': -0.5,
        '4': 0.5, '3': 1.5, '2': 2.5, '1': 3.5
    };

    const x = fileToX[position[0]];
    const z = rankToZ[position[1]];
    const y = 0; // As per your system, y is always 0

    return [x, y, z];
}

export { ChessSet };