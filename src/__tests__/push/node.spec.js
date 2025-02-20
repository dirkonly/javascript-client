import tape from 'tape-catch';
import fetchMock from '../testUtils/fetchMock';
import { testAuthWithPushDisabled, testAuthWith401, testAuthWith400, testNoEventSource, testSSEWithNonRetryableError } from '../nodeSuites/push-initialization-nopush.spec';
import { testPushRetriesDueToAuthErrors, testPushRetriesDueToSseErrors, testSdkDestroyWhileAuthRetries, testSdkDestroyWhileAuthSuccess } from '../nodeSuites/push-initialization-retries.spec';
import { testSynchronization } from '../nodeSuites/push-synchronization.spec';
import { testSynchronizationRetries } from '../nodeSuites/push-synchronization-retries.spec';
import { testFallbacking } from '../nodeSuites/push-fallbacking.spec';
import { testRefreshToken } from '../nodeSuites/push-refresh-token.spec';

fetchMock.config.overwriteRoutes = false;

tape('## Node JS - E2E CI Tests for PUSH ##', async function (assert) {

  // Non-recoverable issues on inizialization
  assert.test('E2E / PUSH initialization: auth with push disabled', testAuthWithPushDisabled.bind(null, fetchMock));
  assert.test('E2E / PUSH initialization: auth with 401', testAuthWith401.bind(null, fetchMock));
  assert.test('E2E / PUSH initialization: auth with 400', testAuthWith400.bind(null, fetchMock));
  assert.test('E2E / PUSH initialization: fallback to polling if EventSource is not available', testNoEventSource.bind(null, fetchMock));
  assert.test('E2E / PUSH initialization: sse with non-recoverable Ably error', testSSEWithNonRetryableError.bind(null, fetchMock));

  // Recoverable issues on inizialization
  assert.test('E2E / PUSH initialization: auth failures and then success', testPushRetriesDueToAuthErrors.bind(null, fetchMock));
  assert.test('E2E / PUSH initialization: SSE connection failures and then success', testPushRetriesDueToSseErrors.bind(null, fetchMock));

  // Graceful shutdown
  assert.test('E2E / PUSH disconnection: SDK destroyed while authenticating', testSdkDestroyWhileAuthSuccess.bind(null, fetchMock));
  assert.test('E2E / PUSH disconnection: SDK destroyed while auth was retrying', testSdkDestroyWhileAuthRetries.bind(null, fetchMock));

  assert.test('E2E / PUSH synchronization: happy paths', testSynchronization.bind(null, fetchMock));
  assert.test('E2E / PUSH synchronization: retries', testSynchronizationRetries.bind(null, fetchMock));

  assert.test('E2E / PUSH fallbacking, CONTROL and OCCUPANCY messages', testFallbacking.bind(null, fetchMock));

  assert.test('E2E / PUSH refresh token and connection delay', testRefreshToken.bind(null, fetchMock));

  assert.end();
});
