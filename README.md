# grunt-template-parts

Simple static html generator from different html parts!


Main html file example

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Test template for Grunt Templating Generator</title>
</head>
<body>
    
    @get_template_part('header.html', {
      "title" : "header",
      "class" : "classes",
      "show_image": true
    })

    <h2>The Grunt Templating Generator</h2>
    <ul>
      @loop(5)
        <li>Index $$i</li>
      @endloop
    </ul>
</body>
</html>
```
Included file example


```html
  <div class="{{class}}">
    <h1>{{title}}</h1>
    @if({{show_image}} == true)
      <img src="#" />
    @endif
  </div>
```

## Faker functions
We now support some simple functions from Faker

```html
@faker(name) <!-- Generates a random name -->
@faker(email, arg) <!-- Generates a random email address, arg can be set to force a specific domain. -->
@faker(excerpt, arg) <!-- Generates an short text, arg can be set to a number to set the number of sentences. -->
@faker(words, arg) <!-- Generate "arg" number of words -->
@faker(number, arg1, arg2) <!-- Generate a random number from "arg1 to arg2" -->
```

###Example:
```html
<h3>Contactcard</h3>
<p>
    Name: @faker(name)<br />
    Email: @faker(email, domain.com) <br />
    Age: @faker(number, 18, 99) <br />
    Interests: @faker(words, 10)  
</p>
<h6>Short description: </h5>
<p>@faker(excerpt, 10)</p>
```


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-template-parts --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-template-parts');
```

## The "templateparts" task

### Overview
In your project's Gruntfile, add a section named `templateparts` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  templateparts: {
    options: {
      // Task-specific options go here.
    },
      // Target-specific file lists and/or options go here.
    },
  },
});
```


### Usage Examples


```js
grunt.initConfig({
  templateparts: {
    options: {
      includes_directory: 'assets/templates/_includes',
      source_directory: 'assets/templates',
      output_directory: 'assets/frontend-exempel'
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
