// Usage:
// 
//   $ node generate https://mail.mozilla.org/pipermail/es-discuss/2012-November/026188.html > promises.md
// 
// Note that this will over-write any existing changes, so if you want to extend an existing thread,
// use the latest message in the thread as the url, and output to a temporary file, then manually
// attach the two.

var Q = require('q');
var request = Q.nbind(require('request'));

function load(url) {
  return request(url)
    .spread(function (res, body) {
      if (res.statusCode !== 200) throw new Error(res.statusCode + ' Error: ' + body);
      body = body.toString().split('<!--beginarticle-->');
      var head = body[0];
      var title = head.split('<H1>')[1].split('</H1>')[0];
      var author = head.split('<B>')[1].split('</B>')[0].replace(/ +/g, ' ').trim();
      var date = head.split('<I>')[1].split('</I>')[0].replace(/ +/g, ' ');
      var previous = head.split('<LI>')[1].split('</li>')[0];
      var next = head.split('<LI>')[2].split('</li>')[0];
      if (previous.split('>')[1].split('<')[0].toLowerCase().trim() === title.toLowerCase().trim()) {
        previous = previous.split('"')[1].split('"')[0];
        previous = url.replace(/\/[^\/]+$/, '/' + previous);
      } else {
        previous = null;
      }
      if (next.split('>')[1].split('<')[0].toLowerCase().trim() === title.toLowerCase().trim()) {
        next = next.split('"')[1].split('"')[0];
        next = url.replace(/\/[^\/]+$/, '/' + next);
      } else {
        next = null;
      }

      var content = body[1].split('<!--endarticle-->')[0];
      content = content.replace(/\<[^\>]+\>/g, '')
        .replace(/\&gt\;/g, '>').replace(/\&lt\;/g, '<')
        .replace(/\&quot\;/g, '"');

      return {
        title: title,
        author: author,
        date: date,
        previous: previous,
        next: next,
        body: content.trim()
      }
    });
}

function loadAfter(url, continuation) {
  return load(url)
    .then(function (page) {
      var buffer = '';
      if (!continuation) {
        buffer += '# ' + page.title + '\n\n';
      }
      buffer += '## ' + page.author + '\n\n';
      buffer += '[_' + page.date + '_](' + url + ')\n\n';
      buffer += page.body;
      console.log(buffer + '\n');
      if (!page.next) return buffer;
      return loadAfter(page.next, true)
        .then(function (next) {
          return buffer + '\n\n' + next;
        });
    });
}

loadAfter(process.argv[2]).done();