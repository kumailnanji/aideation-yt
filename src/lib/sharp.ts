
import sharp from 'sharp'

// const sharp = require("sharp");

async function generatePNG(svg: any): Promise<Buffer> {
    const file = await sharp(svg).png().toBuffer();
    return file;
}

export default generatePNG;
