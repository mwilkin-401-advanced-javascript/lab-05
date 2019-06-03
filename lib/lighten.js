'use strict';

const bmpValidator = require('./bmpValidator.js');

module.exports = (bmp) => {
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