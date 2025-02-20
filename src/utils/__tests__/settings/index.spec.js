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
import _ from 'lodash';
import tape from 'tape-catch';
import SettingsFactory from '../../settings';
import { OPTIMIZED, DEBUG } from '../../constants';
import language from '../../settings/language';
import packageJson from '../../../../package.json';

tape('SETTINGS / check defaults', assert => {
  const settings = SettingsFactory({
    core: {
      authorizationKey: 'dummy token'
    }
  });

  assert.deepEqual(settings.urls, {
    sdk: 'https://sdk.split.io/api',
    events: 'https://events.split.io/api',
    auth: 'https://auth.split.io/api',
    streaming: 'https://streaming.split.io',
  });
  assert.equal(settings.sync.impressionsMode, OPTIMIZED);
  assert.equal(settings.version, `${language}-${packageJson.version}`);
  assert.true(packageJson.version.length <= 16, 'SDK version must not exceed 16 chars length');
  assert.end();
});

tape('SETTINGS / override with defaults', assert => {
  const settings = SettingsFactory({
    core: {
      authorizationKey: 'dummy token'
    },
    sync: {
      impressionsMode: 'some',
    }
  });

  assert.equal(settings.sync.impressionsMode, OPTIMIZED);
  assert.end();
});

tape('SETTINGS / impressionsMode should be configurable', assert => {
  const settings = SettingsFactory({
    core: {
      authorizationKey: 'dummy token'
    },
    sync: {
      impressionsMode: DEBUG
    }
  });

  assert.deepEqual(settings.sync.impressionsMode, DEBUG);
  assert.end();
});

tape('SETTINGS / key and traffic type should be overwritable', assert => {
  const settings = SettingsFactory({
    core: {
      authorizationKey: 'dummy token',
      key: 'start_key'
    }
  });

  assert.equal(settings.core.key, 'start_key', 'When creating a setting instance, it will have the provided value for key');
  assert.equal(settings.core.trafficType, undefined, 'and if no traffic type was provided, it will be undefined.');

  const settings2 = settings.overrideKeyAndTT('second_key');

  assert.notEqual(settings, settings2, 'If we call overrideKeyAndTT we get a new settings instance');
  assert.equal(settings2.core.key, 'second_key', 'with the key overriden by the value passed to it.');
  assert.equal(settings2.core.trafficType, undefined, 'As no traffic type was provided, it will still be undefined.');

  assert.deepEqual({
    ...settings,
    core: {
      ...settings.core,
      key: 'second_key',
      trafficType: undefined
    }
  }, settings2, 'Of course, the new instance should match with the origin settings on every property but the overriden key.');

  const settings3 = settings.overrideKeyAndTT('third_key', 'myTT');

  assert.equal(settings3.core.key, 'third_key', 'If we call overrideKeyAndTT with both key and traffic type, new instance has key overriden as before');
  assert.equal(settings3.core.trafficType, 'myTT', 'and as we provided a traffic type, we have that traffic type now.');

  assert.deepEqual({
    ...settings,
    core: {
      ...settings.core,
      key: 'third_key',
      trafficType: 'myTT'
    }
  }, settings3, 'Of course, the new instance should match with the origin settings on every property but the overriden key and trafficType.');

  const settings4 = settings3.overrideKeyAndTT('fourth_key');

  assert.equal(settings4.core.key, 'fourth_key', 'If we call overrideKeyAndTT with only key and NO traffic type, new instance has key overriden as before');
  assert.equal(settings4.core.trafficType, undefined, 'but traffic type should be blanked. (new key may be different tt)');

  assert.deepEqual({
    ...settings3,
    core: {
      ...settings3.core,
      key: 'fourth_key',
      trafficType: undefined
    }
  }, settings4, 'Of course, the new instance should match with the origin settings on every property but the overriden key and trafficType.');

  assert.end();
});

tape('SETTINGS / urls should be configurable', assert => {
  const urls = {
    sdk: 'sdk-url',
    events: 'events-url',
    auth: 'auth-url',
    streaming: 'streaming-url',
  };

  const settings = SettingsFactory({
    core: {
      authorizationKey: 'dummy token'
    },
    urls
  });

  assert.deepEqual(settings.urls, urls);
  assert.end();
});

