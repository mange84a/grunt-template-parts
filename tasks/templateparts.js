/*
  * grunt-template-parts
  * https://github.com/mange84a/grunt-template-parts
  *
  * Copyright (c) 2022 Magnus Andersson
  * Licensed under the MIT license.
  */

  'use strict';

module.exports = function(grunt) {
  var path = require('path');

  grunt.registerMultiTask('templateparts', '', function() {
    //Options to be set
    //We need source folder (root templates), include folder (template parts) and output folder, (static html output)
    var options = this.options({
      includes_directory: 'test/src/includes',
      source_directory: 'test/src',
      output_directory: 'test/dest'
    });


    function create_files(abspath, rootdir, subdir, filename) {
      //Only root files to be processed
      if(subdir) { return; }

      //Load the file if exists
      if (!grunt.file.isFile(abspath)) { return grunt.log.warn('Ignoring non file matching glob', abspath); }
      var filecontent = grunt.file.read(abspath);

      //Regular expression to extract filename and variables from in import statment
      var regExInclude = new RegExp('@get_template_part\\(\\s*["\'](.*?)["\'](,\\s*({[\\s\\S]*?})){0,1}\\s*\\)');
      //Regular expression to extract conditional statments
      var conditionEx = new RegExp('@if\\((.*?)\\)([\\s\\S]*?)@endif'); 
      //Regular expression to extract variables in the include file
      var variableEx = new RegExp('\\{\\{(.*?)\\}\\}');
      //Regular expression for Loop (Todo: check only numbers, not string?)
      var loopEx = new RegExp('@loop\\((.*?)\\)([\\s\\S]*?)@endloop');

      
      //Get first include if exist
      var includesFound = regExInclude.exec(filecontent);
      //Loop while include statments is found
      while(includesFound) {

        //Get file content to include
        //If it does not exist, write error to console and just replace the include statment with an empty string and continue to next
        if(!grunt.file.isFile(options.includes_directory + '/' + includesFound[1])) {
          grunt.log.error('Include file could not be found: ' + options.includes_directory + '/' + includesFound[1]);
          filecontent = filecontent.replace(includesFound[0], '');
          includesFound = regExInclude.exec(filecontent);
          continue;
        }
        
        //File exists, read the file content
        var include_file = grunt.file.read(options.includes_directory + '/' + includesFound[1]);
              
        //Check for variables (If data is written to index 3)
        if(includesFound[3]) {
          
          //Store all variables in an objekt
          var arg = null;
          var varNames = null;
          try {
            arg = JSON.parse(includesFound[3]);
            varNames = Object.keys(arg);
          } catch(e) {
            grunt.log.error('Incorrectly formated variables in @include statment, check input data for ' + includesFound[1] + ' in ' + filename);  
          }
          
          //If args is ok
          if(arg) {
            var variables = variableEx.exec(include_file);
            while(variables) {
              if(arg[variables[1].trim()]) {
                include_file = include_file.replace(variables[0], arg[variables[1].trim()]);
              } else {
                include_file = include_file.replace(variables[0], '');
                grunt.log.writeln("Variable '" + variables[1].trim() + "' not found");
              }
              variables = variableEx.exec(include_file);
            }
          }
        }
        filecontent = filecontent.replace(includesFound[0], include_file.trim());
        includesFound = regExInclude.exec(filecontent);
      }

      //Conditions
      var conditionsFound = conditionEx.exec(filecontent);
      while(conditionsFound) {
        var expr_values = conditionsFound[1].split(' ');
        //Must be 3 items where index 1 is =, ==, ===, or !=, !==
        if(!(expr_values.length === 3 || (expr_values.length === 7 && (expr_values[3] === '&&' || expr_values[3] === '||' )))) {
          grunt.log.error("Error in @if statment. Check documentation for more information");
          filecontent = filecontent.replace(conditionsFound[0], '');
        }

        var true_or_false = true;
        //Check first condition
        
        //Index 1 must be equal or not equal signs
        if(expr_values[1] === '==' ) { if(expr_values[0] !== expr_values[2]) { true_or_false = false; } } 
        if(expr_values[1] === '!==' ) { if(expr_values[0] === expr_values[2]) { true_or_false = false; } }
        
        if(expr_values.length === 7 && expr_values[3] === '&&') {
          
          //&& condition
          if(expr_values[5] === '==' ) { if(expr_values[4] !== expr_values[6]) { true_or_false = false; } } 
          if(expr_values[5] === '!==' ) { if(expr_values[4] === expr_values[6]) { true_or_false = false; } }
        } else if(expr_values.length === 7 && expr_values[3] === '||') {
          
          //OR condition, this is true, the entire block is true
          if(expr_values[5] === '==' ) { if(expr_values[4] === expr_values[6]) { true_or_false = true; } } 
          if(expr_values[5] === '!==' ) { if(expr_values[4] !== expr_values[6]) { true_or_false = true; } }
        } else if(expr_values.length === 7) {
          //Error if length is 7 and index 3 isnt && or ||
          true_or_false = false;
          grunt.log.error("Error in @if statment. Check documentation for more information");
        }

        if(true_or_false === true) {
            filecontent = filecontent.replace(conditionsFound[0], conditionsFound[2]);
        } else {
            filecontent = filecontent.replace(conditionsFound[0], '');
        }
        conditionsFound = conditionEx.exec(filecontent);
      } 

      //Check for loops?
      var loopsFound = loopEx.exec(filecontent);
      while(loopsFound) {
        var nrOfLoops = parseInt(loopsFound[1]);
        if(!isNaN(nrOfLoops) && nrOfLoops > 0) {
          //Loop and paste content
          var _tmpHtml = '';
          for(var i = 0; i < nrOfLoops; i++) {
            _tmpHtml += loopsFound[2].replace('$$i', i);
          }
          filecontent = filecontent.replace(loopsFound[0], _tmpHtml);
        }
        loopsFound = loopEx.exec(filecontent);
      }
      
      //Remove whitespace and write file
      filecontent = filecontent.replace(/(^[ \t]*\n)/gm, "");
      grunt.file.write(options.output_directory + '/' + filename, filecontent);
    }
    
    grunt.file.recurse(options.source_directory, create_files);

  });

};
