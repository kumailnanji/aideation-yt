export const fileToSVGString = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                let content = (e.target as FileReader).result as string;
                resolve(content);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading the SVG file.'));
        };

        reader.readAsText(file);
    });
};
