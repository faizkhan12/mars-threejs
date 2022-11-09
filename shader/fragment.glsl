uniform sampler2D globeTexture;

varying vec2 vUV;
varying vec3 vertexNormal;

void main() {
    // derived from Mr.Doob
    float intensity = 1.05 - dot(vertexNormal,vec3(0.0,0.0,1.0));
    vec3 atmosphere = vec3(1.0,0.5,0.3) * pow(intensity,1.5);

    gl_FragColor = vec4(atmosphere + texture2D(globeTexture,vUV).xyz,1.0);
}