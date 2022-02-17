// required module
import fs from 'fs';
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
// read the file content
const str = fs.readFileSync('tests/test.md', 'utf8');

// split
let arr = str.split('###');

// save items as new files
arr.forEach(async (data, idx) => {
  // write to file
  let document = documentToPlainTextString(await richTextFromMarkdown(data));
  fs.writeFileSync(`dir/${idx + 1}.rtf`, document);
  fs.writeFileSync(`dir/${idx + 1}.md`, data);
});
