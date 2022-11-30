/*
 * Conditons
 * Look for @if() statments in the file and remove content if evaluates to false
 * Just simple checks
 * == !== with one || or &&
*/

var runConditions = function(filecontent, grunt, options) {
    
    //Regular expression to extract conditional statments
    var conditionEx = new RegExp('@if\\((.*?)\\)([\\s\\S]*?)@endif'); 
    
    //Run regex
    var conditionsFound = conditionEx.exec(filecontent);
    
    //If conditions is found in the file
    while(conditionsFound) {

        
        //Quickfix to work with nested if statments
        //If content contans an if, run the regex again on the content to get the nested ifs first
        while(conditionsFound[2].includes('@if')) {
            var _tmp = conditionsFound[0].substring(1); //Remove the first char to avoid inifinity loop (If includes @if but not a working if statement) 
            conditionsFound = conditionEx.exec(_tmp); 
        }
        //END QUICKFIX

        
        //Expression to be evaluated
        var expr_values = conditionsFound[1].split(' ');
        //Must be 3 items where index 1 is =, ==, ===, or !=, !==
        if(!(expr_values.length === 3 || (expr_values.length === 7 && (expr_values[3] === '&&' || expr_values[3] === '||' )))) {
            grunt.log.error("Error in @if statment. Check documentation for more information");
            filecontent = filecontent.replace(conditionsFound[0], '');
        }
        
        //EVALUATE
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
    
    return filecontent;

}
module.exports.runConditions = runConditions;


