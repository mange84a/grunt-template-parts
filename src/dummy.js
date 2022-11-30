var dummydata = function(filecontent, grunt, options) {
    try {
        var faker = require('@faker-js/faker');
    } catch(ex) {
        grunt.log.writeln("Faker not installed");
    }
    
    if(faker === undefined) { return filecontent; }
    faker.locale = 'sv';
    
    //Faker Regex
    var fakerEx = new RegExp('@faker\\((.*?)\\)'); 
 
    var fakersFound = fakerEx.exec(filecontent);
    
    while(fakersFound) {
        var args = fakersFound[1];
        //Handle args?
        var fn = '';
        var a = null;
        if(!args) { continue; }

        a = args.split(',');
        fn = a[0];
        var dummytext = '';
        switch(fn) {
            case 'name': 
                if(a.length === 2) {
                    if(a[1].trim() === 'male') {
                        dummytext = faker.name.findName(undefined, undefined, 0);
                    } else {
                        dummytext = faker.name.findName(undefined, undefined, 1);
                    }
                } else {
                    dummytext = faker.name.findName();
                }
                break;
            case 'email':
                if(a.length === 2) {
                    dummytext = faker.internet.email(undefined, undefined, a[1].trim()).toLowerCase();
                } else {
                    dummytext = faker.internet.email().toLowerCase();
                }
                break;
            case 'excerpt':
                if(a.length === 2) {
                    dummytext = faker.lorem.sentences(a[1]);
                } else {
                    dummytext = faker.lorem.sentences();
                }
                break;
            case 'jobtitle':
                dummytext = faker.name.jobTitle();
                break;
            case 'words':
                if(a.length == 2) {
                    if(a[1].trim() === "1") { dummytext = "Lorem"; }
                    dummytext = "Lorem " + faker.lorem.words(a[1]);
                } else {
                    dummytext = "Lorem";
                }
                break;
            case 'number':
                if(a.length === 3) {
                    dummytext = faker.datatype.number({ 
                        max: parseInt(a[1]), 
                        min: parseInt(a[2])
                    });
                } else if(a.length === 2) {
                    dummytext = faker.datatype.number(parseInt(a[1]));
                } else {
                    dummytext = faker.datatype.number();
                }
                break;
            case 'phone':
                if(a.length === 2) {
                    dummytext = faker.phone.phoneNumber(a[1].replaceAll("'", "").replaceAll('"',""));
                } else {
                    dummytext = faker.phone.phoneNumber();
                }
                break;
            case 'address': 
                dummytext = faker.address.streetName().replace(/\s/g, '') + ' ' + faker.datatype.number(99);
                break;
            case 'zip-city':
                dummytext = faker.address.zipCode('### ##') + ' ' + faker.address.city();
                break;
            case 'gender':
                dummytext = faker.name.gender(true);
        }

        filecontent = filecontent.replace(fakersFound[0], dummytext);
        fakersFound = fakerEx.exec(filecontent);
    }
    return filecontent;
}

module.exports.dummydata = dummydata;

