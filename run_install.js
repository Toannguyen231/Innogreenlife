const { execSync } = require('child_process');
try {
  console.log('Running npm install...');
  const output = execSync('npm install', { stdio: 'pipe' });
  console.log(output.toString());
} catch (error) {
  console.error('Error during npm install:');
  console.error(error.message);
  if (error.stdout) console.log(error.stdout.toString());
  if (error.stderr) console.error(error.stderr.toString());
}
