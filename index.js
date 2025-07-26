import fs from 'fs';
import http from 'http';
import https from 'https';
import { URL } from 'url';

/**
 * 
 * @param {*} image_url 
 * @param {*} outputFilePath including the name of the download file
 * @returns 
 */
export function getImage(image_url, outputFilePath) {
    const url = new URL(image_url);
    const client = url.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(outputFilePath);
        client.get(url, (response) => {
            if (response.statusCode !== 200) {
                console.error(`Failed to get image. Status code: ${response.statusCode}`);
            }

            response.pipe(file);

            file.on('finish', () => {
                console.log(`Downloaded success: ${outputFilePath}`);
                file.close()
            })

            file.on('error', (err) => {
                fs.unlinkSync(outputFilePath);
                console.error('Error writing file:', err);
                file.close();
            })

            file.on('close', () => {
                resolve();
            })

        }).on('error', (err) => {
            console.error('Request error:', err.message);
        })

    })
}