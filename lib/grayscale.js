'use strict';

const bmpValidator = require('./bmpValidator.js');

module.exports = (bmp) => {

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

// const bmpValidator = (bmp) => {
//   if (bmp.type === 'BM'){
//     return true;
//   } else {
//     return false;
//   }
// };