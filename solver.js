// Require the built-in 'fs' (File System) module to read files
const fs = require('fs');

/**
 * Converts a string representation of a number in a given base to a BigInt.
 * This is necessary for numbers that exceed JavaScript's standard number limits.
 * @param {string} str The string to convert.
 * @param {number} base The base of the number (2-36).
 * @returns {BigInt} The converted BigInt value.
 */
function convertToBigInt(str, base) {
    let result = 0n;
    const bigIntBase = BigInt(base);
    for (const ch of str.toLowerCase()) {
        // parseInt handles digits 0-9 and letters a-z
        let digit = parseInt(ch, 36);
        if (digit >= base || digit < 0) {
            throw new Error(`Invalid digit '${ch}' for base ${base}`);
        }
        result = result * bigIntBase + BigInt(digit);
    }
    return result;
}

try {
    // Read the content of 'input.json' as a string
    const jsonString = fs.readFileSync('./input.json', 'utf8');

    // --- 1. Parse JSON ---
    const data = JSON.parse(jsonString);
    const n = data.keys.n;
    const k = BigInt(data.keys.k);

    // --- 2. Convert all roots ---
    const roots = [];
    for (const key in data) {
        if (key !== "keys") {
            const rootObj = data[key];
            const base = parseInt(rootObj.base, 10);
            const value = rootObj.value;
            const decimalValue = convertToBigInt(value, base);
            roots.push(decimalValue);
        }
    }

    // --- 3. Compute product of roots ---
    const productOfRoots = roots.reduce((prod, root) => prod * root, 1n);

    // --- 4. Apply formula: constant = k * (-1)^n * productOfRoots ---
    const signFactor = (n % 2 === 0) ? 1n : -1n;
    const constantTerm = k * signFactor * productOfRoots;

    // --- 5. Output ---
    console.log("Successfully read data from input.json ✅");
    console.log("\nPolynomial Parameters:");
    console.log(`  - Number of roots (n): ${n}`);
    console.log(`  - Leading coefficient (k): ${k}`);

    console.log("\nConverted Roots (decimal BigInts):");
    roots.forEach((r, i) => console.log(`  - Root ${i + 1}: ${r}`));

    console.log("\nCalculation:");
    console.log(`  - Product of roots: ${productOfRoots}`);
    console.log(`  - Sign factor (-1)^${n}: ${signFactor}`);

    console.log(`\n## Final Constant Term: ${constantTerm} ##`);

} catch (error) {
    // This block will run if the file can't be read or parsed
    console.error("❌ Error:", error.message);
    console.error("Please make sure 'input.json' exists in the same directory and is a valid JSON file.");
}