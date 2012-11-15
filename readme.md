# ES-Discuss

ES-Discuss is the mailing list where the future of JavaScript is discussed and agreed upon.  Unfortunately the threads are not nicely formatted or easy to read.  This project aims to group all the messages from each thread into one, nice, cleanly formatted markdown document.

## Contribute

To contribute, start by forking the repository and deciding on a thread to generate.  Runt the following command:

    $ npm install q request
    $ node generate https://mail.mozilla.org/pipermail/es-discuss/2012-November/026188.html > promises.md
 
Note that this will over-write any existing changes, so if you want to extend an existing thread, use the latest message in the thread as the url, and output to a temporary file, then manually attach the two.

Once you have done that, you'll have a big markdown file.  You'll then need to manually go through and edit/format the markdown so links are properly referenced, code samples get syntax highlighted as JavaScript, and people don't include complete copies of previous messages.

Submit a pull request so everyone can see your great work.

Wherever possible I will aim to maintain the meaning of what was said, but I may change formatting, and remove duplicated content (such as quoting the entirety of the previous message).  If you feel one of the documents mis-represents what you originally said, submit a pull request to correct the statements.