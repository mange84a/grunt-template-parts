var replaceLoops = function(filecontent, grunt, options) {
    //Regular expression for Loop (Todo: check only numbers, not string?)
    var loopEx = new RegExp('@loop\\((.*?)\\)([\\s\\S]*?)@endloop');
    //Arrays regex
    var arrayEx = new RegExp('\\[(.*?)\\]');
    
    //Run regex
    var loopsFound = loopEx.exec(filecontent);
    
    //Loop while loops found
    while(loopsFound) {
        //How many time to loop?
        var nrOfLoops = parseInt(loopsFound[1]);
        
        //Is a number and larger than 0
        if(!isNaN(nrOfLoops) && nrOfLoops > 0) {
            //Loop and paste content
            
            var _tmpHtml = '';

            for(var i = 0; i < nrOfLoops; i++) {
                //Replace index placeholder with loop index
                var _toAdd = loopsFound[2].replaceAll('@@i', i);
                //Look for array inside the loop. If found, replace the array with the element of current arraIndex
                var arrFound = arrayEx.exec(_toAdd);
                while(arrFound) {
                    
                    var arr = arrFound[1].split(',');
                    var arrIndex = i;
                    if(arrIndex >= arr.length) { 
                        arrIndex = i % arr.length; 
                    }
                    
                    if(arr.length > 0) {
                        grunt.log.writeln(arr[arrIndex]); 
                        _toAdd = _toAdd.replace(arrFound[0], arr[arrIndex].trim());
                    }
                    arrFound = arrayEx.exec(_toAdd);
                }
                _tmpHtml += _toAdd;                       
            }
            filecontent = filecontent.replace(loopsFound[0], _tmpHtml);
        } else {
            //Not a number, or 0, replace with empty string
            grunt.log.writeln("Not a number?");
            filecontent = filecontent.replace(loopsFound[0], '');
        }
        loopsFound = loopEx.exec(filecontent);
    }
    return filecontent;
}

module.exports.replaceLoops = replaceLoops;

 
