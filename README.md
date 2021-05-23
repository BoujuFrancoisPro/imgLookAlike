# image look alike

## Installation 

```npm install imglookalike```
 
## Usage

**Note**: as of now it has been with .png and .jpg file formats

```js
const imglookalike = require('imglookalike')

imglookalike.compare('path/to/img1.png', 'path/to/img2.jpg')
    .then((result) =>{
        /*210 
        Do something based on that result
        */
    })

// increase precision by changing the number of bits of the hash
imglookalike.compare('path/to/img1.png', path/to/img2.jpg, {nBits : 16})
// select which comparison algorith to run (hamming or levenshtein)
imglookalike.compare('path/to/img1.png', path/to/img2.jpg, {algorithm : "hamming"})
```
## API

### compare(pathImg1, pathImg2, options)

compare two images

##### pathImg1 & 2

Type: `string`

The path of the images you want to compare.

##### options

Type: `object`

###### nBits

Type: `number`<br>
Default: `8`

The numbers of bits you wish the hash would be
**Note**: the result of nBits % 4 must be 0 E.g (16 % 4 = 0, 6 % 4 = 2) 

###### algorithm

Type: `string`<br>
Default: `levenshtein`

The algorithm to use for the distance calculation either hamming or levenshtein
