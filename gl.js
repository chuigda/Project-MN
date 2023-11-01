const createFloatRenderTarget = (gl, width, height, value) => {
    const framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    const data = new Float32Array(width * height)
    if (typeof value === 'function') {
        for (let i = 0; i < data.length; i++) {
            data[i] = value(i)
        }
    } else {
        data.fill(value || 0.0)
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, width, height, 0, gl.RED, gl.FLOAT, data)

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)
    return { framebuffer, texture }
}

const createShaderProgram = (gl, vsSource, fsSource) => {
    const shaderProgram = gl.createProgram()
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vsSource)
    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(vertexShader)
        const errorText = `编译顶点着色器时遇到错误:\n${error}`
        console.error(errorText)
        throw new Error(errorText)
    }

    gl.shaderSource(fragmentShader, fsSource)
    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(fragmentShader)
        const errorText = `编译片段着色器时遇到错误:\n${error}`
        console.error(errorText)
        throw new Error(errorText)
    }

    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(shaderProgram)
        const errorText = `链接着色器程序时遇到错误:\n${error}`
        console.error(errorText)
        throw new Error(errorText)
    }

    return shaderProgram
}

const createSimpleRectVBO = (gl, [x0, y0], [x1, y1]) => {
    const vertices = [
        x0, y0,
        x0, y1,
        x1, y0,
        x0, y1,
        x1, y1,
        x1, y0,
    ]
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return vertexBuffer
}
