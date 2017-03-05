const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const data = require('./test-results.json');

const depad = (s) => s.replace(/\n/g, '').replace(/\\n/, '').replace(/\s+/g, ' ');

let page = `# Test Results
**Ran ${data.stats.tests} Tests (${data.stats.suites} Suites) in ${data.stats.duration}ms.**
 - Run Date/Time: ${data.stats.start}
 - ${data.stats.passes} tests passed
 - ${data.stats.failures} tests failed
 - ${data.stats.pending} tests skipped

`;

let suites = {};
_.forEach(data.tests, t => {
    let suite = depad(t.fullTitle.substring(0, t.fullTitle.indexOf(t.title))),
        title = depad(t.title),
        time = t.duration > 100 ? `**${t.duration}**` : t.duration,
        error = _.isEmpty(t.err) ? '' : `\n${JSON.stringify(t.err, null, 2)}`,
        pass = error ? '**FAILED**' : 'OK';

    if (!suites[suite]) suites[suite] = [];
    suites[suite].push(`   - ${title}(${time}ms) ... ${pass}${error}\n`);
});
page += _.map(suites, (s, k) => `#### ${k}\n${s.join('')}`).join('\n');

fs.writeFileSync(path.join(__dirname, 'test-results.md'), page);
