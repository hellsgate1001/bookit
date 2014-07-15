#!/usr/bin/env node

var acorn = require('acorn');
var fs = require('fs');
var path = require("path");

var file = process.argv[2];

if(file === undefined) {
	throw new Error('File required')
} else {
	console.log('File', file)
}

var comments = []

options = {
   ecmaVersion: 5,
   strictSemicolons: false,
   allowTrailingCommas: true,
   forbidReserved: false,
   allowReturnOutsideFunction: false,
   locations: true,
   onComment: function(isBlock, text, start, end) {
   		comments.push({
   			block: isBlock
   			, text: text
   			, start: start
   			, end: end
   		})
   		console.log("Comment", isBlock, text, start, end);
   },
   ranges: true,
   program: null,
   sourceFile: null,
   directSourceFile: null ,
   getLineInfo: function(input, offset) {
   		console.log(input, offset)
   }
}

try {
  var code = fs.readFileSync(file, "utf8");
  console.log('reading file')
  parsed = acorn.parse(code, options);
} catch(e) {
  console.log(e.message);
  process.exit(1);
}

parsed.comments = comments;

fs.writeFile('o.json', JSON.stringify(parsed), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
});
