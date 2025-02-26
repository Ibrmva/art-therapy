"use strict";

var express = require("express");

var multer = require("multer");

var tf = require("@tensorflow/tfjs-node");

var _require = require("canvas"),
    createCanvas = _require.createCanvas,
    loadImage = _require.loadImage;

var fs = require("fs");

var path = require("path"); // Initialize express app


var app = express();
var port = 4000; // Set up multer for file uploads

var storage = multer.memoryStorage();
var upload = multer({
  storage: storage
}); // Load the pre-trained model (DeepLabV3 for segmentation, you can choose another model)

var model;

function loadModel() {
  return regeneratorRuntime.async(function loadModel$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(tf.loadGraphModel('https://tfhub.dev/tensorflow/deeplabv3/1/default/1', {
            fromTFHub: true
          }));

        case 2:
          model = _context.sent;
          console.log("Model Loaded");

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

loadModel(); // Load the model when server starts
// API to segment the image

app.post("/segmentImage", upload.single("image"), function _callee(req, res) {
  var imageBuffer, img, canvas, ctx, tensor, segmentation, mask, maskImageData, maskCanvas, maskCtx, maskData, segmentedImageBuffer, segmentedImageBase64;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (req.file) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", res.status(400).send({
            error: "No file uploaded"
          }));

        case 2:
          _context2.prev = 2;
          imageBuffer = req.file.buffer;
          _context2.next = 6;
          return regeneratorRuntime.awrap(loadImage(imageBuffer));

        case 6:
          img = _context2.sent;
          canvas = createCanvas(img.width, img.height);
          ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0); // Convert image to Tensor

          tensor = tf.browser.fromPixels(canvas);
          tensor = tensor.expandDims(0); // Add batch dimension
          // Run segmentation

          _context2.next = 14;
          return regeneratorRuntime.awrap(model.executeAsync(tensor));

        case 14:
          segmentation = _context2.sent;
          // Here we are assuming the model returns the segmentation mask in the first element
          mask = segmentation[0].squeeze(); // Remove batch dimension
          // Convert mask tensor to an image

          maskImageData = mask.mul(255).toInt();
          maskCanvas = createCanvas(img.width, img.height);
          maskCtx = maskCanvas.getContext("2d");
          maskData = maskImageData.dataSync();
          maskCtx.putImageData(new ImageData(Uint8ClampedArray.from(maskData), img.width, img.height), 0, 0); // Convert segmented image to buffer

          segmentedImageBuffer = maskCanvas.toBuffer("image/jpeg"); // Return the segmented image as base64

          segmentedImageBase64 = segmentedImageBuffer.toString("base64");
          res.json({
            segmentedImage: "data:image/jpeg;base64,".concat(segmentedImageBase64)
          });
          _context2.next = 30;
          break;

        case 26:
          _context2.prev = 26;
          _context2.t0 = _context2["catch"](2);
          console.error("Error during segmentation:", _context2.t0);
          res.status(500).send({
            error: "Error during image segmentation"
          });

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 26]]);
}); // Start the server

app.listen(port, function () {
  console.log("Server is running on http://localhost:".concat(port));
});
//# sourceMappingURL=index.dev.js.map
