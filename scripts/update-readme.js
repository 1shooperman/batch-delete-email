const fs = require('fs');

let apiDocs = '';
process.stdin.on('data', chunk => {
  apiDocs += chunk;
});

process.stdin.on('end', () => {
  const readme = fs.readFileSync('README.md', 'utf8');
  
  const newReadme = readme.replace(
    /(<!-- API -->)[\s\S]*?(<!-- \/API -->)/,
    `$1\n${apiDocs}\n$2`
  );

  fs.writeFileSync('README.md', newReadme);
}); 