// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import chai from "chai";
const should = chai.should();
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import {
  ServiceBusClient,
  QueueClient,
  TopicClient,
  SubscriptionClient,
  ServiceBusMessage,
  SendableMessageInfo,
  ReceiveMode,
  Sender
} from "../src";

import { DispositionType } from "../src/serviceBusMessage";

import {
  TestMessage,
  getSenderReceiverClients,
  TestClientType,
  purge,
  checkWithTimeout,
  getServiceBusClient
} from "./utils/testUtils";

import { Receiver, SessionReceiver } from "../src/receiver";
import { getErrorMessageNotSupportedInReceiveAndDeleteMode } from "../src/util/errors";

async function testPeekMsgsLength(
  client: QueueClient | SubscriptionClient,
  expectedPeekLength: number
): Promise<void> {
  const peekedMsgs = await client.peek(expectedPeekLength + 1);
  should.equal(
    peekedMsgs.length,
    expectedPeekLength,
    "Unexpected number of msgs found when peeking"
  );
}

let sbClient: ServiceBusClient;

let errorWasThrown: boolean;

let senderClient: QueueClient | TopicClient;
let receiverClient: QueueClient | SubscriptionClient;
let receiver: Receiver | SessionReceiver;
let sender: Sender;

async function beforeEachTest(
  senderType: TestClientType,
  receiverType: TestClientType,
  useSessions?: boolean,
  receiveMode?: ReceiveMode
): Promise<void> {
  sbClient = getServiceBusClient();

  const clients = await getSenderReceiverClients(sbClient, senderType, receiverType);
  senderClient = clients.senderClient;
  receiverClient = clients.receiverClient;

  await purge(receiverClient, useSessions ? TestMessage.sessionId : undefined);
  const peekedMsgs = await receiverClient.peek();
  const receiverEntityType = receiverClient instanceof QueueClient ? "queue" : "topic";
  if (peekedMsgs.length) {
    chai.assert.fail(`Please use an empty ${receiverEntityType} for integration testing`);
  }

  sender = senderClient.createSender();

  if (!receiveMode) {
    receiveMode = ReceiveMode.receiveAndDelete;
  }
  if (useSessions) {
    receiver = receiverClient.createReceiver(receiveMode, {
      sessionId: TestMessage.sessionId
    });
  } else {
    receiver = receiverClient.createReceiver(receiveMode);
  }

  errorWasThrown = false;
}

async function afterEachTest(): Promise<void> {
  await receiver.close();
  await sender.close();
  await sbClient.close();
}

describe("Batch Receiver in ReceiveAndDelete mode", function(): void {
  afterEach(async () => {
    await afterEachTest();
  });

  async function sendReceiveMsg(testMessages: SendableMessageInfo): Promise<void> {
    await sender.send(testMessages);
    const msgs = await receiver.receiveMessages(1);

    should.equal(Array.isArray(msgs), true, "`ReceivedMessages` is not an array");
    should.equal(msgs.length, 1, "Unexpected number of messages");
    should.equal(msgs[0].body, testMessages.body, "MessageBody is different than expected");
    should.equal(msgs[0].messageId, testMessages.messageId, "MessageId is different than expected");
    should.equal(msgs[0].deliveryCount, 0, "DeliveryCount is different than expected");
  }

  async function testNoSettlement(useSessions?: boolean): Promise<void> {
    const testMessages = useSessions ? TestMessage.getSessionSample() : TestMessage.getSample();
    await sendReceiveMsg(testMessages);

    await testPeekMsgsLength(receiverClient, 0);
  }

  it("Partitioned Queue: No settlement of the message removes message #RunInBrowser", async function(): Promise<
    void
  > {
    await beforeEachTest(TestClientType.PartitionedQueue, TestClientType.PartitionedQueue);
    await testNoSettlement();
  });

  it("Partitioned Subscription: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(TestClientType.PartitionedTopic, TestClientType.PartitionedSubscription);
    await testNoSettlement();
  });

  /*it("Unpartitioned Queue: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(ClientType.UnpartitionedQueue, ClientType.UnpartitionedQueue);
    await testNoSettlement();
  });

  it("Unpartitioned Subscription: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(ClientType.UnpartitionedTopic, ClientType.UnpartitionedSubscription);
    await testNoSettlement();
  });*/

  it("Partitioned Queue with Sessions: No settlement of the message removes message #RunInBrowser", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedQueueWithSessions,
      TestClientType.PartitionedQueueWithSessions,
      true
    );
    await testNoSettlement(true);
  });

  it("Partitioned Subscription with Sessions: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedTopicWithSessions,
      TestClientType.PartitionedSubscriptionWithSessions,
      true
    );
    await testNoSettlement(true);
  });

  it("Unpartitioned Queue with Sessions: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedQueueWithSessions,
      TestClientType.UnpartitionedQueueWithSessions,
      true
    );
    await testNoSettlement(true);
  });

  it("Unpartitioned Subscription with Sessions: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedTopicWithSessions,
      TestClientType.UnpartitionedSubscriptionWithSessions,
      true
    );
    await testNoSettlement(true);
  });
});

