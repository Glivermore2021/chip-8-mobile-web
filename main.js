let Module = {};
let canvas = document.getElementById("screen");
let ctx = canvas.getContext("2d");
let videoPtr, videoMem;
let running = false;

Module.onRuntimeInitialized = () => {
  const init = Module.cwrap('init', null, []);
  const cycle = Module.cwrap('cycle', null, []);
  const load_rom = Module.cwrap('load_rom', null, ['number', 'number']);
  const get_video = Module.cwrap('get_video_buffer', 'number', []);
  const set_key = Module.cwrap('set_key', null, ['number', 'number']);

  document.getElementById("romInput").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const data = Module._malloc(buffer.byteLength);
    Module.HEAPU8.set(new Uint8Array(buffer), data);
    load_rom(data, buffer.byteLength);
    Module._free(data);
    init();
    videoPtr = get_video();
    videoMem = new Uint8Array(Module.HEAPU8.buffer, videoPtr, 64 * 32);
    if (!running) requestAnimationFrame(loop);
    running = true;
  };

  function loop() {
    cycle();
    draw();
    requestAnimationFrame(loop);
  }

  function draw() {
    ctx.clearRect(0, 0, 64, 32);
    let imgData = ctx.createImageData(64, 32);
    for (let i = 0; i < videoMem.length; i++) {
      let val = videoMem[i] ? 255 : 0;
      imgData.data[i * 4 + 0] = val;
      imgData.data[i * 4 + 1] = val;
      imgData.data[i * 4 + 2] = val;
      imgData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  window.pressKey = (k) => {
    set_key(k, 1);
    setTimeout(() => set_key(k, 0), 100);
  };
};
