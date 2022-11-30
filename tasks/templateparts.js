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
    var indent = require('../src/indentscript.js');
    
    grunt.registerMultiTask('templateparts', '', function() {
        //Options to be set
        //We need source folder (root templates), include folder (template parts) and output folder, (static html output)
        var options = this.options({
            includes_directory: 'test/src/includes',
            source_directory: 'test/src',
            output_directory: 'test/dest'
        });


        function create_files(abspath, rootdir, subdir, filename) {
            grunt.log.writeln(filename);
            //Only root files to be processed
            if(subdir) { return; }

            //Load the file if exists
            if (!grunt.file.isFile(abspath)) { return grunt.log.warn('Ignoring non file matching glob', abspath); }
            var filecontent = grunt.file.read(abspath);

           
            /** 
                * MAKE INCLUDES
                * This function is responsible for replacing all @get_template_parts() with corresponding file
                * And handling the variable replacement from the @get_template_parts statement, if any
            */
            var makeIncludes = require('../src/makeincludes.js');
            filecontent = makeIncludes.makeIncludes(filecontent, grunt, options);

            /**
             * LOOPS
             * Look for @loopn and clone content inside multiple times
            */
            var replaceLoops = require('../src/loops.js');
            filecontent = replaceLoops.replaceLoops(filecontent, grunt, options);

            /**
             * CONDITIONS (IF statments)
             * Remove content from the file depending on @if statments
            */
            var runConditions = require('../src/conditions.js');
            filecontent = runConditions.runConditions(filecontent, grunt, options);
            
            /**
             * Faker
             * Replace @faker() functions with dummy text
            */
            var dummydata = require('../src/dummy.js');
            filecontent = dummydata.dummydata(filecontent, grunt, options);
           
            
            //Remove whitespace and write file
            filecontent = filecontent.replace(/(^[ \t]*\n)/gm, "");
            
            //TODO: Indent file?
            filecontent = indent.html(filecontent, {tabString: '    '});
            //Write file
            grunt.file.write(options.output_directory + '/' + filename, filecontent);
        }

        grunt.file.recurse(options.source_directory, create_files);

    });

};
