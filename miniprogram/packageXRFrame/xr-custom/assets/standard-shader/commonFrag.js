export default /* glsl */`
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#define EPSILON_ATAN 1e-2

#define WX_MANUAL_SRGB true
#define WX_SRGB_FAST_APPROXIMATION true

#define saturate( a ) clamp( a, 0.0, 1.0 )

float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }

struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
	vec3 clearcoatNormal;
};

struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};

struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};

uniform vec4 u_ambientLightColorIns;
uniform vec3 u_mainLightDir;
uniform vec4 u_mainLightColorIns;

uniform vec3 u_addLightsPos[4];
uniform vec3 u_addLightsDir[4];
uniform vec4 u_addLightsColorIns[4];
uniform vec4 u_addLightsInfo[4];


vec4 SRGBtoLINEAR(vec4 srgbIn)
{
#ifdef WX_MANUAL_SRGB

    #ifdef WX_SRGB_FAST_APPROXIMATION
        vec3 linOut = pow(srgbIn.xyz,vec3(2.2));
    #else //SRGB_FAST_APPROXIMATION
        vec3 bLess = step(vec3(0.04045),srgbIn.xyz);
        vec3 linOut = mix( srgbIn.xyz/vec3(12.92), pow((srgbIn.xyz+vec3(0.055))/vec3(1.055),vec3(2.4)), bLess );
    #endif //SRGB_FAST_APPROXIMATION

    return vec4(linOut, srgbIn.w);;

#else //MANUAL_SRGB
    
    return srgbIn;

#endif //MANUAL_SRGB
}

vec3 gammaCorrection(vec3 color) {
  return pow(color, vec3(1.0 / 2.2));
}

vec3 removeGammaCorrection(vec3 color) {
  return pow(color, vec3(2.2));
}

mat3 rotationMatY3(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat3(
		c, 0.0, -s,
		0.0, 1.0, 0.0,
		s, 0.0, c
	);
}

// https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/EXT_lights_image_based/README.md#rgbd
vec3 decodeRGBD(in vec4 color){
		return color.rgb / color.a;
}

float getFace( vec3 direction ) {
	vec3 absDirection = abs( direction );
	float face = - 1.0;
	if ( absDirection.x > absDirection.z ) {
		if ( absDirection.x > absDirection.y )
			face = direction.x > 0.0 ? 0.0 : 3.0;
		else
			face = direction.y > 0.0 ? 1.0 : 4.0;
	} else {
		if ( absDirection.z > absDirection.y )
			face = direction.z > 0.0 ? 2.0 : 5.0;
		else
			face = direction.y > 0.0 ? 1.0 : 4.0;
	}
	return face;
}
vec2 getUV( vec3 direction, float face ) {
	vec2 uv;
	if ( face == 0.0 ) {
		uv = vec2( direction.z, direction.y ) / abs( direction.x ); // pos x
	} else if ( face == 1.0 ) {
		uv = vec2( - direction.x, - direction.z ) / abs( direction.y ); // pos y
	} else if ( face == 2.0 ) {
		uv = vec2( - direction.x, direction.y ) / abs( direction.z ); // pos z
	} else if ( face == 3.0 ) {
		uv = vec2( - direction.z, direction.y ) / abs( direction.x ); // neg x
	} else if ( face == 4.0 ) {
		uv = vec2( - direction.x, direction.z ) / abs( direction.y ); // neg y
	} else {
		uv = vec2( direction.x, direction.y ) / abs( direction.z ); // neg z
	}
	return 0.5 * ( uv + 1.0 );
}


vec4 textureEnvMap(sampler2D texture, vec3 position){
	return texture2D(texture, vec2(atan(position.x, position.z) * RECIPROCAL_PI * 0.5+0.5,  acos(position.y) * RECIPROCAL_PI));
}

vec4 textureEnvMapIncludeMipmapsLod(sampler2D texture, vec3 position, float lod){
	lod = floor(lod);

	if (lod > 7.0) {
		lod = 7.0;
	}

	float posZ = abs(position.z) < EPSILON_ATAN ? EPSILON_ATAN : position.z;

	vec2 uv = vec2(atan(position.x, posZ) * RECIPROCAL_PI * 0.5 + 0.5, acos(position.y) * RECIPROCAL_PI);

	float scale = pow(2.0, lod);

	return texture2D(texture, vec2(uv.x / scale, (uv.y / scale / 2.0) + 1.0 - 1.0/pow(2.0, lod)));

	return vec4( position, 0.0);
}

vec4 textureBilinearEnvMap(sampler2D texture, vec3 direction, float roughness){

	float uvX = (atan(direction.x, direction.z) ) * RECIPROCAL_PI * 0.5 + 0.5;
	float uvY = acos(direction.y) * RECIPROCAL_PI;
	vec2 uv = vec2(uvX, uvY);
	vec4 envmap = texture2D(texture, uv);

	return envmap;

}


vec3 computeDiffuseSHLight(vec3 normal, in vec3 sh[9]) {
	return sh[0] +
		sh[1] * (normal.y) +
		sh[2] * (normal.z) +
		sh[3] * (normal.x) +
		sh[4] * (normal.y * normal.x) +
		sh[5] * (normal.y * normal.z) +
		sh[6] * ((3.0 * normal.z * normal.z) - 1.0) +
		sh[7] * (normal.z * normal.x) +
		sh[8] * (normal.x * normal.x - (normal.y * normal.y));
}


vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	// dir can be either a direction vector or a normal vector
	// upper-left 3x3 of matrix is assumed to be orthogonal
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}



`
