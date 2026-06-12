/* ===== Projects page background shader (mesh gradient) ===== */
(function () {
  'use strict';
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  var canvas = document.getElementById('projects-bg');
  if (!canvas) return;
  var gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false });
  if (!gl) return;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    canvas.width  = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  var vs = 'attribute vec2 a; void main(){gl_Position=vec4(a,0.0,1.0);}';
  var fs = [
    'precision highp float;',
    'uniform vec2 u_res; uniform float u_t; uniform float u_int;',
    'uniform vec3 cNavy, cBlue, cGold, cLight;',
    'float n2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);float a=n2(i),b=n2(i+vec2(1,0)),c=n2(i+vec2(0,1)),d=n2(i+vec2(1,1));vec2 u=f*f*(3.0-2.0*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}',
    'void main(){',
    '  vec2 p=(gl_FragCoord.xy-0.5*u_res)/min(u_res.x,u_res.y);',
    '  float t=u_t*0.35;',
    '  float f1=vnoise(p*1.6+vec2(cos(t)*1.2,sin(t*0.8)*1.2));',
    '  float f2=vnoise(p*2.4+vec2(sin(t*1.1)*1.5,cos(t*0.6)*1.5)+5.2);',
    '  float f3=vnoise(p*3.1+vec2(cos(t*0.7)*1.8,sin(t*1.2)*1.8)-3.7);',
    '  vec3 col=cNavy;',
    '  col=mix(col,cBlue,smoothstep(0.25,0.85,f1));',
    '  col=mix(col,cGold,smoothstep(0.55,0.95,f2)*0.55*u_int);',
    '  col=mix(col,cLight,pow(f3,4.0)*0.14*u_int);',
    '  float v=1.0-smoothstep(0.55,1.2,length(p));',
    '  col*=mix(0.55,1.0,v);',
    '  float g=(n2(gl_FragCoord.xy+u_t)-0.5)*0.03;',
    '  col+=g;',
    '  gl_FragColor=vec4(col,1.0);',
    '}'
  ].join('\n');

  function sh(type, src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  var p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  gl.useProgram(p);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(p, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform3fv(gl.getUniformLocation(p,'cNavy'),  [0x21/255,0x35/255,0x55/255]);
  gl.uniform3fv(gl.getUniformLocation(p,'cBlue'),  [0x4F/255,0x70/255,0x9C/255]);
  gl.uniform3fv(gl.getUniformLocation(p,'cGold'),  [0xE5/255,0xD2/255,0x83/255]);
  gl.uniform3fv(gl.getUniformLocation(p,'cLight'), [0xF0/255,0xF0/255,0xF1/255]);

  var uRes = gl.getUniformLocation(p,'u_res');
  var uT   = gl.getUniformLocation(p,'u_t');
  var uInt = gl.getUniformLocation(p,'u_int');

  var t0 = performance.now();
  function frame(now) {
    var t = (now - t0) / 1000;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uT,   t);
    gl.uniform1f(uInt, 1.4);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
