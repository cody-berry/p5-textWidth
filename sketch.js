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
const FONT_SIZE = 18
const LETTER_SPACING = 1.25
const SPACE_WIDTH = FONT_SIZE / 2


function preload() {
    font = loadFont('data/giga.ttf')
    // font = loadFont("data/meiryo.ttf")
}


function setup() {
    createCanvas(50, 50)

    colorMode(HSB, 360, 100, 100, 100)
    background(0, 0, 0)

    textFont(font, FONT_SIZE)
    let input = "I couldn't even get one pixel working because my generatePixel function didn't work. I need four nested loops to be able to complete my task because I don't know how to do this otherwise. It seems like I'm loading just fine."

    console.log(wordWidth(input))
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

    // add the sum of "olive" the char widths plus the word spacing. for
    // spaces, use spaceWidth.

    for (let c of word) {
        if (c === " ") {
            // we don't want to space the letters into a space.
            sum += SPACE_WIDTH - LETTER_SPACING
        } else {
            // We need to make room for the character and some spacing,
            // determined by L
            sum += charWidth(c) + LETTER_SPACING
        }
    }
    if (word[-1] !== " ") {
        sum -= LETTER_SPACING
    }

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
    let maxX = 0; // our maximum x
    let d = g.pixelDensity() // our pixel density

    g.text(char, 0, textAscent())

    g.loadPixels()

    for (let x = 0; x < g.width; x++) {
        for (let y = 0; y < g.height; y++) {
            let i = 4*d*(y*g.width + x)
            let redNotZero = (g.pixels[i] !== 0)
            let greenNotZero = (g.pixels[i+1] !== 0)
            let blueNotZero = (g.pixels[i+2] !== 0)
            /**
             * What does it mean for a pixel to be non-black?
             * It means that one of the red, blue, or green not zeros have
             * to be true.
             */
            let notBlack = redNotZero || greenNotZero || blueNotZero
            if (notBlack) {
                maxX = x
                // stroke(100, 100, 100)
                // point(x, y)
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