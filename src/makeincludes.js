/** 
 * Make includes
 * -------------
 *  Takes the filecontent and run the include regex to see if we find any include statments
 *  If exists, include content and replace variables, the run again until all includes are done
*/

var makeIncludes = function(filecontent, grunt, options) {

    //Regular expression to extract file name and variables from in import statment
    var regExInclude = new RegExp('@get_template_part\\(\\s*["\'](.*?)["\'](,\\s*({[\\s\\S]*?})){0,1}\\s*\\)');
    //Regular expression to extract variables in the include file
    var variableEx = new RegExp('\\{\\{(.*?)\\}\\}');
    
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
                    }
                    variables = variableEx.exec(include_file);
                }
            }
        }
        filecontent = filecontent.replace(includesFound[0], include_file.trim());
        includesFound = regExInclude.exec(filecontent);
    }

    return filecontent;
}

module.exports.makeIncludes = makeIncludes;
