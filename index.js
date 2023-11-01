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

    const ext = gl2.getExtension('EXT_color_buffer_float')
    if (!ext) {
        alert("你的浏览器不支持 EXT_color_buffer_float 扩展，因此无法运行本程序")
        return
    }

    gl2.disable(gl2.FRAMEBUFFER_SRGB)
    gl2.enable(gl2.CULL_FACE)
    gl2.clearColor(0.0, 0.0, 0.0, 1.0)
    gl2.clear(gl2.COLOR_BUFFER_BIT)

    const forwardPropagateMultiply = createShaderProgram(gl2, forwardPropagateMultiplyVS, forwardPropagateMultiplyFS)
    const forwardPropagateAdd = createShaderProgram(gl2, forwardPropagateAddVS, forwardPropagateAddFS)
    const fillingRect = createSimpleRectVBO(gl2, [-1.0, 1.0], [1.0, -1.0])

    const simpleRender = createShaderProgram(gl2, simpleTexDisplayVS, simpleTexDisplayFS)

    const { framebuffer, texture } = createFloatRenderTarget(gl2, 20 * 28, 15 * 28, () => (Math.random() - 0.5) / 5.0)

    const vertexBuffer = createSimpleRectVBO(gl2,
                                             canvasCoordToWebGL(0, 0),
                                             canvasCoordToWebGL(20 * 28, 15 * 28));

    gl2.useProgram(simpleRender)
    const aPosition = gl2.getAttribLocation(simpleRender, 'aPosition')
    gl2.enableVertexAttribArray(aPosition)
    gl2.bindBuffer(gl2.ARRAY_BUFFER, vertexBuffer)
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
