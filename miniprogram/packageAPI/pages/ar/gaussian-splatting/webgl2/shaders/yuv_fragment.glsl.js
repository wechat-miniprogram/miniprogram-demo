export const YUVFragmentShader =
/* glsl */
`#version 300 es
precision mediump float;

uniform sampler2D u_y_texture;
uniform sampler2D u_uv_texture;

in vec2 v_uv;

out vec4 fragColor;

void main(void) {
    vec4 y_color = texture(u_y_texture, v_uv);
    vec4 uv_color = texture(u_uv_texture, v_uv);

    float Y, U, V;
    float R ,G, B;
    Y = y_color.r;
    U = uv_color.r - 0.5;
    V = uv_color.a - 0.5;
    
    R = Y + 1.402 * V;
    G = Y - 0.344 * U - 0.714 * V;
    B = Y + 1.772 * U;
    
    fragColor = vec4(R, G, B, 1.0);
}
`
