# generator-angular-jeej
Why would you use this generator ?
Because it gives:
Gulp, Angular, coffeescript, jquery, bootstrap, font awesome, commitement to open source. browser sync, karma, jasmine, jslint, uglify, coverall and more.
with some tests examples, and a sassy way to use sass.
status: working by now.
Yet there are some dependecies to make work. See Todo's section.

<a href="https://nodei.co/npm/generator-angular-jeej/">
<img src="https://nodei.co/npm/generator-angular-jeej.png?downloads=true&downloadRank=true&stars=true" />
</a>
## Getting Started
you need yeoman from NPM. To install it in command line, run this:
```sh
$ npm i -g yo
```
to run the generator, use yo.
```sh
$ yo angular-jeej
```
You will be asked a name for your webapp.
After all is set up, enjoy your new app.
You just have to run the default gulp task to have your webapp live.
Each time you will save a scss, coffee, or html, they will be compiled, concatened and rendered into the dist folder.

```sh
$ gulp
```
if you did no error in these watched files, you will be able to reach your webapp on localhost.
http://localhost:3002/
### Troubleshooting

if you have issues while running the generator, like dependencies failues, update your generators.

### Todo's

 - wiredep to link dependencies with bower on the index template.
 - add breadcrumb module
 - gulp making documentation
 - ui router to add to angluar
 - command to build a ng route
- Write Tests

## made with the  [Yeoman](http://yeoman.io) generator
by [Tykayn](http://artlemoine.com) - [Tykayn Github](http://github.com/tykayn)
If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).

## License

MIT


