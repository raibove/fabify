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

export interface DetailClothing extends Clothing {
    design: string;
    additionalDetail: string;
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


export async function getComplementOutfit(input: Clothing) {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    const model = genAI.getGenerativeModel({ model: import.meta.env.VITE_COMPLEMENT_OUTFIT_MODEL });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 8192,
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


    console.log(input);

    const parts = [
        { text: "you are a fashion expert, for given cloth details you Provide outfit options that best complement the given clothing item.\n\nEach outfit option should include details such as the item name, color, material, design, pattern (if applicable), and any additional details that might be relevant.\nAlways give JSON array as output. \n\nEach item should have only one valid color." },
        { text: "input: {\n\"color\": \"yellow\"\n\"item\": \"polo\"\n\"material\": \"cotton pique\n}" },
        { text: "output: [\n  {\n    \"item\": \"Chinos\",\n    \"color\": \"Navy Blue\",\n    \"fabric\": \"Cotton\",\n    \"design\": \"Slim-fit\",\n    \"additional details\": \"Classic five-pocket style\"\n  },\n  {\n    \"item\": \"Blazer\",\n    \"color\": \"Charcoal Gray\",\n    \"fabric\": \"Wool\",\n    \"design\": \"Single-breasted\",\n    \"additional details\": \"Notched lapel with two-button closure\"\n  },\n  {\n    \"item\": \"Shorts\",\n    \"color\": \"Beige\",\n    \"fabric\": \"Cotton\",\n    \"design\": \"Slim-fit\",\n    \"additional details\": \"Flat-front with belt loops\"\n  },\n  {\n    \"item\": \"Jeans\",\n    \"color\": \"Light Blue\",\n    \"fabric\": \"Denim\",\n    \"design\": \"Slim-fit\",\n    \"additional details\": \"Casual and versatile\"\n  },\n  {\n    \"item\": \"Formal Pant\",\n    \"color\": \"Gray\",\n    \"fabric\": \"Polyester\",\n    \"design\": \"Loose-fit\",\n    \"additional details\": \"Suitable for formal occasions\"\n  }\n]" },
        { text: "input: {\ncolor: \"pink\"\nitem: \"skirt\"\nmaterial: \"chiffon\n}" },
        { text: "output: [\n  {\n    \"item\": \"Blouse\",\n    \"color\": \"White\",\n    \"fabric\": \"Silk\",\n    \"design\": \"Flowy\",\n    \"additional details\": \"Lace detailing\"\n  },\n  {\n    \"item\": \"Tank Top\",\n    \"color\": \"Black\",\n    \"fabric\": \"Cotton\",\n    \"design\": \"Fitted\",\n    \"additional details\": \"Versatile and stylish\"\n  },\n  {\n    \"item\": \"Jacket\",\n    \"color\": \"Blue\",\n    \"fabric\": \"Denim\",\n    \"design\": \"Classic\",\n    \"additional details\": \"Distressed detailing\"\n  },\n  {\n    \"item\": \"Sweater\",\n    \"color\": \"Gray\",\n    \"fabric\": \"Cashmere\",\n    \"design\": \"Relaxed-fit\",\n    \"additional details\": \"Soft and cozy\"\n  },\n  {\n    \"item\": \"Jacket\",\n    \"color\": \"Black\",\n    \"fabric\": \"Leather\",\n    \"design\": \"Biker-style\",\n    \"additional details\": \"Edgy and chic\"\n  }\n]" },
        { text: "input: {\ncolor: \"white\"\nitem: \"shorts\"\nmaterial: \"cotton\"\n}" },
        { text: "output: [\n  {\n    \"item\": \"Striped Shirt\",\n    \"color\": \"Light Blue\",\n    \"fabric\": \"Cotton\",\n    \"design\": \"Button-up\",\n    \"additional details\": \"Breathable and stylish\"\n  },\n  {\n    \"item\": \"Tank Top\",\n    \"color\": \"Gray\",\n    \"fabric\": \"Cotton\",\n    \"design\": \"Relaxed-fit\",\n    \"additional details\": \"Comfortable and versatile\"\n  },\n  {\n    \"item\": \"Cargo Jacket\",\n    \"color\": \"Olive Green\",\n    \"fabric\": \"Cotton\",\n    \"design\": \"Utility-inspired\",\n    \"additional details\": \"Multiple pockets for functionality\"\n  },\n  {\n    \"item\": \"Pullover Hoodie\",\n    \"color\": \"Navy Blue\",\n    \"fabric\": \"Cotton\",\n    \"design\": \"Casual\",\n    \"additional details\": \"Warm and cozy\"\n  },\n  {\n    \"item\": \"Graphic T-shirt\",\n    \"color\": \"Black\",\n    \"fabric\": \"Cotton\",\n    \"design\": \"Printed\",\n    \"additional details\": \"Statement piece\"\n  }\n]" },
        { text: "input: {item: 'skirt', color: 'blue', material: 'scuba'}" },
        { text: "output: [\n  {\n    \"item\": \"Crop Top\",\n    \"color\": \"White\",\n    \"fabric\": \"Cotton\",\n    \"design\": \"Fitted\",\n    \"additional details\": \"Pairs well with vibrant colors\"\n  },\n  {\n    \"item\": \"Off-shoulder Blouse\",\n    \"color\": \"Yellow\",\n    \"fabric\": \"Chiffon\",\n    \"design\": \"Flowy\",\n    \"additional details\": \"Adds a pop of color\"\n  },\n  {\n    \"item\": \"Jacket\",\n    \"color\": \"Blue\",\n    \"fabric\": \"Denim\",\n    \"design\": \"Classic\",\n    \"additional details\": \"Timeless and versatile\"\n  },\n  {\n    \"item\": \"Bodysuit\",\n    \"color\": \"Black\",\n    \"fabric\": \"Spandex\",\n    \"design\": \"Form-fitting\",\n    \"additional details\": \"Sleek and stylish\"\n  },\n  {\n    \"item\": \"T-shirt\",\n    \"color\": \"Striped\",\n    \"fabric\": \"Cotton\",\n    \"design\": \"Casual\",\n    \"additional details\": \"Effortlessly chic\"\n  }\n]" },
        { text: "input: {item: 'pants', color: 'green', material: 'silk'}" },
        { text: "output: [\n  {\n    \"item\": \"Blouse\",\n    \"color\": \"White\",\n    \"fabric\": \"Silk\",\n    \"design\": \"Flowy\",\n    \"additional details\": \"Elegant and sophisticated\"\n  },\n  {\n    \"item\": \"Lace Camisole\",\n    \"color\": \"Black\",\n    \"fabric\": \"Silk\",\n    \"design\": \"Lace detailing\",\n    \"additional details\": \"Adds a touch of femininity\"\n  },\n  {\n    \"item\": \"Sweater\",\n    \"color\": \"Gray\",\n    \"fabric\": \"Cashmere\",\n    \"design\": \"Relaxed-fit\",\n    \"additional details\": \"Luxuriously soft and warm\"\n  },\n  {\n    \"item\": \"Blazer\",\n    \"color\": \"Navy Blue\",\n    \"fabric\": \"Velvet\",\n    \"design\": \"Tailored\",\n    \"additional details\": \"Rich texture for a stylish look\"\n  },\n  {\n    \"item\": \"Tank Top\",\n    \"color\": \"Burgundy\",\n    \"fabric\": \"Satin\",\n    \"design\": \"Sleek\",\n    \"additional details\": \"Adds a touch of glamour\"\n  }\n]" },
        { text: "input: {item: 'dress', color: 'purple', material: 'chiffon'}" },
        { text: "output: [\n  {\n    \"item\": \"Statement Necklace\",\n    \"color\": \"Silver\",\n    \"material\": \"Metal\",\n    \"design\": \"Bold\",\n    \"additional details\": \"Adds sparkle and elegance\"\n  },\n  {\n    \"item\": \"Strappy Heels\",\n    \"color\": \"Black\",\n    \"material\": \"Leather\",\n    \"design\": \"Stiletto\",\n    \"additional details\": \"Classic and versatile\"\n  },\n  {\n    \"item\": \"Gold Hoop Earrings\",\n    \"color\": \"Gold\",\n    \"material\": \"Metal\",\n    \"design\": \"Simple\",\n    \"additional details\": \"Subtle yet stylish accessory\"\n  },\n  {\n    \"item\": \"Clutch Bag\",\n    \"color\": \"White\",\n    \"material\": \"Leather\",\n    \"design\": \"Envelope style\",\n    \"additional details\": \"Complements any outfit\"\n  },\n  {\n    \"item\": \"Crystal Embellished Bracelet\",\n    \"color\": \"Crystal\",\n    \"material\": \"Metal\",\n    \"design\": \"Sparkling\",\n    \"additional details\": \"Adds a touch of glamour\"\n  }\n]" },
        { text: "input: {\ncolor: \"white\",\nitem: \"Kurta\",\nmaterial: \"cotton\"\n}" },
        { text: "output: " },
    ];

    
    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    });

    const response = result.response;
    return response.text();
}

export function processComplementOutfit(inputDataString: string): DetailClothing[] {
    const regex = /{[^{}]*}/g;
    const matches = inputDataString.match(regex);

    if (matches) {
        const processedData: DetailClothing[] = matches.map((match: string) => {
            const itemData = JSON.parse(match);
            return {
                item: itemData.item,
                color: itemData.color,
                material: itemData.fabric,
                design: itemData.design,
                additionalDetail: itemData['additional details']
            };
        });

        return processedData;
    }
    return [];
}