describe("Streaming Receiver in ReceiveAndDelete mode", function(): void {
  let errorFromErrorHandler: Error | undefined;

  afterEach(async () => {
    await afterEachTest();
  });

  async function sendReceiveMsg(
    testMessages: SendableMessageInfo,
    autoCompleteFlag: boolean
  ): Promise<void> {
    await sender.send(testMessages);
    const receivedMsgs: ServiceBusMessage[] = [];

    receiver.registerMessageHandler(
      (msg: ServiceBusMessage) => {
        receivedMsgs.push(msg);
        return Promise.resolve();
      },
      (err: Error) => {
        if (err) {
          errorFromErrorHandler = err;
        }
      },
      { autoComplete: autoCompleteFlag }
    );

    const msgsCheck = await checkWithTimeout(() => receivedMsgs.length === 1);
    should.equal(msgsCheck, true, "Could not receive the messages in expected time.");

    should.equal(receivedMsgs.length, 1, "Unexpected number of messages");
    should.equal(receivedMsgs[0].body, testMessages.body, "MessageBody is different than expected");
    should.equal(
      receivedMsgs[0].messageId,
      testMessages.messageId,
      "MessageId is different than expected"
    );

    should.equal(
      errorFromErrorHandler,
      undefined,
      errorFromErrorHandler && errorFromErrorHandler.message
    );

    await testPeekMsgsLength(receiverClient, 0);
  }

  async function testNoSettlement(autoCompleteFlag: boolean, useSessions?: boolean): Promise<void> {
    const testMessages = useSessions ? TestMessage.getSessionSample() : TestMessage.getSample();
    await sendReceiveMsg(testMessages, autoCompleteFlag);

    await testPeekMsgsLength(receiverClient, 0);
  }

  it("Partitioned Queue: With auto-complete enabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(TestClientType.PartitionedQueue, TestClientType.PartitionedQueue);
    await testNoSettlement(true);
  });

  it("Partitioned Subscription: With auto-complete enabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(TestClientType.PartitionedTopic, TestClientType.PartitionedSubscription);
    await testNoSettlement(true);
  });

  /* it("Unpartitioned Queue: With auto-complete enabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(ClientType.UnpartitionedQueue, ClientType.UnpartitionedQueue);
    await testNoSettlement(true);
  });

  it("Unpartitioned Subscription: With auto-complete enabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(ClientType.UnpartitionedTopic, ClientType.UnpartitionedSubscription);
    await testNoSettlement(true);
  });*/

  it("Partitioned Queue with Sessions: With auto-complete enabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedQueueWithSessions,
      TestClientType.PartitionedQueueWithSessions,
      true
    );
    await testNoSettlement(true, true);
  });

  it("Partitioned Subscription with Sessions: With auto-complete enabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedTopicWithSessions,
      TestClientType.PartitionedSubscriptionWithSessions,
      true
    );
    await testNoSettlement(true, true);
  });

  it("Unpartitioned Queue with Sessions: With auto-complete enabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedQueueWithSessions,
      TestClientType.UnpartitionedQueueWithSessions,
      true
    );
    await testNoSettlement(true, true);
  });

  it("Unpartitioned Subscription with Sessions: With auto-complete enabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedTopicWithSessions,
      TestClientType.UnpartitionedSubscriptionWithSessions,
      true
    );
    await testNoSettlement(true, true);
  });

  it("Partitioned Queue: With auto-complete disabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(TestClientType.PartitionedQueue, TestClientType.PartitionedQueue);
    await testNoSettlement(false);
  });

  it("Partitioned Subscription: With auto-complete disabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(TestClientType.PartitionedTopic, TestClientType.PartitionedSubscription);
    await testNoSettlement(false);
  });

  /* it("Unpartitioned Queue: With auto-complete disabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(ClientType.UnpartitionedQueue, ClientType.UnpartitionedQueue);
    await testNoSettlement(false);
  });

  it("Unpartitioned Subscription: With auto-complete disabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(ClientType.UnpartitionedTopic, ClientType.UnpartitionedSubscription);
    await testNoSettlement(false);
  });*/

  it("Partitioned Queue with Sessions: With auto-complete disabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedQueueWithSessions,
      TestClientType.PartitionedQueueWithSessions,
      true
    );
    await testNoSettlement(false, true);
  });

  it("Partitioned Subscription with Sessions: With auto-complete disabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedTopicWithSessions,
      TestClientType.PartitionedSubscriptionWithSessions,
      true
    );
    await testNoSettlement(false, true);
  });

  it("Unpartitioned Queue with Sessions: With auto-complete disabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedQueueWithSessions,
      TestClientType.UnpartitionedQueueWithSessions,
      true
    );
    await testNoSettlement(false, true);
  });

  it("Unpartitioned Subscription with Sessions: With auto-complete disabled, no settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedTopicWithSessions,
      TestClientType.UnpartitionedSubscriptionWithSessions,
      true
    );
    await testNoSettlement(false, true);
  });
});

