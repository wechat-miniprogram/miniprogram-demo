export const splatRTFragmentShader =
/* glsl */
`#version 300 es
precision mediump float;

uniform sampler2D u_splat;

in vec2 v_uv;

out vec4 fragColor;

void main(void) {
    fragColor = texture(u_splat, v_uv);
}
`
