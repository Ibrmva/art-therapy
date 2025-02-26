"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _openai = _interopRequireDefault(require("openai"));

var _potrace = _interopRequireDefault(require("potrace"));

var _sharp = _interopRequireDefault(require("sharp"));

var _mlKmeans = require("ml-kmeans");

var _expressFileupload = _interopRequireDefault(require("express-fileupload"));

var _vtracer = _interopRequireDefault(require("vtracer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

_dotenv["default"].config();

var app = (0, _express["default"])();
var corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};
app.use((0, _cors["default"])(corsOptions));
app.use(_express["default"].json({
  limit: '50mb'
}));
app.use((0, _expressFileupload["default"])());

if (!process.env.VITE_OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not defined in the .env file');
  process.exit(1);
}

var openai = new _openai["default"]({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

var extractDominantColors = function extractDominantColors(imgBuffer) {
  var numColors,
      resizedImage,
      pixels,
      i,
      r,
      g,
      b,
      result,
      _args = arguments;
  return regeneratorRuntime.async(function extractDominantColors$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          numColors = _args.length > 1 && _args[1] !== undefined ? _args[1] : 24;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _sharp["default"])(imgBuffer).resize(100, 100).toFormat('raw').raw().toBuffer());

        case 4:
          resizedImage = _context.sent;
          pixels = [];

          for (i = 0; i < resizedImage.length; i += 3) {
            r = resizedImage[i];
            g = resizedImage[i + 1];
            b = resizedImage[i + 2];
            pixels.push([r, g, b]);
          }

          if (!(pixels.length === 0)) {
            _context.next = 9;
            break;
          }

          throw new Error('No valid pixel data extracted');

        case 9:
          result = (0, _mlKmeans.kmeans)(pixels, numColors);
          return _context.abrupt("return", result.centroids);

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](1);
          console.error('Error extracting dominant colors:', _context.t0.message);
          throw new Error('Failed to extract dominant colors');

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 13]]);
};

