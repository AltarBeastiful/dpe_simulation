#!/bin/env bun

import * as fs from 'fs';

import { calcul_3cl } from '@open3cl/engine';

const args = process.argv.slice(2);
const dpe_json_file = args[0];
fs.readFile(dpe_json_file, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  // json parse data
  const dpe_in = JSON.parse(data);

  if (dpe_in === undefined) {
    console.warn('DPE vide');
    return null;
  }

  // don't clean, so we can compare with the original dpe
  const dpe_out = calcul_3cl(dpe_in, { sanitize: false });
  // json dump dpe_out on stdout
  console.log(JSON.stringify(dpe_out, null, 2));
});
