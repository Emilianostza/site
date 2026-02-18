var fs = require('fs');
var c = Buffer.from(process.argv[1], 'base64').toString('utf8');
fs.writeFileSync(
  'c:/Users/emili/Downloads/managed-capture-3d-platform/src/pages/editor/SceneDashboard.tsx',
  c,
  'utf8'
);
console.log('Done', c.length);