describe("Unsupported features in ReceiveAndDelete mode", function(): void {
  afterEach(async () => {
    await afterEachTest();
  });
  async function sendReceiveMsg(testMessages: SendableMessageInfo): Promise<ServiceBusMessage> {
    await sender.send(testMessages);
    const msgs = await receiver.receiveMessages(1);

    should.equal(Array.isArray(msgs), true, "`ReceivedMessages` is not an array");
    should.equal(msgs.length, 1, "Unexpected number of messages");
    should.equal(msgs[0].body, testMessages.body, "MessageBody is different than expected");
    should.equal(msgs[0].messageId, testMessages.messageId, "MessageId is different than expected");
    should.equal(msgs[0].deliveryCount, 0, "DeliveryCount is different than expected");

    return msgs[0];
  }

  const testError = (err: Error, operation: DispositionType) => {
    should.equal(
      err.message,
      getErrorMessageNotSupportedInReceiveAndDeleteMode(`${operation} the message`),
      "ErrorMessage is different than expected"
    );
    errorWasThrown = true;
  };

  async function testSettlement(operation: DispositionType, useSessions?: boolean): Promise<void> {
    const testMessages = useSessions ? TestMessage.getSessionSample() : TestMessage.getSample();
    const msg = await sendReceiveMsg(testMessages);

    if (operation === DispositionType.complete) {
      await msg.complete().catch((err) => testError(err, operation));
    } else if (operation === DispositionType.abandon) {
      await msg.abandon().catch((err) => testError(err, operation));
    } else if (operation === DispositionType.deadletter) {
      await msg.deadLetter().catch((err) => testError(err, operation));
    } else if (operation === DispositionType.defer) {
      await msg.defer().catch((err) => testError(err, operation));
    }

    should.equal(errorWasThrown, true, "Error thrown flag must be true");

    await testPeekMsgsLength(receiverClient, 0);
  }

  it("Partitioned Queue: complete() throws error", async function(): Promise<void> {
    await beforeEachTest(TestClientType.PartitionedQueue, TestClientType.PartitionedQueue);
    await testSettlement(DispositionType.complete);
  });

  it("Partitioned Subscription: complete() throws error", async function(): Promise<void> {
    await beforeEachTest(TestClientType.PartitionedTopic, TestClientType.PartitionedSubscription);
    await testSettlement(DispositionType.complete);
  });

  /* it("Unpartitioned Queue: complete() throws error", async function(): Promise<void> {
    await beforeEachTest(ClientType.UnpartitionedQueue, ClientType.UnpartitionedQueue);
    await testSettlement(DispositionType.complete);
  });

  it("Unpartitioned Subscription: complete() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(ClientType.UnpartitionedTopic, ClientType.UnpartitionedSubscription);
    await testSettlement(DispositionType.complete);
  });*/

  it("Partitioned Queue with Sessions: complete() throws error #RunInBrowser", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedQueueWithSessions,
      TestClientType.PartitionedQueueWithSessions,
      true
    );
    await testSettlement(DispositionType.complete, true);
  });

  it("Partitioned Subscription with Sessions: complete() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedTopicWithSessions,
      TestClientType.PartitionedSubscriptionWithSessions,
      true
    );
    await testSettlement(DispositionType.complete, true);
  });

  it("Unpartitioned Queue with Sessions: complete() throws error", async function(): Promise<void> {
    await beforeEachTest(
      TestClientType.UnpartitionedQueueWithSessions,
      TestClientType.UnpartitionedQueueWithSessions,
      true
    );
    await testSettlement(DispositionType.complete, true);
  });

  it("Unpartitioned Subscription with Sessions: complete() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedTopicWithSessions,
      TestClientType.UnpartitionedSubscriptionWithSessions,
      true
    );
    await testSettlement(DispositionType.complete, true);
  });

  it("Partitioned Queue: abandon() throws error", async function(): Promise<void> {
    await beforeEachTest(TestClientType.PartitionedQueue, TestClientType.PartitionedQueue);
    await testSettlement(DispositionType.abandon);
  });

  it("Partitioned Subscription: abandon() throws error", async function(): Promise<void> {
    await beforeEachTest(TestClientType.PartitionedTopic, TestClientType.PartitionedSubscription);
    await testSettlement(DispositionType.abandon);
  });

  /* it("Unpartitioned Queue: abandon() throws error", async function(): Promise<void> {
    await beforeEachTest(ClientType.UnpartitionedQueue, ClientType.UnpartitionedQueue);
    await testSettlement(DispositionType.abandon);
  });

  it("Unpartitioned Subscription: abandon() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(ClientType.UnpartitionedTopic, ClientType.UnpartitionedSubscription);
    await testSettlement(DispositionType.abandon);
  });*/

  it("Partitioned Queue with Sessions: abandon() throws error #RunInBrowser", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedQueueWithSessions,
      TestClientType.PartitionedQueueWithSessions,
      true
    );
    await testSettlement(DispositionType.abandon, true);
  });

  it("Partitioned Subscription with Sessions: abandon() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedTopicWithSessions,
      TestClientType.PartitionedSubscriptionWithSessions,
      true
    );
    await testSettlement(DispositionType.abandon, true);
  });

  it("Unpartitioned Queue with Sessions: abandon() throws error", async function(): Promise<void> {
    await beforeEachTest(
      TestClientType.UnpartitionedQueueWithSessions,
      TestClientType.UnpartitionedQueueWithSessions,
      true
    );
    await testSettlement(DispositionType.abandon, true);
  });

  it("Unpartitioned Subscription with Sessions: abandon() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedTopicWithSessions,
      TestClientType.UnpartitionedSubscriptionWithSessions,
      true
    );
    await testSettlement(DispositionType.abandon, true);
  });

  it("Partitioned Queue: defer() throws error", async function(): Promise<void> {
    await beforeEachTest(TestClientType.PartitionedQueue, TestClientType.PartitionedQueue);
    await testSettlement(DispositionType.defer);
  });

  it("Partitioned Subscription: defer() throws error", async function(): Promise<void> {
    await beforeEachTest(TestClientType.PartitionedTopic, TestClientType.PartitionedSubscription);
    await testSettlement(DispositionType.defer);
  });

  /* it("Unpartitioned Queue: defer() throws error", async function(): Promise<void> {
    await beforeEachTest(ClientType.UnpartitionedQueue, ClientType.UnpartitionedQueue);
    await testSettlement(DispositionType.defer);
  });

  it("Unpartitioned Subscription: defer() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(ClientType.UnpartitionedTopic, ClientType.UnpartitionedSubscription);
    await testSettlement(DispositionType.defer);
  });*/

  it("Partitioned Queue with Sessions: defer() throws error #RunInBrowser", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedQueueWithSessions,
      TestClientType.PartitionedQueueWithSessions,
      true
    );
    await testSettlement(DispositionType.defer, true);
  });

  it("Partitioned Subscription with Sessions: defer() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedTopicWithSessions,
      TestClientType.PartitionedSubscriptionWithSessions,
      true
    );
    await testSettlement(DispositionType.defer, true);
  });

  it("Unpartitioned Queue with Sessions: defer() throws error", async function(): Promise<void> {
    await beforeEachTest(
      TestClientType.UnpartitionedQueueWithSessions,
      TestClientType.UnpartitionedQueueWithSessions,
      true
    );
    await testSettlement(DispositionType.defer, true);
  });

  it("Unpartitioned Subscription with Sessions: defer() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedTopicWithSessions,
      TestClientType.UnpartitionedSubscriptionWithSessions,
      true
    );
    await testSettlement(DispositionType.defer, true);
  });

  it("Partitioned Queue: deadLetter() throws error", async function(): Promise<void> {
    await beforeEachTest(TestClientType.PartitionedQueue, TestClientType.PartitionedQueue);
    await testSettlement(DispositionType.deadletter);
  });

  it("Partitioned Subscription: deadLetter() throws error", async function(): Promise<void> {
    await beforeEachTest(TestClientType.PartitionedTopic, TestClientType.PartitionedSubscription);
    await testSettlement(DispositionType.deadletter);
  });

  /* it("Unpartitioned Queue: deadLetter() throws error", async function(): Promise<void> {
    await beforeEachTest(ClientType.UnpartitionedQueue, ClientType.UnpartitionedQueue);
    await testSettlement(DispositionType.deadletter);
  });

  it("Unpartitioned Subscription: deadLetter() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(ClientType.UnpartitionedTopic, ClientType.UnpartitionedSubscription);
    await testSettlement(DispositionType.deadletter);
  });*/

  it("Partitioned Queue with Sessions: deadLetter() throws error #RunInBrowser", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedQueueWithSessions,
      TestClientType.PartitionedQueueWithSessions,
      true
    );
    await testSettlement(DispositionType.deadletter, true);
  });

  it("Partitioned Subscription with Sessions: deadLetter() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedTopicWithSessions,
      TestClientType.PartitionedSubscriptionWithSessions,
      true
    );
    await testSettlement(DispositionType.deadletter, true);
  });

  it("Unpartitioned Queue with Sessions: deadLetter() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedQueueWithSessions,
      TestClientType.UnpartitionedQueueWithSessions,
      true
    );
    await testSettlement(DispositionType.deadletter, true);
  });

  it("Unpartitioned Subscription with Sessions: deadLetter() throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedTopicWithSessions,
      TestClientType.UnpartitionedSubscriptionWithSessions,
      true
    );
    await testSettlement(DispositionType.deadletter, true);
  });

  async function testRenewLock(): Promise<void> {
    const msg = await sendReceiveMsg(TestMessage.getSample());

    await (<Receiver>receiver).renewMessageLock(msg).catch((err) => {
      should.equal(
        err.message,
        getErrorMessageNotSupportedInReceiveAndDeleteMode("renew the message lock"),
        "ErrorMessage is different than expected"
      );
      errorWasThrown = true;
    });

    should.equal(errorWasThrown, true, "Error thrown flag must be true");
  }

  it("Partitioned Queue: Renew message lock throws error #RunInBrowser", async function(): Promise<
    void
  > {
    await beforeEachTest(TestClientType.PartitionedQueue, TestClientType.PartitionedQueue);
    await testRenewLock();
  });

  it("Partitioned Subscription: Renew message lock throws error", async function(): Promise<void> {
    await beforeEachTest(TestClientType.PartitionedTopic, TestClientType.PartitionedSubscription);
    await testRenewLock();
  });

  /* it("Unpartitioned Queue: Renew message lock throws error", async function(): Promise<void> {
    await beforeEachTest(ClientType.UnpartitionedQueue, ClientType.UnpartitionedQueue);
    await testRenewLock();
  });

  it("Unpartitioned Subscription: Renew message lock throws error", async function(): Promise<
    void
  > {
    await beforeEachTest(ClientType.UnpartitionedTopic, ClientType.UnpartitionedSubscription);
    await testRenewLock();
  });*/
});

