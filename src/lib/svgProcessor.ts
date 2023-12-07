type SVGMapping = Record<string, string>;

const determineType = (fileName: string): keyof SVGMapping | null => {
    if (fileName.includes('Monogram')) return 'monogram';
    if (fileName.includes('Wordmark')) return 'wordmark';
    if (fileName.includes('Full Logo')) return 'full_logo';
    return null;
};

export const filesToSVGStrings = (files: { file: File, logoType: string }[]): Promise<SVGMapping> => {
    const promises = files.map(({ file, logoType }) => {

        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const content = (e.target as FileReader).result as string;
                    resolve(content);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error(`Error reading the SVG file ${file.name}.`));
            };

            reader.readAsText(file);
        });
    });

    return Promise.all(promises).then(results => {
        const svgMapping: SVGMapping = {};
        results.forEach((content, index) => {
            const type = files[index].logoType;
            if (type) {
                svgMapping[type] = content;
            }
        });
        return svgMapping;
    });
};
