import sharp from 'sharp'

type FileType = 'svg' | 'pdf' | 'png' | 'jpg';


const convertSVG = async (svgContent: string, toType: FileType): Promise<Buffer> => {
    if (toType === 'svg') {
      return Buffer.from(svgContent);
    }
  
    const sharpInstance = sharp(Buffer.from(svgContent));
  
    if (toType === 'png') {
      return sharpInstance.png().toBuffer();
    }
  
    if (toType === 'jpg') {
      return sharpInstance.jpeg().toBuffer();
    }
  
    // If you find a library for SVG to PDF, implement here.
    if (toType === 'pdf') {
      throw new Error('SVG to PDF conversion not yet implemented');
    }
  
    throw new Error(`Unsupported conversion type: ${toType}`);
  };
  