describe("Receive Deferred messages in ReceiveAndDelete mode", function(): void {
  let sequenceNumber: Long;

  afterEach(async () => {
    await afterEachTest();
  });
  async function deferMessage(useSessions?: boolean): Promise<void> {
    const testMessages = useSessions ? TestMessage.getSessionSample() : TestMessage.getSample();
    await sender.send(testMessages);
    const msgs = await receiver.receiveMessages(1);

    should.equal(Array.isArray(msgs), true, "`ReceivedMessages` is not an array");
    should.equal(msgs.length, 1, "Unexpected number of messages");
    should.equal(msgs[0].body, testMessages.body, "MessageBody is different than expected");
    should.equal(msgs[0].messageId, testMessages.messageId, "MessageId is different than expected");
    should.equal(msgs[0].deliveryCount, 0, "DeliveryCount is different than expected");

    sequenceNumber = msgs[0].sequenceNumber!;
    await msgs[0].defer();
  }

  async function receiveDeferredMessage(): Promise<void> {
    let deferredMsgs: ServiceBusMessage | undefined;

    deferredMsgs = await receiver.receiveDeferredMessage(sequenceNumber);
    if (!deferredMsgs) {
      throw `No message received for sequence number ${sequenceNumber}`;
    }

    should.equal(deferredMsgs!.deliveryCount, 1, "DeliveryCount is different than expected");
    await testPeekMsgsLength(receiverClient, 0);
  }

  /* it("Partitioned Queue: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedQueue,
      TestClientType.PartitionedQueue,
      undefined,
      ReceiveMode.peekLock
    );
    await deferMessage();
    await receiver.close();
    receiver = receiverClient.createReceiver(ReceiveMode.receiveAndDelete);
    await receiveDeferredMessage();
  });

  it("Partitioned Subscription: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedTopic,
      TestClientType.PartitionedSubscription,
      undefined,
      ReceiveMode.peekLock
    );
    await deferMessage();
    await receiver.close();
    receiver = receiverClient.createReceiver(ReceiveMode.receiveAndDelete);
    await receiveDeferredMessage();
  }); */

  it("Unpartitioned Queue: No settlement of the message removes message #RunInBrowser", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedQueue,
      TestClientType.UnpartitionedQueue,
      undefined,
      ReceiveMode.peekLock
    );
    await deferMessage();
    await receiver.close();
    receiver = receiverClient.createReceiver(ReceiveMode.receiveAndDelete);
    await receiveDeferredMessage();
  });

  it("Unpartitioned Subscription: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedTopic,
      TestClientType.UnpartitionedSubscription,
      undefined,
      ReceiveMode.peekLock
    );
    await deferMessage();
    await receiver.close();
    receiver = receiverClient.createReceiver(ReceiveMode.receiveAndDelete);
    await receiveDeferredMessage();
  });

  it("Partitioned Queue with Sessions: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedQueueWithSessions,
      TestClientType.PartitionedQueueWithSessions,
      true,
      ReceiveMode.peekLock
    );
    await deferMessage(true);
    await receiver.close();
    receiver = receiverClient.createReceiver(ReceiveMode.receiveAndDelete, {
      sessionId: TestMessage.sessionId
    });
    await receiveDeferredMessage();
  });

  it("Partitioned Subscription with Sessions: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.PartitionedTopicWithSessions,
      TestClientType.PartitionedSubscriptionWithSessions,
      true,
      ReceiveMode.peekLock
    );
    await deferMessage(true);
    await receiver.close();
    receiver = receiverClient.createReceiver(ReceiveMode.receiveAndDelete, {
      sessionId: TestMessage.sessionId
    });
    await receiveDeferredMessage();
  });

  it("Unpartitioned Queue with Sessions: No settlement of the message removes message #RunInBrowser", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedQueueWithSessions,
      TestClientType.UnpartitionedQueueWithSessions,
      true,
      ReceiveMode.peekLock
    );
    await deferMessage(true);
    await receiver.close();
    receiver = receiverClient.createReceiver(ReceiveMode.receiveAndDelete, {
      sessionId: TestMessage.sessionId
    });
    await receiveDeferredMessage();
  });

  it("Unpartitioned Subscription with Sessions: No settlement of the message removes message", async function(): Promise<
    void
  > {
    await beforeEachTest(
      TestClientType.UnpartitionedTopicWithSessions,
      TestClientType.UnpartitionedSubscriptionWithSessions,
      true,
      ReceiveMode.peekLock
    );
    await deferMessage(true);
    await receiver.close();
    receiver = receiverClient.createReceiver(ReceiveMode.receiveAndDelete, {
      sessionId: TestMessage.sessionId
    });
    await receiveDeferredMessage();
  });
});
