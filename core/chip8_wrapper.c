#include "chip8.h"
#include <emscripten.h>

static Chip8 chip;

EMSCRIPTEN_KEEPALIVE
void init() {
    chip8_init(&chip);
}

EMSCRIPTEN_KEEPALIVE
void load_rom(uint8_t* data, int size) {
    chip8_load_rom(&chip, data, size);
}

EMSCRIPTEN_KEEPALIVE
void cycle() {
    chip8_cycle(&chip);
}

EMSCRIPTEN_KEEPALIVE
uint8_t* get_video_buffer() {
    return chip.video;
}

EMSCRIPTEN_KEEPALIVE
void set_key(uint8_t index, uint8_t value) {
    chip.keypad[index] = value;
}
