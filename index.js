'use strict'

const blockhash = require('blockhash-core');
const fsPromises = require("fs/promises");
const {getImageData, imageFromBuffer} = require('@canvas/image');
const levenshtein = require('js-levenshtein');


    
    async function compare(pathImg1, pathImg2, options){
        
        options = (typeof options !== "undefined") ? options : {};
        if(typeof options === "object")
            options.algorithm = (typeof options.algorithm !== "undefined") ? options.algorithm : "levenshtein";
            options.nBits = (typeof options.nBits !== "undefined") ? options.nBits : 8;

        if(typeof options !== "object")
            throw new TypeError('option expected an Object and got a ' + typeof options);
        if(options.algorithm !== "hamming" && options.algorithm !== "levenshtein")
            throw new Error('only 2 algorithm are supported \"hamming\" or \"levenshtein\"');
        if(typeof options.nBits !== "number" || options.nBits % 4 !== 0)
            throw new Error('Expected a number that can be %4 E.g 4, 8, 16, 32 ...');

        
        let img1 = fsPromises.readFile(pathImg1);
        let img2 = fsPromises.readFile(pathImg2);

        let filesContent = await Promise.all([img1, img2]);

        let image;
        let imageData;
        let hashRaw;
        let imageHashes = [];
        let distance;

        for(let i = 0; i < filesContent.length; i++){
            image = await imageFromBuffer(filesContent[i]);
            imageData = getImageData(image);
            hashRaw = hash(imageData, options.nBits);
            imageHashes.push(hashRaw);
        }

        if(options.algorithm === "hamming")
            distance = hammingDistance(imageHashes)
        if(options.algorithm === "levenshtein")
            distance = levenshtein(imageHashes[0], imageHashes[1]);

        return distance;
    }

    function hammingDistance(imgHashes){
        
        let binHashes = [];
        let distance = 0;
        let binHash;

        for(let i = 0; i < imgHashes.length; i++){
            binHash = hexToBin(imgHashes[i])
            binHashes.push(binHash);
        }

        for(let  j = 0; j < binHashes[0].length; j++){
            if(binHashes[0][j] !== binHashes[1][j])
                distance++;
        }

        return distance;
    }
    
    function hash(imageData, nBits){
        
        return  blockhash.bmvbhash(imageData, nBits);  
    }

    function hexToBin(hexHash){

        let convertedString = "";
        //store all the corresponding values of binary to hex
        let HexToBinValues = {
            0: "0000",
            1: "0001",
            2: "0010",
            3: "0011",
            4: "0100",
            5: "0101",
            6: "0110",
            7: "0111",
            8: "1000",
            9: "1001",
            a: "1010",
            b: "1011",
            c: "1100",
            d: "1101",
            e: "1110",
            f: "1111"
        }

        // for every character in the hexHash string
        for(let i = 0; i < hexHash.length; i++){
            //get the corresponding binary value
            convertedString = convertedString + HexToBinValues[hexHash[i]];
        }

        return convertedString
    }

module.exports = { compare };