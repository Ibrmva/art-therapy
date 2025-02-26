// import { Image } from 'image-js';
// import ndarray from 'ndarray';
// import ops from 'ndarray-ops';
// import savePixels from 'save-pixels';
// import fs from 'fs';
// // Global variables
// let IMAGE_3D_MATRIX = null;
// let K = 8; // Number of clusters for k-means (default is 8)
// // Function to read an image using image-js
// async function readImage(imageData) {
//   let img;
//   if (imageData.startsWith('data:image')) {
//     // Handle base64 image data
//     const base64Data = imageData.split(',')[1];  // Strip 'data:image/jpeg;base64,' part
//     const buffer = Buffer.from(base64Data, 'base64');
//     img = await Image.load(buffer);
//   } else {
//     // Handle image path
//     img = await Image.load(imageData);
//   }
//   const pixels = img.getData();
//   const shape = [img.height, img.width, 3];  // height, width, and 3 channels (RGB)
//   IMAGE_3D_MATRIX = ndarray(new Float32Array(pixels), shape);
// }
// // K-means clustering function
// function kMeans(points) {
//   const centers = points.map(([x, y]) => [
//     IMAGE_3D_MATRIX.get(x, y, 0),
//     IMAGE_3D_MATRIX.get(x, y, 1),
//     IMAGE_3D_MATRIX.get(x, y, 2),
//   ]);
//   const centersMatrix = ndarray(new Float32Array(centers.flat()), [centers.length, 3]);
//   const classes = ndarray(new Uint8Array(IMAGE_3D_MATRIX.shape[0] * IMAGE_3D_MATRIX.shape[1]), [
//     IMAGE_3D_MATRIX.shape[0],
//     IMAGE_3D_MATRIX.shape[1],
//   ]);
//   for (let iter = 0; iter < 10; iter++) {
//     IMAGE_3D_MATRIX.hi(classes.shape[0], classes.shape[1]).forEach((pixel, idx) => {
//       const [r, c] = idx;
//       let minDist = Infinity;
//       let cluster = -1;
//       centers.forEach((center, k) => {
//         const dist = Math.sqrt(
//           Math.pow(pixel[0] - center[0], 2) +
//           Math.pow(pixel[1] - center[1], 2) +
//           Math.pow(pixel[2] - center[2], 2)
//         );
//         if (dist < minDist) {
//           minDist = dist;
//           cluster = k;
//         }
//       });
//       classes.set(r, c, cluster);
//     });
//     const newCenters = Array.from({ length: K }, () => [0, 0, 0]);
//     const counts = new Array(K).fill(0);
//     classes.forEach((cluster, idx) => {
//       const [r, c] = idx;
//       const pixel = [IMAGE_3D_MATRIX.get(r, c, 0), IMAGE_3D_MATRIX.get(r, c, 1), IMAGE_3D_MATRIX.get(r, c, 2)];
//       newCenters[cluster][0] += pixel[0];
//       newCenters[cluster][1] += pixel[1];
//       newCenters[cluster][2] += pixel[2];
//       counts[cluster]++;
//     });
//     for (let k = 0; k < K; k++) {
//       if (counts[k] > 0) {
//         centers[k][0] = newCenters[k][0] / counts[k];
//         centers[k][1] = newCenters[k][1] / counts[k];
//         centers[k][2] = newCenters[k][2] / counts[k];
//       }
//     }
//   }
//   // Update the image with the new quantized colors
//   classes.forEach((cluster, idx) => {
//     const [r, c] = idx;
//     const color = centers[cluster];
//     IMAGE_3D_MATRIX.set(r, c, 0, color[0]);
//     IMAGE_3D_MATRIX.set(r, c, 1, color[1]);
//     IMAGE_3D_MATRIX.set(r, c, 2, color[2]);
//   });
// }
// // Function to save the quantized image as a PNG file
// function saveImage() {
//   savePixels(IMAGE_3D_MATRIX, 'png').pipe(fs.createWriteStream(`output_K${K}.png`));
// }
// // Main function to trigger the process
// async function processImage(imageData) {
//   await readImage(imageData);
//   // Random starting points for K-means
//   const points = Array.from({ length: K }, () => [
//     Math.floor(Math.random() * IMAGE_3D_MATRIX.shape[0]),
//     Math.floor(Math.random() * IMAGE_3D_MATRIX.shape[1]),
//   ]);
//   kMeans(points);
//   saveImage();
// }
"use strict";
//# sourceMappingURL=color-quantization.dev.js.map
