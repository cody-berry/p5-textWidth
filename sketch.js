/**
 * @author Cody
 * @date 2022-01-19
 *
 * coding plan 🔧
 * ☐ display black background, white text.
 * ☐ write 'i' and 'm' on screen to compare their widths
 *     ☐ check your chrome zoom settings. accurate results only at 100%
 * ☐ measure each character's width by checking pixels in order
 *     ☐ loadpixels in small canvas: 30x50 or so
 *     ☐ iterate through every canvas pixel from left to right
 *     ☐ keep track of the last non-black pixel you saw. that's the width!
 *         ☐ how do you determine "non-black"? there are 4 values per pixel
 * ☐ encapsulate functions
 *     ☐ one using .get to retrieve color 'object'
 *          ☐ see .get() docs https://p5js.org/reference/#/p5/get
 *     ☐ the other using pixels[]
 * ☐ convert to pGraphics object: off-screen buffer with createGraphics
 * ☐ use charWidth to display single words
 * ☐ now use charWidth to make textWidth. exception for gigamaru space char
 * ☐ transfer into p5-dialogsystem!
 *
 */


let font

/**
 * this can't be large because our charWidth graphics buffer is of finite
 * size! note that we must also take into account our webpage scaling in
 * chrome; I have it set at 125%, a significant bump up from default.
 * @type {number}
 */
const FONT_SIZE = 25
const LETTER_SPACING = 1.25
const SPACE_WIDTH = FONT_SIZE / 2


function preload() {
    font = loadFont('data/giga.ttf')
    // font = loadFont("data/meiryo.ttf")
}


function setup() {
    createCanvas(FONT_SIZE*2, FONT_SIZE*3, WEBGL)
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, FONT_SIZE)

    fill(0, 0, 100)
    noStroke()

    // it automatically translated to width/2, height/2
    translate(-width/2, -height/2)

    background(234, 34, 24)

    // let input = "I couldn't even get one pixel working because my generatePixel function didn't work. I need four nested loops to be able to complete my task because I don't know how to do this otherwise. It seems like I'm loading just fine."

    // displayPassage(input)
    // console.log(charWidth("i")
    let char = "M"

    /* do charWidth in setup first so you can see the tiny canvas and letters */
    /* encapsulate this logic later in a function */
    // let g = createGraphics(FONT_SIZE, FONT_SIZE * 1.5)
    // colorMode(HSB, 360, 100, 100, 100)
    colorMode(RGB, 100, 100, 100, 255)
    textFont(font, FONT_SIZE)
    background(0, 0, 0, 100)
    fill(255, 255, 255)
    text(char, 0, textAscent())
    // our maximum x
    let maxX = 0;
    // our pixel density
    let d = pixelDensity()
    loadPixels()

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            // the pixels starting component
            let index = (y * width + x)*d*d*4
            // the color components, red, green, blue, and alpha
            // the last non-black pixel we see is the maximum x
            let redFail = (pixels[index] !== 0)
            let blueFail = (pixels[index+1] !== 0)
            let greenFail = (pixels[index+2] !== 0)
            let alphaFail = (pixels[index+3] !== 255)
            console.log(index)
            console.log(pixels[index])
            console.log(pixels[index+1])
            console.log(pixels[index+2])
            console.log(pixels[index+3])
            stroke(pixels[index], pixels[index+1], pixels[index+2], pixels[index+3])
            strokeWeight(0)
            point(x, y)

            if (redFail && blueFail && greenFail && alphaFail) {
                maxX = max(x, maxX)
                // stroke(pixels[index], pixels[index+1], pixels[index+2], pixels[index+3])
                // strokeWeight(0)
                // point(x, y)
            }
        }
    }

    // updatePixels()

    console.log(maxX)

    // image(g, 0, 0)
}


function draw() {}


function displayPassage(passage) {
    let cursor = new p5.Vector(0, 100)
}


/**
 * use charWidth to find the width of more than one character
 */
function wordWidth(word) {
    let sum = 0

    return sum
}


/*  return the width in pixels of char using the pixels array
 */
function charWidth(char) {
    /**
     * create a graphics buffer to display a character. then determine its
     * width by iterating through every pixel. Noting that 'm' in size 18
     * font is only 14 pixels, perhaps setting the buffer to a max width of
     * FONT_SIZE is sufficient. The height needs to be a bit higher to
     * account for textDescent, textAscent. x1.5 is inexact, but should be
     * plenty.
     * @type {p5.Graphics}
     */
    let g = createGraphics(FONT_SIZE, FONT_SIZE * 1.5)
    g.colorMode(HSB, 360, 100, 100, 100)
    g.textFont(font, FONT_SIZE)
    g.background(0, 0, 0)
    g.fill(0, 0, 100)
    g.text(char, 0, 0)

    // our maximum x
    let maxX = 0;

    for (let x = 0; x < g.width; x++) {
        for (let y = 0; y < g.height; y++) {
            // the pixels starting component
            let startComponent = (y * g.width + x)*4
            // the color components, red, green, blue, and alpha
            // the last non-black pixel we see is the maximum x
            let redFail = (g.pixels[startComponent] !== 0)
            let blueFail = (g.pixels[startComponent+1] !== 0)
            let greenFail = (g.pixels[startComponent+2] !== 0)
            let alphaFail = (g.pixels[startComponent+3] !== 255)

            if (redFail && blueFail && greenFail && alphaFail) {
                maxX = max(x, maxX)
            }
        }
    }
    return maxX
}


/**
 * From p5.js documentation, as reference:
 * This function shows how the pixels in pixels[] from loadPixels are
 * organized: they are in groups of 4 in [r,g,b,a] order.
 * @param x
 * @param y
 * @param pixelDensity
 */
function getPixel(x, y, pixelDensity) {
    loadPixels()
    let off = (y * width + x) * pixelDensity * 4;
    let components = [
        pixels[off],
        pixels[off + 1],
        pixels[off + 2],
        pixels[off + 3]
    ]
}


/**
 * Original code from a forum post that inspired this brute-force method of
 * finding a character's textWidth.
 */
function archive() {
    let max_x = 0 // the furthest right this character displays on screen
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            // every pixel is represented as 4 values in pixels[]: rgba
            let p = 4 * (x + y * width)

            if (pixels[p] > 0) {
                debug = max_x
                max_x = Math.max(x, max_x)
            }
        }
    }
}