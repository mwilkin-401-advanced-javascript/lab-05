'use strict';

const bmpValidator = require('./bmpValidator.js');

module.exports = (bmp) => {
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