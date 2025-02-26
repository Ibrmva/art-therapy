"use strict";

var _require = require('image-js'),
    Image = _require.Image;

var ndarray = require('ndarray');

var ops = require('ndarray-ops');

var savePixels = require('save-pixels');

var split = require('split-array');

var getPixels = require('get-pixels');

var RUN_MODE = -1;
var PATH_TO_FILE = "";
var K = -1;
var IMAGE = [];
var IMAGE_3D_MATRIX = null;

function kmeans_main(cluster_points) {
  // rounding pixel values and getting cluster RGB
  var centers = [];

  for (var i = 0; i < cluster_points.length; i++) {
    cluster_points[i] = [Math.floor(cluster_points[i][0]), Math.floor(cluster_points[i][1])];
    var red = IMAGE_3D_MATRIX.get(cluster_points[i][0], cluster_points[i][1], 0);
    var green = IMAGE_3D_MATRIX.get(cluster_points[i][0], cluster_points[i][1], 1);
    var blue = IMAGE_3D_MATRIX.get(cluster_points[i][0], cluster_points[i][1], 2);
    centers.push([red, green, blue]); // Ensure RGB order
  }

  var centersArray = ndarray(new Float32Array(centers.flat()), [centers.length, 3]); // Initializing class and distance arrays

  var classes = ndarray(new Float32Array(IMAGE_3D_MATRIX.shape[0] * IMAGE_3D_MATRIX.shape[1]), [IMAGE_3D_MATRIX.shape[0], IMAGE_3D_MATRIX.shape[1]]);
  var distances = ndarray(new Float32Array(IMAGE_3D_MATRIX.shape[0] * IMAGE_3D_MATRIX.shape[1] * K), [IMAGE_3D_MATRIX.shape[0], IMAGE_3D_MATRIX.shape[1], K]);

  for (var _i = 0; _i < 10; _i++) {
    // finding distances for each center
    for (var j = 0; j < K; j++) {
      ops.sub(distances.pick(undefined, undefined, j), centersArray.pick(undefined, undefined, 0), IMAGE_3D_MATRIX.pick(undefined, undefined, 0));
      ops.subseq(distances.pick(undefined, undefined, j), centersArray.pick(undefined, undefined, 1), IMAGE_3D_MATRIX.pick(undefined, undefined, 1));
      ops.subseq(distances.pick(undefined, undefined, j), centersArray.pick(undefined, undefined, 2), IMAGE_3D_MATRIX.pick(undefined, undefined, 2));
      ops.powseq(distances.pick(undefined, undefined, j), distances.pick(undefined, undefined, j), 2);
      ops.addeq(distances.pick(undefined, undefined, j), distances.pick(undefined, undefined, j));
      ops.sqrtscaleeq(distances.pick(undefined, undefined, j), distances.pick(undefined, undefined, j), 1);
    } // choosing the minimum distance class for each pixel


    for (var r = 0; r < classes.shape[0]; r++) {
      for (var c = 0; c < classes.shape[1]; c++) {
        var minDistance = Number.MAX_VALUE;
        var minClass = 0;

        for (var l = 0; l < K; l++) {
          var distance = distances.get(r, c, l);

          if (distance < minDistance) {
            minDistance = distance;
            minClass = l;
          }
        }

        classes.set(r, c, minClass);
      }
    } // rearranging centers


    for (var _c = 0; _c < K; _c++) {
      var classIndices = [];

      for (var _r = 0; _r < classes.shape[0]; _r++) {
        for (var cc = 0; cc < classes.shape[1]; cc++) {
          if (classes.get(_r, cc) === _c) {
            classIndices.push([_r, cc]);
          }
        }
      }

      var classIndicesArray = ndarray(new Float32Array(classIndices.flat()), [classIndices.length, 2]);
      var classReds = ndarray(new Float32Array(classIndices.length), [classIndices.length]);
      var classGreens = ndarray(new Float32Array(classIndices.length), [classIndices.length]);
      var classBlues = ndarray(new Float32Array(classIndices.length), [classIndices.length]);
      ops.muleq(classReds, IMAGE_3D_MATRIX.pick(undefined, undefined, 0), classIndicesArray.pick(undefined, 0));
      ops.muleq(classGreens, IMAGE_3D_MATRIX.pick(undefined, undefined, 1), classIndicesArray.pick(undefined, 0));
      ops.muleq(classBlues, IMAGE_3D_MATRIX.pick(undefined, undefined, 2), classIndicesArray.pick(undefined, 0));
      var sumRed = ops.sum(classReds);
      var sumGreen = ops.sum(classGreens);
      var sumBlue = ops.sum(classBlues);
      centersArray.set(_c, 0, sumRed / classIndices.length);
      centersArray.set(_c, 1, sumGreen / classIndices.length);
      centersArray.set(_c, 2, sumBlue / classIndices.length);
    }
  } // changing values with respect to class centers


  for (var _r2 = 0; _r2 < IMAGE_3D_MATRIX.shape[0]; _r2++) {
    for (var _c2 = 0; _c2 < IMAGE_3D_MATRIX.shape[1]; _c2++) {
      var classIndex = classes.get(_r2, _c2);
      IMAGE_3D_MATRIX.set(_r2, _c2, 0, centersArray.get(classIndex, 0));
      IMAGE_3D_MATRIX.set(_r2, _c2, 1, centersArray.get(classIndex, 1));
      IMAGE_3D_MATRIX.set(_r2, _c2, 2, centersArray.get(classIndex, 2));
    }
  }
}

