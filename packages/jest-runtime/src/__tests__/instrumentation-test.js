/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+jsinfra
 */
'use strict';

jest.mock('vm');

const path = require('path');
const os = require('os');

const FILE_PATH_TO_INSTRUMENT = path.resolve(
  __dirname,
  './module_dir/to-be-instrumented.js',
);

it('instruments files', () => {
  const vm = require('vm');
  const transform = require('../transform');
  const config = {
    cache: false,
    cacheDirectory: os.tmpdir(),
    collectCoverage: true,
    rootDir: '/',
  };
  const instrumented = transform(FILE_PATH_TO_INSTRUMENT, config).script;
  expect(instrumented instanceof vm.Script).toBe(true);
  // We can't really snapshot the resulting coverage, because it depends on
  // absolute path of the file, which will be different on different
  // machines
  expect(vm.Script.mock.calls[0][0]).toMatch(`gcv = '__coverage__'`);
});
