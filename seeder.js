import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import sys from 'sys';
import Question from './models/questionModel.js';

dotenv.config();

connectDB();

(async () => {
  fs.readdir('./dir', function (err, files) {
    if (err) {
      console.error('Could not list the directory.', err);
      process.exit(1);
    }
    files = files.filter((file) => {
      return path.extname(file).toLowerCase() === '.html';
    });
    for (const file of files) {
      fs.readFile('./dir/' + file, (error, data) => {
        if (error) {
          throw error;
        }

        const dom = new JSDOM(data);
        const domElements = Array.prototype.slice.call(
          dom.window.document.querySelector('body').childNodes
        );

        let i = 0;
        let correctOption = 0;
        const checkboxes = Array.prototype.slice.call(
          dom.window.document.querySelectorAll('input')
        );

        for (const check of checkboxes) {
          if (check.checked) {
            correctOption = i;
          }
          i++;
          check.remove();
        }

        i = 0;
        let lastIndex = 0;

        let parts = [];
        for (const input of domElements) {
          if (input.tagName === 'HR') {
            const domElementsSliced = domElements.slice(lastIndex, i);
            parts.push(domElementsSliced);
            lastIndex = i + 1;
          }
          i++;
        }
        parts.push(domElements.slice(lastIndex, i));
        parts = parts.map((part) => {
          return part.map((subpart) => subpart.outerHTML).join('');
        });
        (async function (correctOption, command, options) {
          await Question.create({ correctOption, command, options });
        })(correctOption, parts[0], parts.slice(1));
      });
    }
  });
})();
