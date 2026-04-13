const fs = require('fs');
const path = require('path');

const legacyDir = path.join(__dirname, 'legacy-vanilla');
if (!fs.existsSync(legacyDir)) {
    fs.mkdirSync(legacyDir);
}

const filesToMove = [
    'app.js',
    'img',
    'index.html',
    'product.html',
    'stadee.png',
    'styles.css',
    'styles.scss'
];

filesToMove.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(legacyDir, file);
    if (fs.existsSync(src)) {
        fs.renameSync(src, dest);
    }
});

console.log('Files moved to legacy-vanilla');
