/**
Copyright 2016 Split Software

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
import tape from 'tape-catch';
import { matcherTypes } from '../../../matchers/types';
import matcherFactory from '../../../matchers';

tape('MATCHER SEGMENT / should return true ONLY when the key is defined inside the segment', async function (assert) {
  const segment = 'employees';

  const matcher = matcherFactory({
    type: matcherTypes.IN_SEGMENT,
    value: segment
  }, {
    segments: {
      isInSegment(segmentName, key) {
        return key === 'key';
      }
    }
  });

  assert.true(await matcher('key'), '"key" should be true');
  assert.false(await matcher('another_key'), '"another key" should be false');
  assert.end();
});