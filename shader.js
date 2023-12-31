const genericFillingVS = `#version 300 es
precision highp float;

in vec2 aPosition;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const forwardPropagateMultiplyFS = `#version 300 es
precision highp float;

uniform sampler2D inputTex;
uniform sampler2D weightTex;
uniform ivec2 inputSize;

out vec4 fragColor;

void main() {
    ivec2 fragCoord = ivec2(gl_FragCoord.xy);
    ivec2 inputCoord = fragCoord % inputSize;

    float inValue = texelFetch(inputTex, inputCoord, 0).r;
    float weight = texelFetch(weightTex, fragCoord, 0).r;

    fragColor = vec4(inValue * weight, 0.0, 0.0, 1.0);
}
`

const forwardPropagateAddFS = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D premultipliedTex;
uniform sampler2D biasTex;
uniform ivec2 inputSize;
uniform ivec2 weightSize;

out vec4 fragColor;

float sigmoid(float x) {
    return 1.0 / (1.0 + exp(-x));
}

void main() {
    ivec2 fragCoord = ivec2(gl_FragCoord.xy);
    ivec2 weightCoord = fragCoord * inputSize;

    float sum = texelFetch(biasTex, fragCoord, 0).r;
    for (int i = 0; i < weightSize.x; i++) {
        for (int j = 0; j < weightSize.y; j++) {
            sum += texelFetch(premultipliedTex, weightCoord + ivec2(i, j), 0).r;
        }
    }

    fragColor = vec4(sigmoid(sum), 0.0, 0.0, 1.0);
}
`

const simpleTexDisplayFS = `#version 300 es
precision highp float;

uniform sampler2D tex;
uniform int canvasHeight;
out vec4 fragColor;

void main() {
    ivec2 fragCoord = ivec2(gl_FragCoord.xy);
    fragCoord.y = canvasHeight - fragCoord.y;
    float value = texelFetch(tex, fragCoord, 0).r;
    if (value > 0.0) {
        fragColor = vec4(value, 0.0, 0.0, 1.0);
    } else {
        fragColor = vec4(0.0, 0.0, -value, 1.0);
    }
}
`