function kmeans_with_click() {
  var points = [];
  console.log("Click K times on the image to select points:");

  for (var i = 0; i < K; i++) {
    console.log("Click point ".concat(i + 1, ":")); // simulate getting point from user input

    var x = getRandomInt(0, IMAGE_3D_MATRIX.shape[0]);
    var y = getRandomInt(0, IMAGE_3D_MATRIX.shape[1]);
    points.push([x, y]);
  }

  kmeans_main(points);
}

function kmeans_with_random() {
  var points = [];

  for (var i = 0; i < K; i++) {
    var x = getRandomInt(0, IMAGE_3D_MATRIX.shape[0]);
    var y = getRandomInt(0, IMAGE_3D_MATRIX.shape[1]);
    points.push([x, y]);
  }

  kmeans_main(points);
}

function read_image() {
  return new Promise(function (resolve, reject) {
    getPixels(PATH_TO_FILE, function (err, pixels) {
      if (err) reject(err);
      resolve(pixels);
    });
  });
}

function handle_arguments() {
  var args = process.argv.slice(2);

  if (args.length < 3) {
    console.error("Usage: node color-quantization.js [Image Path] [K value] [Run Mode]");
    process.exit(1);
  }

  PATH_TO_FILE = args[0];
  K = parseInt(args[1]);
  RUN_MODE = parseInt(args[2]);
  var allowedKValues = [1, 12, 24];

  if (!allowedKValues.includes(K)) {
    console.error("Only K values of ".concat(allowedKValues, " are allowed. Your value is ").concat(K));
    process.exit(1);
  }

  if (![0, 1].includes(RUN_MODE)) {
    console.error("Program mode should be either 0 or 1");
    process.exit(1);
  }
}

function save_image() {
  var stream = savePixels(IMAGE_3D_MATRIX, 'png').pipe(require('fs').createWriteStream("output_K".concat(K, ".png")));
  stream.on('finish', function () {
    console.log("Success: Output file generated!");
    process.exit(0);
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main() {
  var pixels, shape, data, imageArray, r, c, b;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          handle_arguments();
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(read_image());

        case 4:
          pixels = _context.sent;
          shape = [pixels.shape[0], pixels.shape[1], 3];
          data = new Float32Array(pixels.shape[0] * pixels.shape[1] * 3);
          imageArray = ndarray(data, shape);

          for (r = 0; r < shape[0]; r++) {
            for (c = 0; c < shape[1]; c++) {
              for (b = 0; b < shape[2]; b++) {
                imageArray.set(r, c, b, pixels.get(r, c, b));
              }
            }
          }

          IMAGE_3D_MATRIX = imageArray;

          if (!(RUN_MODE === 1)) {
            _context.next = 14;
            break;
          }

          kmeans_with_random();
          _context.next = 16;
          break;

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(kmeans_with_click());

        case 16:
          save_image();
          _context.next = 23;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](1);
          console.error(_context.t0);
          process.exit(1);

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 19]]);
}

main();
//# sourceMappingURL=imageProcessor.dev.js.map
