const fs = require('fs');
const { X509Certificate } = require('crypto');

const cert = new X509Certificate(fs.readFileSync('server.crt'));
console.log('Subject CN =', cert.subject.split('\n').find(l => l.startsWith('CN=')));