var vectorizeImage = function vectorizeImage(imgBuffer) {
  var svg, pngBuffer;
  return regeneratorRuntime.async(function vectorizeImage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;

          if (_vtracer["default"]) {
            _context3.next = 3;
            break;
          }

          throw new Error('vtracer is not defined');

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap((0, _vtracer["default"])({
            input: imgBuffer,
            colorPrecision: 12,
            layerDifference: 12,
            mode: 'spline'
          }));

        case 5:
          svg = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap((0, _sharp["default"])(Buffer.from(svg)).toFormat('png').flatten({
            background: {
              r: 255,
              g: 255,
              b: 255
            }
          }).toBuffer());

        case 8:
          pngBuffer = _context3.sent;
          return _context3.abrupt("return", pngBuffer);

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.warn('vtracer failed:', _context3.t0.message);
          console.log('Falling back to potrace...');
          return _context3.abrupt("return", new Promise(function (resolve, reject) {
            _potrace["default"].trace(imgBuffer, {
              color: 'black',
              threshold: 128
            }, function _callee(err, svg) {
              var _pngBuffer;

              return regeneratorRuntime.async(function _callee$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (!err) {
                        _context2.next = 5;
                        break;
                      }

                      console.error('Potrace vectorization failed:', err.message);
                      reject(new Error('Vectorization failed using both vtracer and potrace'));
                      _context2.next = 15;
                      break;

                    case 5:
                      _context2.prev = 5;
                      _context2.next = 8;
                      return regeneratorRuntime.awrap((0, _sharp["default"])(Buffer.from(svg)).toFormat('png').flatten({
                        background: {
                          r: 255,
                          g: 255,
                          b: 255
                        }
                      }) // Set background to white
                      .toBuffer());

                    case 8:
                      _pngBuffer = _context2.sent;
                      resolve(_pngBuffer);
                      _context2.next = 15;
                      break;

                    case 12:
                      _context2.prev = 12;
                      _context2.t0 = _context2["catch"](5);
                      reject(new Error('Failed to convert SVG to PNG'));

                    case 15:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, null, null, [[5, 12]]);
            });
          }));

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

app.post('/segmentImage', function _callee2(req, res) {
  var image, imgBuffer, validMimeTypes, _req$body$colorOption, colorOption, pngBuffer, processedImage, svg, numColors, dominantColors, rawImage, segmentedPixels, _loop, i, _ref, width, height;

  return regeneratorRuntime.async(function _callee2$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;

          if (!(!req.files || !req.files.image)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'No file uploaded'
          }));

        case 3:
          image = req.files.image;
          imgBuffer = image.data;
          validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg'];

          if (validMimeTypes.includes(image.mimetype)) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Invalid file type. Only image files are allowed'
          }));

        case 8:
          _req$body$colorOption = req.body.colorOption, colorOption = _req$body$colorOption === void 0 ? '12' : _req$body$colorOption;

          if (['vector', '12', '24', 'none'].includes(colorOption)) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Invalid color option. Allowed values are "vector", "12", "24", "none".'
          }));

        case 11:
          _context4.next = 13;
          return regeneratorRuntime.awrap((0, _sharp["default"])(imgBuffer).toFormat('png').toBuffer());

        case 13:
          pngBuffer = _context4.sent;

          if (!(colorOption === 'vector')) {
            _context4.next = 21;
            break;
          }

          _context4.next = 17;
          return regeneratorRuntime.awrap(vectorizeImage(pngBuffer));

        case 17:
          svg = _context4.sent;
          processedImage = Buffer.from(svg);
          _context4.next = 44;
          break;

        case 21:
          if (!(colorOption === 'none')) {
            _context4.next = 25;
            break;
          }

          processedImage = pngBuffer;
          _context4.next = 44;
          break;

        case 25:
          numColors = parseInt(colorOption, 10);

          if (!(numColors === 12 || numColors === 24)) {
            _context4.next = 44;
            break;
          }

          _context4.next = 29;
          return regeneratorRuntime.awrap(extractDominantColors(pngBuffer, numColors));

        case 29:
          dominantColors = _context4.sent;
          _context4.next = 32;
          return regeneratorRuntime.awrap((0, _sharp["default"])(pngBuffer).raw().toBuffer());

        case 32:
          rawImage = _context4.sent;
          segmentedPixels = [];

          _loop = function _loop(i) {
            var _ref2 = [rawImage[i], rawImage[i + 1], rawImage[i + 2]],
                r = _ref2[0],
                g = _ref2[1],
                b = _ref2[2];
            var closestColor = dominantColors.reduce(function (prev, curr) {
              var prevDist = Math.sqrt(Math.pow(prev[0] - r, 2) + Math.pow(prev[1] - g, 2) + Math.pow(prev[2] - b, 2));
              var currDist = Math.sqrt(Math.pow(curr[0] - r, 2) + Math.pow(curr[1] - g, 2) + Math.pow(curr[2] - b, 2));
              return prevDist < currDist ? prev : curr;
            });
            segmentedPixels.push.apply(segmentedPixels, _toConsumableArray(closestColor.map(Math.round)));
          };

          for (i = 0; i < rawImage.length; i += 3) {
            _loop(i);
          }

          _context4.next = 38;
          return regeneratorRuntime.awrap((0, _sharp["default"])(pngBuffer).metadata());

        case 38:
          _ref = _context4.sent;
          width = _ref.width;
          height = _ref.height;
          _context4.next = 43;
          return regeneratorRuntime.awrap((0, _sharp["default"])(Buffer.from(segmentedPixels), {
            raw: {
              width: width,
              height: height,
              channels: 3
            }
          }).toFormat('png').toBuffer());

        case 43:
          processedImage = _context4.sent;

        case 44:
          res.status(200).json({
            image: processedImage.toString('base64')
          });
          _context4.next = 51;
          break;

        case 47:
          _context4.prev = 47;
          _context4.t0 = _context4["catch"](0);
          console.error('Error segmenting image:', _context4.t0.message);
          res.status(500).json({
            error: 'Failed to segment image',
            message: _context4.t0.message
          });

        case 51:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 47]]);
});
app.post('/generateImage', function _callee3(req, res) {
  var _req$body, prompt, height, width, image;

  return regeneratorRuntime.async(function _callee3$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body = req.body, prompt = _req$body.prompt, height = _req$body.height, width = _req$body.width;

          if (!(!prompt || typeof prompt !== 'string')) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: "Invalid or missing 'prompt' in request body"
          }));

        case 3:
          if (!(!height || isNaN(height) || height <= 0)) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: "Invalid 'height' in request body"
          }));

        case 5:
          if (!(!width || isNaN(width) || width <= 0)) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: "Invalid 'width' in request body"
          }));

        case 7:
          _context5.prev = 7;
          _context5.next = 10;
          return regeneratorRuntime.awrap(openai.images.generate({
            prompt: prompt,
            model: 'dall-e-3',
            n: 1,
            size: "".concat(width, "x").concat(height),
            response_format: 'b64_json'
          }));

        case 10:
          image = _context5.sent;
          res.status(200).json({
            image: image.data[0].b64_json
          });
          _context5.next = 18;
          break;

        case 14:
          _context5.prev = 14;
          _context5.t0 = _context5["catch"](7);
          console.error('Error generating image:', _context5.t0.message);
          res.status(500).json({
            error: 'Failed to generate image',
            message: _context5.t0.message
          });

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[7, 14]]);
});
app.use(function (err, req, res, next) {
  console.error('Internal server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});
var PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
  console.log("Server is running on http://localhost:".concat(PORT));
});
//# sourceMappingURL=server.dev.js.map
