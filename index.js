const MainCanvasWidth = 1200;
const MainCanvasHeight = 580;

const canvasCoordToWebGL = (x, y) => {
    return [
        2.0 * x / MainCanvasWidth - 1.0,
        1.0 - 2.0 * y / MainCanvasHeight
    ]
}

const applicationStart = () => {
    const canvas = $('main-canvas')
    const gl2 = canvas.getContext('webgl2')
    if (!gl2) {
        alert("你的浏览器不支持 WebGL2，因此无法运行本程序")
        return
    }
    gl2.clearColor(0.0, 0.0, 0.0, 1.0)
    gl2.clear(gl2.COLOR_BUFFER_BIT)


    const ext = gl2.getExtension('EXT_color_buffer_float')
    if (!ext) {
        alert("你的浏览器不支持 EXT_color_buffer_float 扩展，因此无法运行本程序")
        return
    }

    const forwardPropagate = createShaderProgram(gl2, forwardPropagateVS, forwardPropagateFS)
    const simpleRender = createShaderProgram(gl2, simpleTexDisplayVS, simpleTexDisplayFS)

    const { framebuffer, texture } = createFloatRenderTarget(gl2, 576, 576, () => (Math.random() - 0.5) / 2.0)

    const [x0, y0] = canvasCoordToWebGL(0, 0)
    const [x1, y1] = canvasCoordToWebGL(576, 576)

    // use 2 triangles to fill the texture area on the canvas
    const vertices = [
        x0, y0,
        x1, y0,
        x0, y1,
        x0, y1,
        x1, y0,
        x1, y1
    ]
    const vertexBuffer = gl2.createBuffer()
    gl2.bindBuffer(gl2.ARRAY_BUFFER, vertexBuffer)
    gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(vertices), gl2.STATIC_DRAW)

    gl2.useProgram(simpleRender)
    const aPosition = gl2.getAttribLocation(simpleRender, 'aPosition')
    gl2.enableVertexAttribArray(aPosition)
    gl2.vertexAttribPointer(aPosition, 2, gl2.FLOAT, false, 0, 0)

    const tex = gl2.getUniformLocation(simpleRender, 'tex')
    gl2.uniform1i(tex, 0)
    gl2.activeTexture(gl2.TEXTURE0)
    gl2.bindTexture(gl2.TEXTURE_2D, texture)

    gl2.drawArrays(gl2.TRIANGLES, 0, 6)
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        applicationStart()
    } catch (e) {
        alert(`遇到错误：\n${e.message}`)
    }
})
