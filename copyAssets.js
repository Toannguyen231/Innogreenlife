const fs = require('fs')
const path = require('path')

const src  = path.join(__dirname, 'img')
const dest = path.join(__dirname, 'src', 'assets', 'img')

if (!fs.existsSync(path.join(__dirname, 'src', 'assets'))) {
  fs.mkdirSync(path.join(__dirname, 'src', 'assets'), { recursive: true })
}
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true })
}

fs.readdirSync(src).forEach(file => {
  fs.copyFileSync(path.join(src, file), path.join(dest, file))
  console.log('Copied:', file)
})
console.log('Done.')
