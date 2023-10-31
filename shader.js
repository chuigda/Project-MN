const forwardPropagateVS = `#version 300 es
precision highp float;
precision highp int;

uniform ivec2 inputSize;

in ivec2 aPosition;
flat out ivec2 vPosition;

void main() {
    vPosition = aPosition;

    vec2 position = vec2(aPosition) / vec2(inputSize);
    gl_Position = vec4(2.0 * position - 1.0, 0.0, 1.0);
}
`

const forwardPropagateFS = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D inputTex;
uniform sampler2D weightTex;
uniform sampler2D biasTex;
uniform ivec2 inputSize;
uniform ivec2 weightSize;

flat in ivec2 vPosition;
out vec4 fragColor;

float sigmoid(float x) {
    return 1.0 / (1.0 + exp(-x));
}

float readInput(ivec2 position) {
    vec2 uv = vec2(position) / vec2(inputSize);
    return texture(inputTex, uv).r;
}

float readWeight(ivec2 neuron, ivec2 weightIndex) {
    vec2 uv = vec2(neuron) / vec2(weightSize) +
              vec2(weightIndex) / (vec2(inputSize) * vec2(weightSize));
    return texture(weightTex, uv).r;
}

float readBias(ivec2 neuron) {
    vec2 uv = vec2(neuron) / vec2(inputSize);
    return texture(biasTex, uv).r;
}

void main() {
    float sum = readBias(vPosition);
    for (int i = 0; i < weightSize.x; i++) {
        for (int j = 0; j < weightSize.y; j++) {
            sum += readInput(ivec2(i, j)) * readWeight(vPosition, ivec2(i, j));
        }
    }

    fragColor = vec4(sigmoid(sum), 0.0, 0.0, 1.0);
}
`

const simpleTexDisplayVS = `#version 300 es
precision highp float;

in vec2 aPosition;
out vec2 vTexCoord;

void main() {
    vTexCoord = aPosition + vec2(0.5);
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const simpleTexDisplayFS = `#version 300 es
precision highp float;

uniform sampler2D tex;
in vec2 vTexCoord;
out vec4 fragColor;

void main() {
    float value = texture(tex, vTexCoord).r;
    value = value + 0.5;

    fragColor = vec4(value, value, value, 1.0);
}
`
