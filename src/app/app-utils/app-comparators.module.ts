/**
 * @returns numeric value of the resulting comparation
 * @description compares two hexademical color codes in format #ff11aa
 *  
 * @param c1 color code only in hexademical format of the first element
 * @param c2 color code only in hexademical format of the second element
 */
export function compareColors (c1: string, c2: string): number {
    const a1 = c1.substr(1, c1.length);
    const a2 = c2.substr(1, c2.length);
    const base = 16;
    const r1 = parseInt(a1.substr(0, 2), base);
    const g1 = parseInt(a1.substr(2, 2), base);
    const b1 = parseInt(a1.substr(4, 2), base);
    const r2 = parseInt(a2.substr(0, 2), base);
    const g2 = parseInt(a2.substr(2, 2), base);
    const b2 = parseInt(a2.substr(4, 2), base);
    const result = this.rgbToHsl(r1, g1, b1)[0]
      - this.rgbToHsl(r2, g2, b2)[0];
    return result;
  }

/**
 * @returns color code in hsl format as array of numbers [hue, saturation, lightness]
 * @description transforms rgb color code to hsl
 * 
 * @param r red color value between 0 and 255
 * @param g green color value between 0 and 255
 * @param b blue color value between 0 and 255
 */
export function rgbToHsl(r: number, g: number, b: number): number[]{
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) { h = s = 0; } 
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return [(h*100+0.5)|0, ((s*100+0.5)|0), ((l*100+0.5)|0)];
}