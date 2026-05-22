const fs = require('fs');
const pdf = require('pdf-parse');

async function run() {
    try {
        const dataBuffer = fs.readFileSync('d:/atento5-premium/Cotizacion Atento5.pdf');
        const uint8Array = new Uint8Array(dataBuffer);
        const parser = new pdf.PDFParse(uint8Array);
        console.log("Loading PDF...");
        await parser.load();
        console.log("PDF loaded successfully.");
        const text = await parser.getText();
        console.log("=== Text ===");
        console.log(text);
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
