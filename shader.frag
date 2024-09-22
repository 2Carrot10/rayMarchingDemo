#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float time;
uniform vec2 mouse;
vec2 mousePos;
float mouseDE;
#define REPEAT_DIST .5
#define LINE_WIDTH .002
#define ANIM_WIDTH .02
#define ANIM_SPEED .004

float smin(float a, float b) {
	float k = .009;
	float r = exp2(-a/k) + exp2(-b/k);
	return -k * log2(r);
}

float maxAbs(float a, float b) {
return (a) > (b)?a:b;
}

vec2 maxAbs(vec2 a, vec2 b) {
	if(a.x < b.x && a.y < b.y) return min(a,b);
	return max(a,b);
	//return vec2(maxAbs(a.x,b.x),maxAbs(a.y,b.y));
}

float DE(vec2 pos) {
	//pos = mod(pos + REPEAT_DIST / 2.0, REPEAT_DIST) - REPEAT_DIST / 2.0;
	float circle = length(pos - vec2(0,mod(time/5.0,3.0) - 1.5)) - .1;
	float square = length(maxAbs(abs(pos) - vec2(.58, .03),vec2(0.0)));
	float negetiveSquare = length(max(abs(pos) - vec2(.18,.04),0.0));
	//float square = max(abs(pos.x),abs(pos.y)) - .09;
	//change sign of both of them or change max to min
	//return negetiveSquare;//max(-negetiveSquare, square);//max(square,negetiveSquare);
	return smin(square, circle);//max(circle, square);
}
float round(float a){
	if(a >= .5){
		return 1.0;
	}
	return 0.0;
}

void main()
{
	//lights[0].pos = vec3(-7.0, .0, 0.7);
	//lights[0].color = vec3(.1, 0.1, 1.);
	//lights[0].power = 1.0;

	float x = (gl_FragCoord.x / (u_resolution.y)) - 0.5 * u_resolution.x / u_resolution.y; 
	float y = (gl_FragCoord.y / (u_resolution.y)) - 0.5;
	mousePos = vec2((mouse.x / u_resolution.y) - 0.5 * u_resolution.x / u_resolution.y,
	-(mouse.y / u_resolution.y) + .5);
	//float y = (gl_FragCoord.y / (u_resolution.y  + 1.0)) - 0.5;
	mouseDE = DE(mousePos);
	float dist = DE(vec2(x,y));
	if(dist < LINE_WIDTH && dist > -LINE_WIDTH) {
		gl_FragColor = vec4(1.0,1.0,1.0,1.0);
	}
	else if(dist > 0.0){
	float color = mod(dist + time*ANIM_SPEED, ANIM_WIDTH) / ANIM_WIDTH;
	color = round(color);
	gl_FragColor = vec4(color,0.0,0.0,1.0);
	//gl_FragColor = vec4(0.0);
	}
	else{

	float color = mod(-(dist + time*ANIM_SPEED), ANIM_WIDTH) / ANIM_WIDTH;
	
	color = round(color);
	//gl_FragColor = vec4(1.0);
	gl_FragColor = vec4(0.0,0.0,color,1.0);
	}
	if(length(mousePos - vec2(x,y)) < .008) gl_FragColor = vec4(1.0);
	if(abs(length(mousePos - vec2(x,y)) - mouseDE) < .003) gl_FragColor = vec4(1.0);
}
