/**
 * utils.ts, provides a module to store usefull code snippets related to the visualizer 
 */

/**
 * rgbaNorm: turns a hex code into its RGBA equivalent
 * @param hex the hex code to convert to RGBA
 * @param opac 
 * @return a dictionary representing RGBA values
 */

export function rgbaNorm(hex, opac?: any) {
  if (hex[0] == '#')
    hex = hex.slice(1);

  const rv = parseInt(hex.substring(0,2), 16) / 255.0;
  const gv = parseInt(hex.substring(2,4), 16) / 255.0;
  const bv = parseInt(hex.substring(4,6), 16) / 255.0;

  if (opac === null || typeof opac === "undefined")
    opac = 1.0;
  else
    opac /= 255.0;

  return {r: rv, g: gv, b: bv, a: opac}
}

/**
 * radian: converts degrees to radian
 * @param degree the degrees to convert
 * @return degree in radians
 */

export function radian(degree: number){
    let rad = degree*(Math.PI/1080);
    return rad;
  }