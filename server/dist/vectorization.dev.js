"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _child_process = require("child_process");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Utility function to save base64 image to a file


var saveBase64Image = function saveBase64Image(base64, filename) {
  var base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  var buffer = Buffer.from(base64Data, 'base64');

  _fs["default"].writeFileSync(filename, buffer);
}; // Utility function to remove a file


var removeFile = function removeFile(filepath) {
  if (_fs["default"].existsSync(filepath)) {
    _fs["default"].unlinkSync(filepath);
  }
};

router.post('/convertRasterToVector', function _callee(req, res) {
  var _req$body, image, _req$body$maxColors, maxColors, rasterFilePath, vectorFilePath, command;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, image = _req$body.image, _req$body$maxColors = _req$body.maxColors, maxColors = _req$body$maxColors === void 0 ? 24 : _req$body$maxColors;

          if (!(!image || typeof image !== 'string')) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Invalid or missing 'image' in request body"
          }));

        case 4:
          rasterFilePath = _path["default"].join(__dirname, 'temp', 'input.png');
          vectorFilePath = _path["default"].join(__dirname, 'temp', 'output.svg'); // Save the raster image to a file

          saveBase64Image(image, rasterFilePath); // Run a command-line tool for vectorization (e.g., Potrace or similar)
          // Ensure the tool is installed on the server.

          command = "potrace --svg --color=\"#000000\" --turdsize=0 --progress -u 1 -a 1 --alphamax=1 -k 0.4 --flat ".concat(rasterFilePath, " -o ").concat(vectorFilePath);
          (0, _child_process.exec)(command, function (error, stdout, stderr) {
            if (error) {
              console.error('Error during vectorization:', error.message);
              removeFile(rasterFilePath);
              return res.status(500).json({
                error: 'Vectorization failed',
                message: error.message
              });
            }

            if (stderr) console.warn('Vectorization stderr:', stderr); // Read the generated SVG file

            var vectorImage = _fs["default"].readFileSync(vectorFilePath, 'utf-8'); // Clean up temporary files


            removeFile(rasterFilePath);
            removeFile(vectorFilePath);
            console.log('Vectorization completed successfully');
            res.status(200).json({
              vectorImage: vectorImage
            });
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error('Error in /convertRasterToVector route:', _context.t0.message);
          res.status(500).json({
            error: 'Failed to process image',
            message: _context.t0.message
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=vectorization.dev.js.map
