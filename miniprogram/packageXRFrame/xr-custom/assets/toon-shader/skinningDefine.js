export default
/* glsl */
`
#ifdef WX_SKINNED
attribute highp vec4 a_boneIndices;
attribute highp vec4 a_weights;
  #ifdef WX_USE_BONE_MATRIX_TEXTURE
    // #ifndef WX_BONE_SAMPLER_HELPER
    // 请不要这样写，在部分安卓机上会出错，比如MTK、麒麟的设备很容易出现
    // #define WX_BONE_SAMPLER_HELPER(row, col) \
    //   texture2D(u_boneMatrixTexture, vec2((col) / 4.0, (row) / float(WX_BONE_NUM)))
    // #endif
  uniform sampler2D u_boneMatrixTexture;
  mat4 sampleFromBoneMatrixTexture(float index) {
    float row = index + 0.5;
    float col = 0.5;
    return mat4(
      texture2D(u_boneMatrixTexture, vec2((col + .0) / 4.0, (row) / float(WX_BONE_NUM))),
      texture2D(u_boneMatrixTexture, vec2((col + 1.0) / 4.0, (row) / float(WX_BONE_NUM))),
      texture2D(u_boneMatrixTexture, vec2((col + 2.0) / 4.0, (row) / float(WX_BONE_NUM))),
      texture2D(u_boneMatrixTexture, vec2((col + 3.0) / 4.0, (row) / float(WX_BONE_NUM)))
    );
  }
  #else
  uniform mat4 u_boneOffsetMatrix[WX_BONE_NUM];
  #endif // WX_USE_BONE_MATRIX_TEXTURE
#endif // WX_SKINNED

#ifdef WX_SKINNED
mat4 getBoneMat() {
  #ifdef WX_USE_BONE_MATRIX_TEXTURE
  mat4 boneMatX = sampleFromBoneMatrixTexture(a_boneIndices.x);
  mat4 boneMatY = sampleFromBoneMatrixTexture(a_boneIndices.y);
  mat4 boneMatZ = sampleFromBoneMatrixTexture(a_boneIndices.z);
  mat4 boneMatW = sampleFromBoneMatrixTexture(a_boneIndices.w);
  #else
  mat4 boneMatX = u_boneOffsetMatrix[int(a_boneIndices.x)];
  mat4 boneMatY = u_boneOffsetMatrix[int(a_boneIndices.y)];
  mat4 boneMatZ = u_boneOffsetMatrix[int(a_boneIndices.z)];
  mat4 boneMatW = u_boneOffsetMatrix[int(a_boneIndices.w)];
  #endif // WX_USE_BONE_MATRIX_TEXTURE
  mat4 boneMat = a_weights.x * boneMatX + a_weights.y * boneMatY + a_weights.z * boneMatZ + a_weights.w * boneMatW;
  return boneMat;
}
#endif // WX_SKINNED

vec4 getSkinningWorldPosition(vec4 origin) {
#ifdef WX_SKINNED
    return getBoneMat() * origin;
#else
    return u_world * origin;
#endif // WX_SKINNED
}

`