tape('SETTINGS / required properties should be always present', assert => {
  const locatorAuthorizationKey = _.property('core.authorizationKey');

  const locatorSchedulerFeaturesRefreshRate = _.property('scheduler.featuresRefreshRate');
  const locatorSchedulerSegmentsRefreshRate = _.property('scheduler.segmentsRefreshRate');
  const locatorSchedulerMetricsRefreshRate = _.property('scheduler.metricsRefreshRate');
  const locatorSchedulerImpressionsRefreshRate = _.property('scheduler.impressionsRefreshRate');

  const locatorUrlsSDK = _.property('urls.sdk');
  const locatorUrlsEvents = _.property('urls.events');

  const locatorStartupRequestTimeoutBeforeReady = _.property('startup.requestTimeoutBeforeReady');
  const locatorStartupRetriesOnFailureBeforeReady = _.property('startup.retriesOnFailureBeforeReady');
  const locatorStartupReadyTimeout = _.property('startup.readyTimeout');

  const settings = SettingsFactory({
    core: {
      authorizationKey: 'dummy token'
    },
    scheduler: {
      featuresRefreshRate: undefined,
      segmentsRefreshRate: undefined,
      metricsRefreshRate: undefined,
      impressionsRefreshRate: undefined
    },
    urls: {
      sdk: undefined,
      events: undefined
    },
    startup: {
      requestTimeoutBeforeReady: undefined,
      retriesOnFailureBeforeReady: undefined,
      readyTimeout: undefined
    }
  });

  assert.ok(locatorAuthorizationKey(settings) !== undefined, 'authorizationKey should be present');

  assert.ok(locatorSchedulerFeaturesRefreshRate(settings) !== undefined, 'scheduler.featuresRefreshRate should be present');
  assert.ok(locatorSchedulerSegmentsRefreshRate(settings) !== undefined, 'scheduler.segmentsRefreshRate should be present');
  assert.equal(locatorSchedulerMetricsRefreshRate(settings), 120 * 1000, 'scheduler.metricsRefreshRate should be present');
  assert.ok(locatorSchedulerImpressionsRefreshRate(settings) !== undefined, 'scheduler.impressionsRefreshRate should be present');

  assert.ok(locatorUrlsSDK(settings) !== undefined, 'urls.sdk should be present');
  assert.ok(locatorUrlsEvents(settings) !== undefined, 'urls.events should be present');

  assert.ok(locatorStartupRequestTimeoutBeforeReady(settings) !== undefined, 'startup.requestTimeoutBeforeReady should be present');
  assert.ok(locatorStartupRetriesOnFailureBeforeReady(settings) !== undefined, 'startup.retriesOnFailureBeforeReady should be present');
  assert.ok(locatorStartupReadyTimeout(settings) !== undefined, 'startup.readyTimeout should be present');

  assert.end();
});

tape('SETTINGS / urls should be correctly assigned', assert => {
  const settings = SettingsFactory({
    core: {
      authorizationKey: 'dummy token'
    }
  });
  const baseSdkUrl = 'https://sdk.split.io/api';
  const baseEventsUrl = 'https://events.split.io/api';

  [
    '/mySegments/nico',
    '/mySegments/events@split',
    '/mySegments/metrics@split',
    '/mySegments/testImpressions@split',
    '/mySegments/testImpressions',
    '/mySegments/events',
    '/mySegments/metrics',
    '/splitChanges?since=-1',
    '/splitChanges?since=100',
    '/segmentChanges/segment1?since=100',
    '/segmentChanges/events?since=100',
    '/segmentChanges/beacon?since=100',
    '/segmentChanges/metrics?since=100',
    '/segmentChanges/testImpressions?since=100'
  ].forEach(relativeUrl => {
    assert.equal(settings.url(relativeUrl), `${baseSdkUrl}${relativeUrl}`, `Our settings URL function should use ${baseSdkUrl} as base for ${relativeUrl}`);
  });

  [
    '/metrics/times',
    '/metrics/counters',
    '/events/bulk',
    '/events/beacon',
    '/testImpressions/bulk',
    '/testImpressions/beacon',
    '/testImpressions/count/beacon'
  ].forEach(relativeUrl => {
    assert.equal(settings.url(relativeUrl), `${baseEventsUrl}${relativeUrl}`, `Our settings URL function should use ${baseEventsUrl} as base for ${relativeUrl}`);
  });

  assert.end();
});
