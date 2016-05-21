Standout
========
Jquery plugin to make elements on web pages stand out. Good for letting readers concentrate on one paragraph at a time.

## Usage

`$('#my-container').standout();`


By default on click makes `<p>` element inside `#my-container` stand out and then changes and by changing mouse position changes `<p>` element that stands out with an animation.
Without options creates a white semitransparent overlay for elements other than active;

## Adding options

`$('#your-container').standout(options);`

example options
* overlayColor - a css property for overlay color
* overlayOpacity - a css property for overlay opacity
* elements - an array of css selectors for elements that should stand out
* overlayClass - class to add to overlay element
* activeClass - class to add to stainding out element


example


`
$('#your-container').standout({
    overlayColor: "#33fc12";  
    elements: "div, p, ul"  
  });
`  

##Development

Make sure you have Grunt installed globally. Then run:

```shell
npm install
```
##Running tasks

```shell
grunt
```


##Running Example

Copy **exapmles** and **src** folders to your server document root
and navigate to examples/ from a browser. Alternatively just run
examples/index.html from file system
