varying vec3 vertexNormal;

void main() {
    float intensity = pow(0.65 - dot(vertexNormal, vec3(0,0,1.0)),2.0);
    gl_FragColor = vec4(1.0,0.5,0.3,1.0) * intensity;
}