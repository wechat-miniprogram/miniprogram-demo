export const splatRTVertexShader =
/* glsl */
`#version 300 es
in vec3 a_pos;
in vec2 a_texCoord;

out vec2 v_uv;

void main(void) {
    gl_Position = vec4(a_pos, 1.0);

    v_uv = a_texCoord;
}
`
