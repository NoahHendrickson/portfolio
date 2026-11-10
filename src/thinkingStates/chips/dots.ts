import type { ChipDef } from "./types";
import type { PixUtils } from "../engine/pix";

export const DOT_CHIPS: ChipDef<"pix", PixUtils>[] = [
  {
    system: "pix",
    id: "spin",
    label: "Thinking",
    name: "Spin",
    color: "#4ADE80",
    group: "dots",
    draw: (t, _ctx, o) => {
      var ring = [
          [0, 0],
          [1, 0],
          [1, 1],
          [1, 2],
          [0, 2],
          [0, 1],
        ],
        head = Math.floor(t * 10) % 6;
      for (var k = 0; k < 6; k++) {
        var d = (k - head + 6) % 6;
        o.pix(2, 4, ring[k][0], ring[k][1], d < 4 ? 1 - d / 4 : 0);
      }
    },
  },
  {
    system: "pix",
    id: "think-orbit",
    label: "Thinking",
    name: "Orbit",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      var p = [
          [0, 0],
          [1, 0],
          [2, 0],
          [2, 1],
          [2, 2],
          [1, 2],
          [0, 2],
          [0, 1],
        ],
        h = Math.floor(t * 8) % 8;
      o.pix(3, 3, p[h][0], p[h][1], 1);
      o.pix(3, 3, p[(h + 7) % 8][0], p[(h + 7) % 8][1], 1);
    },
  },
  {
    system: "pix",
    id: "think-snake",
    label: "Thinking",
    name: "Snake",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      var p = [
          [0, 0],
          [1, 0],
          [2, 0],
          [2, 1],
          [2, 2],
          [1, 2],
          [0, 2],
          [0, 1],
          [1, 1],
          [1, 0],
          [0, 0],
          [0, 1],
          [0, 2],
          [1, 2],
          [1, 1],
          [2, 1],
          [2, 0],
          [1, 0],
          [1, 1],
          [1, 2],
          [2, 2],
          [2, 1],
          [1, 1],
          [0, 1],
          [0, 0],
          [1, 0],
          [2, 0],
          [2, 1],
          [1, 1],
          [1, 2],
          [0, 2],
          [0, 1],
          [0, 0],
          [1, 0],
          [1, 1],
          [2, 1],
          [2, 2],
          [1, 2],
          [0, 2],
          [0, 1],
        ],
        n = p.length,
        h = Math.floor(t * 3.2) % n,
        k;
      for (k = 0; k < 3; k++)
        o.pix(3, 3, p[(h - k + n) % n][0], p[(h - k + n) % n][1], 1);
    },
  },
  {
    system: "pix",
    id: "think-rows",
    label: "Thinking",
    name: "Rows",
    color: "#4ADE80",
    group: "dots",
    shape: "square",
    draw: (t, _ctx, o) => {
      var r = Math.floor(t * 3) % 3,
        i;
      for (i = 0; i < 3; i++) o.pix(3, 3, i, r, 1);
    },
  },
  {
    system: "pix",
    id: "think-cross",
    label: "Thinking",
    name: "Cross",
    color: "#4ADE80",
    group: "dots",
    shape: "square",
    draw: (t, _ctx, o) => {
      var plus = [
          [1, 0],
          [0, 1],
          [1, 1],
          [2, 1],
          [1, 2],
        ],
        x = [
          [0, 0],
          [2, 0],
          [1, 1],
          [0, 2],
          [2, 2],
        ],
        s = Math.floor(t * 2) % 2 ? x : plus,
        k;
      for (k = 0; k < s.length; k++) o.pix(3, 3, s[k][0], s[k][1], 1);
    },
  },
  {
    system: "pix",
    id: "think-spark",
    label: "Thinking",
    name: "Spark",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      var n = Math.floor(t * 6);
      o.pix(3, 3, n % 3, Math.floor(n / 3) % 3, 1);
      o.pix(3, 3, (n * 2 + 1) % 3, Math.floor((n * 3 + 4) / 3) % 3, 1);
    },
  },
  {
    system: "pix",
    id: "think-braille",
    label: "Thinking",
    name: "Braille",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dots", decoded from braille; each frame fades out over the next.
      var F = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏",
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F.charCodeAt(Math.floor(k) % n) - 10240,
        prev = F.charCodeAt((Math.floor(k) + n - 1) % n) - 10240,
        f = k % 1;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, cur & B[j * 2 + i] ? 1 : prev & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
    },
  },
  {
    system: "pix",
    id: "think-gap",
    label: "Thinking",
    name: "Gap",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dots2", decoded from braille; each frame fades out over the next.
      var F = "⣾⣽⣻⢿⡿⣟⣯⣷",
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F.charCodeAt(Math.floor(k) % n) - 10240,
        prev = F.charCodeAt((Math.floor(k) + n - 1) % n) - 10240,
        f = k % 1;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, cur & B[j * 2 + i] ? 1 : prev & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
    },
  },
  {
    system: "pix",
    id: "think-curl",
    label: "Thinking",
    name: "Curl",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dots3", decoded from braille; each frame fades out over the next.
      var F = "⠋⠙⠚⠞⠖⠦⠴⠲⠳⠓",
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F.charCodeAt(Math.floor(k) % n) - 10240,
        prev = F.charCodeAt((Math.floor(k) + n - 1) % n) - 10240,
        f = k % 1;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, cur & B[j * 2 + i] ? 1 : prev & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
    },
  },
  {
    system: "pix",
    id: "think-sweep",
    label: "Thinking",
    name: "Sweep",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dots4", decoded from braille; each frame fades out over the next.
      var F = "⠄⠆⠇⠋⠙⠸⠰⠠⠰⠸⠙⠋⠇⠆",
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F.charCodeAt(Math.floor(k) % n) - 10240,
        prev = F.charCodeAt((Math.floor(k) + n - 1) % n) - 10240,
        f = k % 1;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, cur & B[j * 2 + i] ? 1 : prev & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
    },
  },
  {
    system: "pix",
    id: "think-meander",
    label: "Thinking",
    name: "Meander",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dots6", decoded from braille; each frame fades out over the next.
      var F = "⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠴⠲⠒⠂⠂⠒⠚⠙⠉⠁",
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F.charCodeAt(Math.floor(k) % n) - 10240,
        prev = F.charCodeAt((Math.floor(k) + n - 1) % n) - 10240,
        f = k % 1;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, cur & B[j * 2 + i] ? 1 : prev & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
    },
  },
  {
    system: "pix",
    id: "think-notch",
    label: "Thinking",
    name: "Notch",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dots9", decoded from braille; each frame fades out over the next.
      var F = "⢹⢺⢼⣸⣇⡧⡗⡏",
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F.charCodeAt(Math.floor(k) % n) - 10240,
        prev = F.charCodeAt((Math.floor(k) + n - 1) % n) - 10240,
        f = k % 1;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, cur & B[j * 2 + i] ? 1 : prev & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
    },
  },
  {
    system: "pix",
    id: "think-tumble",
    label: "Thinking",
    name: "Tumble",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dots10", decoded from braille; each frame fades out over the next.
      var F = "⢄⢂⢁⡁⡈⡐⡠",
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F.charCodeAt(Math.floor(k) % n) - 10240,
        prev = F.charCodeAt((Math.floor(k) + n - 1) % n) - 10240,
        f = k % 1;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, cur & B[j * 2 + i] ? 1 : prev & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
    },
  },
  {
    system: "pix",
    id: "think-lone",
    label: "Thinking",
    name: "Lone dot",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dots11", decoded from braille; each frame fades out over the next.
      var F = "⠁⠂⠄⡀⢀⠠⠐⠈",
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 10,
        cur = F.charCodeAt(Math.floor(k) % n) - 10240,
        prev = F.charCodeAt((Math.floor(k) + n - 1) % n) - 10240,
        f = k % 1;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, cur & B[j * 2 + i] ? 1 : prev & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
    },
  },
  {
    system: "pix",
    id: "think-weave",
    label: "Thinking",
    name: "Weave",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dots12", decoded from braille; each frame fades out over the next. Two glyphs wide.
      var F = [
          "⢀⠀", "⡀⠀", "⠄⠀", "⢂⠀", "⡂⠀", "⠅⠀", "⢃⠀", "⡃⠀", "⠍⠀", "⢋⠀",
          "⡋⠀", "⠍⠁", "⢋⠁", "⡋⠁", "⠍⠉", "⠋⠉", "⠋⠉", "⠉⠙", "⠉⠙", "⠉⠩",
          "⠈⢙", "⠈⡙", "⢈⠩", "⡀⢙", "⠄⡙", "⢂⠩", "⡂⢘", "⠅⡘", "⢃⠨", "⡃⢐",
          "⠍⡐", "⢋⠠", "⡋⢀", "⠍⡁", "⢋⠁", "⡋⠁", "⠍⠉", "⠋⠉", "⠋⠉", "⠉⠙",
          "⠉⠙", "⠉⠩", "⠈⢙", "⠈⡙", "⠈⠩", "⠀⢙", "⠀⡙", "⠀⠩", "⠀⢘", "⠀⡘",
          "⠀⠨", "⠀⢐", "⠀⡐", "⠀⠠", "⠀⢀", "⠀⡀",
        ],
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F[Math.floor(k) % n],
        prev = F[(Math.floor(k) + n - 1) % n],
        f = k % 1;
      for (var c = 0; c < 2; c++) {
        var cb = cur.charCodeAt(c) - 10240,
          pb = prev.charCodeAt(c) - 10240;
        for (var j = 0; j < 4; j++)
          for (var i = 0; i < 2; i++)
            o.pix(4, 4, c * 2 + i, j, cb & B[j * 2 + i] ? 1 : pb & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
      }
    },
  },
  {
    system: "pix",
    id: "think-loop",
    label: "Thinking",
    name: "Loop",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dots14", decoded from braille; each frame fades out over the next. Two glyphs wide.
      var F = [
          "⠉⠉", "⠈⠙", "⠀⠹", "⠀⢸", "⠀⣰", "⢀⣠", "⣀⣀", "⣄⡀", "⣆⠀", "⡇⠀",
          "⠏⠀", "⠋⠁",
        ],
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F[Math.floor(k) % n],
        prev = F[(Math.floor(k) + n - 1) % n],
        f = k % 1;
      for (var c = 0; c < 2; c++) {
        var cb = cur.charCodeAt(c) - 10240,
          pb = prev.charCodeAt(c) - 10240;
        for (var j = 0; j < 4; j++)
          for (var i = 0; i < 2; i++)
            o.pix(4, 4, c * 2 + i, j, cb & B[j * 2 + i] ? 1 : pb & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
      }
    },
  },
  {
    system: "pix",
    id: "think-binary",
    label: "Thinking",
    name: "Binary",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dots8Bit": counts through all 256 braille patterns.
      var F = "⠀⠁⠂⠃⠄⠅⠆⠇⡀⡁⡂⡃⡄⡅⡆⡇⠈⠉⠊⠋⠌⠍⠎⠏⡈⡉⡊⡋⡌⡍⡎⡏⠐⠑⠒⠓⠔⠕⠖⠗⡐⡑⡒⡓⡔⡕⡖⡗⠘⠙⠚⠛⠜⠝⠞⠟⡘⡙⡚⡛⡜⡝⡞⡟⠠⠡⠢⠣⠤⠥⠦⠧⡠⡡⡢⡣⡤⡥⡦⡧⠨⠩⠪⠫⠬⠭⠮⠯⡨⡩⡪⡫⡬⡭⡮⡯⠰⠱⠲⠳⠴⠵⠶⠷⡰⡱⡲⡳⡴⡵⡶⡷⠸⠹⠺⠻⠼⠽⠾⠿⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⣀⣁⣂⣃⣄⣅⣆⣇⢈⢉⢊⢋⢌⢍⢎⢏⣈⣉⣊⣋⣌⣍⣎⣏⢐⢑⢒⢓⢔⢕⢖⢗⣐⣑⣒⣓⣔⣕⣖⣗⢘⢙⢚⢛⢜⢝⢞⢟⣘⣙⣚⣛⣜⣝⣞⣟⢠⢡⢢⢣⢤⢥⢦⢧⣠⣡⣢⣣⣤⣥⣦⣧⢨⢩⢪⢫⢬⢭⢮⢯⣨⣩⣪⣫⣬⣭⣮⣯⢰⢱⢲⢳⢴⢵⢶⢷⣰⣱⣲⣳⣴⣵⣶⣷⢸⢹⢺⢻⢼⢽⢾⢿⣸⣹⣺⣻⣼⣽⣾⣿",
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F.charCodeAt(Math.floor(k) % n) - 10240,
        prev = F.charCodeAt((Math.floor(k) + n - 1) % n) - 10240,
        f = k % 1;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, cur & B[j * 2 + i] ? 1 : prev & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
    },
  },
  {
    system: "pix",
    id: "think-circle",
    label: "Thinking",
    name: "Circle",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "dotsCircle", decoded from braille; each frame fades out over the next. Two glyphs wide.
      var F = [
          "⢎⠀", "⠎⠁", "⠊⠑", "⠈⠱", "⠀⡱", "⢀⡰", "⢄⡠", "⢆⡀",
        ],
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F[Math.floor(k) % n],
        prev = F[(Math.floor(k) + n - 1) % n],
        f = k % 1;
      for (var c = 0; c < 2; c++) {
        var cb = cur.charCodeAt(c) - 10240,
          pb = prev.charCodeAt(c) - 10240;
        for (var j = 0; j < 4; j++)
          for (var i = 0; i < 2; i++)
            o.pix(4, 4, c * 2 + i, j, cb & B[j * 2 + i] ? 1 : pb & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
      }
    },
  },
  {
    system: "pix",
    id: "think-pour",
    label: "Thinking",
    name: "Pour",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // cli-spinners "sand", decoded from braille; each frame fades out over the next.
      var F = "⠁⠂⠄⡀⡈⡐⡠⣀⣁⣂⣄⣌⣔⣤⣥⣦⣮⣶⣷⣿⡿⠿⢟⠟⡛⠛⠫⢋⠋⠍⡉⠉⠑⠡⢁",
        B = [1, 8, 2, 16, 4, 32, 64, 128],
        n = F.length,
        k = t * 12.5,
        cur = F.charCodeAt(Math.floor(k) % n) - 10240,
        prev = F.charCodeAt((Math.floor(k) + n - 1) % n) - 10240,
        f = k % 1;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, cur & B[j * 2 + i] ? 1 : prev & B[j * 2 + i] ? 0.45 * (1 - f) : 0);
    },
  },
  {
    system: "pix",
    id: "think-comet",
    label: "Thinking",
    name: "Comet",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // One dot laps the 2×4 outline with a smooth fading tail.
      var ring = [0, 0, 1, 0, 1, 1, 1, 2, 1, 3, 0, 3, 0, 2, 0, 1],
        h = t * 9;
      for (var k = 0; k < 8; k++) {
        var d = (((h - k) % 8) + 8) % 8;
        o.pix(2, 4, ring[k * 2], ring[k * 2 + 1], d < 4 ? Math.pow(1 - d / 4, 1.5) : 0);
      }
    },
  },
  {
    system: "pix",
    id: "think-twin",
    label: "Thinking",
    name: "Twin spin",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // Two dots chase each other around the outline, half a lap apart.
      var ring = [0, 0, 1, 0, 1, 1, 1, 2, 1, 3, 0, 3, 0, 2, 0, 1],
        h = t * 8;
      for (var k = 0; k < 8; k++) {
        var d1 = (((h - k) % 8) + 8) % 8,
          d2 = (((h + 4 - k) % 8) + 8) % 8;
        o.pix(2, 4, ring[k * 2], ring[k * 2 + 1], Math.max(d1 < 2.5 ? 1 - d1 / 2.5 : 0, d2 < 2.5 ? 1 - d2 / 2.5 : 0));
      }
    },
  },
  {
    system: "pix",
    id: "think-tide",
    label: "Thinking",
    name: "Tide",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // Rows swell from the bottom up.
      for (var j = 0; j < 4; j++) {
        var a = Math.pow(Math.max(0, Math.sin(t * 4 - (3 - j) * 0.9)), 2);
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, a);
      }
    },
  },
  {
    system: "pix",
    id: "think-beat",
    label: "Thinking",
    name: "Beat",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // A double pulse from the middle rows outward, then a rest.
      for (var j = 0; j < 4; j++) {
        var p = (t * 0.9 - Math.abs(j - 1.5) * 0.04) % 1,
          b = Math.exp(-Math.pow((p - 0.1) * 16, 2)) + 0.7 * Math.exp(-Math.pow((p - 0.3) * 16, 2));
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, 0.12 + 0.88 * b);
      }
    },
  },
  {
    system: "pix",
    id: "think-glimmer",
    label: "Thinking",
    name: "Glimmer",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // Each dot twinkles on its own rhythm.
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 2; i++) {
          var h = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
          h -= Math.floor(h);
          o.pix(2, 4, i, j, Math.pow(0.5 + 0.5 * Math.sin(t * (2.5 + 2 * h) + h * 20), 4));
        }
    },
  },
  {
    system: "pix",
    id: "think-ribbon",
    label: "Thinking",
    name: "Ribbon",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // A wave rolls across a five-dot field.
      for (var c = 0; c < 5; c++) {
        var y = 1.5 + 1.5 * Math.sin(t * 5 - c * 0.96);
        for (var j = 0; j < 4; j++) o.pix(5, 4, c, j, Math.max(0, 1 - Math.abs(j - y)));
      }
    },
  },
  {
    system: "pix",
    id: "think-escalator",
    label: "Thinking",
    name: "Escalator",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // The left column climbs while the right one descends.
      var h = t * 6;
      for (var j = 0; j < 4; j++) {
        var up = (((h - (3 - j)) % 4) + 4) % 4,
          down = (((h - j) % 4) + 4) % 4;
        o.pix(2, 4, 0, j, up < 2 ? 1 - up / 2 : 0);
        o.pix(2, 4, 1, j, down < 2 ? 1 - down / 2 : 0);
      }
    },
  },
  {
    system: "pix",
    id: "think-elevator",
    label: "Thinking",
    name: "Elevator",
    color: "#4ADE80",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // A lit row rides up and down, trailing a soft glow.
      var q = (t * 5) % 6,
        y = q < 3 ? q : 6 - q;
      for (var j = 0; j < 4; j++) {
        var a = Math.max(0, 1 - Math.abs(j - y) * 0.8);
        for (var i = 0; i < 2; i++) o.pix(2, 4, i, j, a * a);
      }
    },
  },
  {
    system: "pix",
    id: "dotwave",
    label: "Analysing",
    name: "Wave",
    color: "#60A5FA",
    group: "dots",
    draw: (t, _ctx, o) => {
      for (var i = 0; i < 5; i++) {
        var y = 1.5 + 1.4 * Math.sin(t * 4 - i * 0.88);
        for (var j = 0; j < 4; j++) o.pix(5, 4, i, j, Math.exp(-Math.abs(j - y) * 1.6));
      }
    },
  },
  {
    system: "pix",
    id: "dna",
    label: "Reading docs",
    name: "DNA",
    color: "#F87171",
    group: "dots",
    draw: (t, _ctx, o) => {
      for (var i = 0; i < 5; i++) {
        var a = t * 3.2 - i * 0.8,
          y1 = 1.5 + 1.4 * Math.sin(a),
          y2 = 1.5 + 1.4 * Math.sin(a + 3.1416);
        for (var j = 0; j < 4; j++)
          o.pix(
            5,
            4,
            i,
            j,
            Math.max(
              Math.exp(-Math.abs(j - y1) * 2.2),
              Math.exp(-Math.abs(j - y2) * 2.2),
            ),
          );
      }
    },
  },
  {
    system: "pix",
    id: "sand",
    label: "Debugging",
    name: "Sand",
    color: "#38BDF8",
    group: "dots",
    draw: (t, _ctx, o) => {
      for (var i = 0; i < 5; i++) {
        var y = ((t * (1.2 + i * 0.17) + i * 1.7) % 5) - 0.5;
        for (var j = 0; j < 4; j++) o.pix(5, 4, i, j, Math.exp(-Math.abs(j - y) * 2));
      }
    },
  },
  {
    system: "pix",
    id: "dotscan",
    label: "Searching",
    name: "Scan",
    color: "#FBBF24",
    group: "dots",
    draw: (t, _ctx, o) => {
      var c = ((t * 4) % 7) - 1;
      for (var i = 0; i < 5; i++)
        for (var j = 0; j < 4; j++) o.pix(5, 4, i, j, Math.exp(-Math.abs(i - c) * 1.1));
    },
  },
  {
    system: "pix",
    id: "cascade",
    label: "Indexing",
    name: "Cascade",
    color: "#A78BFA",
    group: "dots",
    draw: (t, _ctx, o) => {
      var head = (t * 12) % 25;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 5; i++) {
          var k = j * 5 + i;
          o.pix(5, 4, i, j, k < head && k > head - 5 ? 1 - (head - k) / 5 : 0);
        }
    },
  },
  {
    system: "pix",
    id: "dotspark",
    label: "Generating",
    name: "Sparkle",
    color: "#E879F9",
    group: "dots",
    draw: (t, _ctx, o) => {
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 5; i++) {
          var h = Math.sin(i * 12.9898 + j * 78.233);
          h = h - Math.floor(h);
          o.pix(
            5,
            4,
            i,
            j,
            Math.pow(Math.max(0, Math.sin(6.283 * (t * (0.4 + h * 0.7) + h * 9))), 10),
          );
        }
    },
  },
  {
    system: "pix",
    id: "dotripple",
    label: "Syncing",
    name: "Ripple",
    color: "#22D3EE",
    group: "dots",
    draw: (t, _ctx, o) => {
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 5; i++) {
          var d = Math.hypot(i - 2, j - 1.5),
            a = 0.5 + 0.5 * Math.sin(t * 5 - d * 1.4);
          o.pix(5, 4, i, j, a * a * a);
        }
    },
  },
  {
    system: "pix",
    id: "dotrain",
    label: "Compiling",
    name: "Rain",
    color: "#34D399",
    group: "dots",
    draw: (t, _ctx, o) => {
      for (var i = 0; i < 5; i++) {
        var sp = 2.2 + (Math.sin(i * 5.7) * 0.5 + 0.5) * 2,
          y = ((t * sp + i * 1.3) % 6) - 1;
        for (var j = 0; j < 4; j++) {
          var dy = y - j;
          o.pix(5, 4, i, j, dy >= 0 ? Math.exp(-dy * 0.9) : Math.exp(dy * 8));
        }
      }
    },
  },
  {
    system: "pix",
    id: "dotbreathe",
    label: "Reasoning",
    name: "Breathe",
    color: "#FB923C",
    group: "dots",
    draw: (t, _ctx, o) => {
      var b = Math.pow(0.5 + 0.5 * Math.sin(t * 2.4), 1.5);
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 5; i++)
          o.pix(5, 4, i, j, b * Math.exp(-Math.hypot(i - 2, j - 1.5) * 0.35));
    },
  },
  {
    system: "pix",
    id: "dotsnake",
    label: "Planning",
    name: "Snake",
    color: "#A3E635",
    group: "dots",
    draw: (t, _ctx, o) => {
      var M = 20,
        head = (t * 14) % M;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 5; i++) {
          var k = j * 5 + (j % 2 ? 4 - i : i),
            d = (head - k + M) % M;
          o.pix(5, 4, i, j, d < 6 ? 1 - d / 6 : 0);
        }
    },
  },
  {
    system: "pix",
    id: "pendulum",
    label: "Waiting",
    name: "Pendulum",
    color: "#94A3B8",
    group: "dots",
    draw: (t, _ctx, o) => {
      var c = 2 + 2 * Math.sin(t * 2.6);
      for (var i = 0; i < 5; i++)
        for (var j = 0; j < 4; j++)
          o.pix(5, 4, i, j, Math.exp(-Math.abs(i - c) * 1.4) * (0.45 + (0.55 * j) / 3));
    },
  },
  {
    system: "pix",
    id: "dotradar",
    label: "Processing",
    name: "Radar",
    color: "#60A5FA",
    group: "dots",
    draw: (t, _ctx, o) => {
      var head = t * 2.8;
      for (var j = 0; j < 4; j++)
        for (var i = 0; i < 5; i++) {
          var ang = Math.atan2(j - 1.5, i - 2),
            d = (((head - ang) % 6.2832) + 6.2832) % 6.2832;
          o.pix(5, 4, i, j, Math.pow(1 - d / 6.2832, 2.2));
        }
    },
  },
  {
    system: "pix",
    id: "dotcols",
    label: "Fetching",
    name: "Columns",
    color: "#22D3EE",
    group: "dots",
    draw: (t, _ctx, o) => {
      for (var i = 0; i < 5; i++) {
        var h = 1.5 + 2.2 * (0.5 + 0.5 * Math.sin(t * 2.4 + i * 0.8));
        for (var j = 0; j < 4; j++)
          o.pix(5, 4, i, j, j >= 4 - h ? Math.min(1, h - (3 - j)) : 0);
      }
    },
  },
  {
    system: "pix",
    id: "zigzag",
    label: "Optimising",
    name: "Zigzag",
    color: "#FBBF24",
    group: "dots",
    draw: (t, _ctx, o) => {
      var path = [],
        i,
        k;
      for (i = 0; i < 5; i++) path.push([i, i % 2 ? 3 : 0]);
      for (i = 4; i >= 0; i--) path.push([i, i % 2 ? 0 : 3]);
      var head = (t * 12) % path.length;
      for (k = 0; k < path.length; k++) {
        var d = (head - k + path.length) % path.length;
        if (d < 5) o.pix(5, 4, path[k][0], path[k][1], 1 - d / 5);
      }
    },
  },
  {
    system: "pix",
    id: "dotorbit",
    label: "Exploring",
    name: "Orbit",
    color: "#A78BFA",
    group: "dots",
    draw: (t, _ctx, o) => {
      var p = [],
        i,
        j,
        k;
      for (i = 0; i < 5; i++) p.push([i, 0]);
      for (j = 1; j < 4; j++) p.push([4, j]);
      for (i = 3; i >= 0; i--) p.push([i, 3]);
      for (j = 2; j >= 1; j--) p.push([0, j]);
      var head = (t * 10) % p.length;
      for (k = 0; k < p.length; k++) {
        var d = (k - head + p.length) % p.length;
        if (d < 5) o.pix(5, 4, p[k][0], p[k][1], 1 - d / 5);
      }
    },
  },
  {
    system: "pix",
    id: "helix",
    label: "Composing",
    name: "Helix",
    color: "#E879F9",
    group: "dots",
    draw: (t, _ctx, o) => {
      for (var i = 0; i < 5; i++) {
        var a = t * 3.5 - i * 0.96,
          top = 0.5 + 0.5 * Math.cos(a),
          bot = 0.5 + 0.5 * Math.cos(a + 3.1416);
        o.pix(5, 4, i, 0, top);
        o.pix(5, 4, i, 1, top * 0.35);
        o.pix(5, 4, i, 3, bot);
        o.pix(5, 4, i, 2, bot * 0.35);
      }
    },
  },
  {
    system: "pix",
    id: "dottracer",
    label: "Locating",
    name: "Tracer",
    color: "#34D399",
    group: "dots",
    draw: (t, _ctx, o) => {
      var p = [],
        i,
        j,
        k;
      for (i = 0; i < 5; i++) p.push([i, 0]);
      for (j = 1; j < 4; j++) p.push([4, j]);
      for (i = 3; i >= 0; i--) p.push([i, 3]);
      for (j = 2; j >= 1; j--) p.push([0, j]);
      var head = (t * 8) % p.length;
      for (k = 0; k < p.length; k++) {
        var d = (k - head + p.length) % p.length;
        o.pix(5, 4, p[k][0], p[k][1], d < 2 ? 1 - d / 2 : 0);
      }
    },
  },
  {
    system: "pix",
    id: "dottwin",
    label: "Connecting",
    name: "Twin",
    color: "#F87171",
    group: "dots",
    draw: (t, _ctx, o) => {
      var p = [],
        i,
        j,
        k;
      for (i = 0; i < 5; i++) p.push([i, 0]);
      for (j = 1; j < 4; j++) p.push([4, j]);
      for (i = 3; i >= 0; i--) p.push([i, 3]);
      for (j = 2; j >= 1; j--) p.push([0, j]);
      var n = p.length,
        head = (t * 9) % n;
      for (k = 0; k < n; k++) {
        var d = Math.min((k - head + n) % n, (k - head + n / 2 + n) % n);
        if (d < 4) o.pix(5, 4, p[k][0], p[k][1], 1 - d / 4);
      }
    },
  },
  {
    system: "pix",
    id: "dotfill",
    label: "Deploying",
    name: "Wipe",
    color: "#4ADE80",
    group: "dots",
    draw: (t, _ctx, o) => {
      var x = ((t * 3) % 7) - 1;
      for (var i = 0; i < 5; i++)
        for (var j = 0; j < 4; j++) o.pix(5, 4, i, j, i < x ? 1 : Math.exp(-(i - x) * 2));
    },
  },
  {
    system: "pix",
    id: "bubble-sort",
    label: "Sorting",
    name: "Bubble sort",
    color: "#C084FC",
    group: "dots",
    shape: "square",
    draw: (t, _ctx, o) => {
      // Replays a bubble sort of five columns; the pair being compared is lit.
      var a = [4, 1, 5, 2, 3],
        states = [a.slice()],
        pairs = [-1];
      for (var pass = 0; pass < 4; pass++)
        for (var i = 0; i < 4 - pass; i++) {
          if (a[i] > a[i + 1]) {
            var tmp = a[i];
            a[i] = a[i + 1];
            a[i + 1] = tmp;
          }
          states.push(a.slice());
          pairs.push(i);
        }
      var s = Math.floor(t * 7) % (states.length + 8),
        st = states[Math.min(s, states.length - 1)],
        pr = s < states.length ? pairs[s] : -1;
      for (var c = 0; c < 5; c++)
        for (var r = 0; r < 5; r++) o.pix(5, 5, c, 4 - r, r < st[c] ? (c === pr || c === pr + 1 ? 1 : 0.4) : 0);
    },
  },
  {
    system: "pix",
    id: "ticker",
    label: "Parsing",
    name: "Ticker",
    color: "#38BDF8",
    group: "dots",
    shape: "circle",
    draw: (t, _ctx, o) => {
      // Braille-like columns scroll past, fading in and out at the edges.
      var s = Math.floor(t * 9);
      for (var c = 0; c < 5; c++)
        for (var r = 0; r < 4; r++) {
          var h = Math.sin((c + s) * 12.9898 + r * 78.233) * 43758.5453;
          h -= Math.floor(h);
          o.pix(5, 4, c, r, h > 0.5 ? Math.min(1, (c + 1) / 2, (5 - c) / 2) : 0);
        }
    },
  },
  {
    system: "pix",
    id: "progress-bar",
    label: "Downloading",
    name: "Progress bar",
    color: "#4ADE80",
    group: "dots",
    draw: (t, _ctx, o) => {
      var p = (t * 0.4) % 1.25,
        fade = p > 1 ? 1 - (p - 1) * 4 : 1;
      for (var c = 0; c < 5; c++)
        for (var r = 0; r < 2; r++) o.pix(5, 2, c, r, 0.15 + 0.85 * Math.max(0, Math.min(1, p * 5 - c)) * fade);
    },
  },
  {
    system: "pix",
    id: "ping-pong",
    label: "Negotiating",
    name: "Ping-pong",
    color: "#F87171",
    group: "dots",
    draw: (t, _ctx, o) => {
      // A two-dot block bounces between the ends of a track.
      var q = (t * 5) % 6,
        pos = q < 3 ? q : 6 - q;
      for (var c = 0; c < 5; c++) o.pix(5, 1, c, 0, Math.max(0.12, Math.min(1, 1.5 - Math.abs(c - (pos + 0.5)))));
    },
  },
];
