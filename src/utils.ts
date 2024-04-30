// node --version # Should be >= 18
// npm install @google/generative-ai

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const processBase64 = (base64: string) => {
    if (base64.split(',').length > 0) {
        return base64.split(',')[1]
    }
    return '';
}

export const getBase64Image = (blob: Blob | File): Promise<string> => {
    try {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            }
            reader.onerror = reject
            reader.readAsDataURL(blob);
        })
    } catch (error) {
        console.error('Error converting to base64:', error);
        throw error;
    }
}

const loadImageAsBuffer = async (imageUrl: string): Promise<string> => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const base64 = await getBase64Image(blob);
        const processedb64 = processBase64(base64);
        return processedb64;
    } catch (error) {
        console.error('Error loading image:', error);
        throw error;
    }
};

export async function run(input: string) {

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    const model = genAI.getGenerativeModel({ model: import.meta.env.VITE_MODEL_NAME });

    const base64Image0 = await loadImageAsBuffer('./image0.png');
    const base64Image1 = await loadImageAsBuffer('./image1.png');
    const base64Image2 = await loadImageAsBuffer('./image2.png');
    const base64Image3 = await loadImageAsBuffer('./image3.png');
    const base64Image4 = await loadImageAsBuffer('./image4.png');

    const generationConfig = {
        temperature: 0.9,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 1024,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const parts = [
        { text: "Extract the clothes in the provided image along with color, material used and output them in a list in alphabetical order. If it does not contain any clothes return 'N/A'" },
        { text: "Image: " },
        {
            inlineData: {
                mimeType: "image/png",
                data: base64Image0
            }
        },
        {
            text: `List of Clothes:
            {
                item: shirt,
                color: red,
                material: cotton
            },
            {
                item: pants,
                color: black,
                material: polyster / cotton
            },
            {
                item: belt,
                color: brown,
                material: leather
            }`
        },
        { text: "Image: " },
        {
            inlineData: {
                mimeType: "image/png",
                data: base64Image1
            }
        },
        {
            text: `List of Clothes:
            {
                item: kurti,
                color: orange,
                material: cotton embroidery
            }`
        },
        { text: "Image: " },
        {
            inlineData: {
                mimeType: "image/png",
                data: base64Image2
            }
        },
        { text: "List of Clothes: n/a" },
        {
            inlineData: {
                mimeType: "image/png",
                data: base64Image3
            }
        },
        {
            text: `List of Clothes:
            {
                item: jeans,
                color: black,
                material: denim
            },
            {
                item: polo,
                color: purple,
                material: cotton pique
            }`
        },
        { text: "Image: " },
        {
            inlineData: {
                mimeType: "image/png",
                data: base64Image4
            }
        },
        {
            text: `List of Clothes:
            {
                item: one piece,
                color: pink,
                material: chiffon
            }`
        },
        { text: "Image: " },
        {
            inlineData: {
                mimeType: "image/png",
                data: input
            }
        },
        {
            text: `List of Clothes: `
        },
    ];

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    });

    const response = result.response;
    return response.text();
}


export interface Clothing {
    item: string;
    color: string;
    material: string;
}


export const parseClothingData = (input: string): Clothing[] => {
    const clothingArray: Clothing[] = [];

    if (input.trim().toLowerCase() === 'n/a') {
        return clothingArray;
    }
    const regex = /\{([^}]*)\}/g;
    const matches = input.match(regex);

    if (matches) {
        matches.forEach(match => {
            const itemMatch = match.match(/item: ([^,]+)/);
            const colorMatch = match.match(/color: ([^,]+)/);
            const materialMatch = match.match(/material: ([^,]+)/);

            if (itemMatch && colorMatch && materialMatch) {
                clothingArray.push({
                    item: itemMatch[1].trim(),
                    color: colorMatch[1].trim(),
                    material: materialMatch[1].trim()
                });
            }
        });
    }

    return clothingArray;
};
