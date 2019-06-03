'use strict';

const fs = require('fs');
// const transformGreyscale = require('./lib/greyscale.js');
// const doTheInversion = require('./lib/inversion.js');
// const lightenImage = require('./lib/lighten.js');
// const darkenImage = require('./lib/darken.js');


const FILE_TYPE_OFFSET = 0;
const FILE_SIZE_OFFSET  = 2;
const PIXEL_OFFSET = 10;
const WIDTH_OFFSET = 18;
const HEIGHT_OFFSET = 22;
const BYTES_PER_PIXEL_OFFSET = 28;
const COLOR_TABLE_OFFSET = 54;


// const buffer = fs.readFileSync(`${__dirname}/assets/baldy.bmp`);

/**
 * Bitmap -- receives a file name, used in the transformer to note the new buffer
 * @param filePath
 * @constructor
 */
function Bitmap(filePath) {
  this.file = filePath;
}

/**
 * Parser -- accepts a buffer and will parse through it, according to the specification, creating object properties for each segment of the file
 * @param buffer
 */

Bitmap.prototype.parse = function(buffer) {
  this.buffer = buffer;
  this.type = buffer.toString('utf-8', FILE_TYPE_OFFSET, 2);
  this.fileSize = buffer.readInt32LE(FILE_SIZE_OFFSET);
  this.pixelOffset = buffer.readInt32LE(PIXEL_OFFSET);
  this.widthOffset = buffer.readInt32LE(WIDTH_OFFSET);
  this.heightOffset = buffer.readInt32LE(HEIGHT_OFFSET);
  this.bytesPerPixelOffset = buffer.readInt32LE(BYTES_PER_PIXEL_OFFSET);
  this.colorTableOffset = buffer.readInt32LE(COLOR_TABLE_OFFSET);
  this.colorArray = buffer.slice(COLOR_TABLE_OFFSET, PIXEL_OFFSET);
};

/**
 * Transform a bitmap using some set of rules. The operation points to some function, which will operate on a bitmap instance
 * @param operation
 */
 
Bitmap.prototype.transform = function(operation) {
  // This is really assumptive and unsafe
  transforms[operation](this);
  this.newFile = this.file.replace(/\.bmp/, `.${operation}.bmp`);
};

//----------*
//
//Helper functions
//
//----------*

const bmpValidator = (bmp) => {
  if (bmp.type === 'BM'){
    return true;
  } else {
    return false;
  }
};

/**
 * Sample Transformer (greyscale)
 * Would be called by Bitmap.transform('greyscale')
 * Pro Tip: Use "pass by reference" to alter the bitmap's buffer in place so you don't have to pass it around ...
 * @param bmp
 */
const transformGreyscale = (bmp) => {

  console.log('Transforming bitmap into greyscale', bmp);

  //TODO: Figure out a way to validate that the bmp instance is actually valid before trying to transform it
  if (!bmpValidator(bmp)){
    throw 'Invalid .bmp file.';
  } else { 
  //TODO: alter bmp to make the image greyscale ...
    for (let i = 0; i < bmp.colorArray.length; i+=4){
      let gray = (bmp.colorArray[i] + bmp.colorArray[i+1] + bmp.colorArray[i+2]) / 3 ;
      bmp.colorArray[i] = gray;
      bmp.colorArray[i+1] = gray;
      bmp.colorArray[i+2] = gray;
    }
    console.log('Colors converted to gray scale.');
  }

};

const doTheInversion = (bmp) => {
  // bmp = {};
  console.log('Inverting the bitmap', bmp);

  //Validate bmp file type
  if (!bmpValidator(bmp)){
    throw 'Invalid .bmp file.';
  } else {
    for(let i = 0; i < bmp.colorArray.length; i +=4){
      bmp.colorArray[i] = 255 - bmp.colorArray[i];
      bmp.colorArray[i+1] = 255 - bmp.colorArray[i+1]; 
      bmp.colorArray[i+2] = 255 - bmp.colorArray[i+2];
    }
    console.log('colors inverted!');
  }
};

const lightenImage = (bmp) => {
  console.log('Lightening the bitmap', bmp);

  if(!bmpValidator(bmp)){
    throw 'Invalid .bmp file.';
  } else {
    for(let i = 0; i < bmp.colorArray.length; i +=4){
      bmp.colorArray[i] = bmp.colorArray[i] + 55;
      bmp.colorArray[i+1] = 255 - bmp.colorArray[i+1] + 55; 
      bmp.colorArray[i+2] = 255 - bmp.colorArray[i+2] + 55;
    }
    console.log('Colors lightened');
  }
};

const darkenImage = (bmp) => {
  console.log('Darkening the bitmap', bmp);

  if(!bmpValidator(bmp)){
    throw 'Invalid .bmp file.';
  } else {
    for(let i = 0; i < bmp.colorArray.length; i +=4){
      bmp.colorArray[i] = bmp.colorArray[i] * 0.5;
      bmp.colorArray[i+1] = 255 - bmp.colorArray[i+1] * 0.5; 
      bmp.colorArray[i+2] = 255 - bmp.colorArray[i+2] * 0.5;
    }
    console.log('Colors darkened');
  }

};

/**
 * A dictionary of transformations
 * Each property represents a transformation that someone could enter on the command line and then a function that would be called on the bitmap to do this job
 */
const transforms = {
  greyscale: transformGreyscale,
  invert: doTheInversion,
  darken: darkenImage,
  lighten: lightenImage,

};

// ------------------ GET TO WORK ------------------- //

function transformWithCallbacks() {

  fs.readFile(file, (err, buffer) => {

    if (err) {
      throw err;
    }

    bitmap.parse(buffer);

    bitmap.transform(operation);

    // Note that this has to be nested!
    // Also, it uses the bitmap's instance properties for the name and thew new buffer
    fs.writeFile(bitmap.newFile, bitmap.buffer, (err, out) => {
      if (err) {
        throw err;
      }
      console.log(`Bitmap Transformed: ${bitmap.newFile}`);
    });

  });
}

// TODO: Explain how this works (in your README)
const [file, operation] = process.argv.slice(2);

let bitmap = new Bitmap(file);

transformWithCallbacks();
