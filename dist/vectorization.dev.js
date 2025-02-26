// import sharp from 'sharp';
// import Potrace from 'potrace';
// const processImage = async (imageBuffer) => {
//   try {
//     // Quantize image to 24 colors and get raw pixel data
//     const quantized = await sharp(imageBuffer)
//       .png()
//       .quantize(24, { dither: 0 })
//       .toBuffer({ resolveWithObject: true });
//     const { data, info } = await sharp(quantized.data)
//       .ensureAlpha()
//       .raw()
//       .toBuffer({ resolveWithObject: true });
//     // Extract unique colors
//     const colors = new Set();
//     for (let i = 0; i < data.length; i += info.channels) {
//       const r = data[i];
//       const g = data[i + 1];
//       const b = data[i + 2];
//       const a = data[i + 3];
//       colors.add(`rgba(${r},${g},${b},${a})`);
//     }
//     // Prepare SVG layers
//     const paths = [];
//     for (const color of Array.from(colors)) {
//       const bitmap = new Uint8Array(info.width * info.height);
//       for (let i = 0; i < data.length; i += info.channels) {
//         const r = data[i];
//         const g = data[i + 1];
//         const b = data[i + 2];
//         const a = data[i + 3];
//         const currentColor = `rgba(${r},${g},${b},${a})`;
//         const idx = Math.floor(i / info.channels);
//         bitmap[idx] = currentColor === color ? 1 : 0;
//       }
//       // Trace with Potrace
//       const svg = await new Promise((resolve, reject) => {
//         const tracer = new Potrace();
//         tracer.setParameters({
//           color: color,
//           threshold: 128,
//         });
//         tracer.loadBitmap(bitmap, info.width, info.height, (err) => {
//           if (err) reject(err);
//           resolve(tracer.getPathTag());
//         });
//       });
//       paths.push(`<path fill="${color}" d="${svg}"/>`);
//     }
//     return `<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}" viewBox="0 0 ${info.width} ${info.height}">${paths.join('')}</svg>`;
//   } catch (error) {
//     throw error;
//   }
// };
// export { processImage };
"use strict";
//# sourceMappingURL=vectorization.dev.js.map
