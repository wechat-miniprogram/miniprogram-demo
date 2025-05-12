export const YUVVertexShader =
/* glsl */
`#version 300 es
in vec3 a_pos;
in vec2 a_texCoord;

uniform mat3 u_displayTransform;

out vec2 v_uv;

void main(void) {
    vec3 p = u_displayTransform * a_pos;

    gl_Position = vec4(p, 1.0);

    v_uv = a_texCoord;
}
`
