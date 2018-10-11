/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as msRest from "ms-rest-js";
import * as Models from "../models";
import * as Mappers from "../models/jobStreamOperationsMappers";
import * as Parameters from "../models/parameters";
import { AutomationClientContext } from "../automationClientContext";

/** Class representing a JobStreamOperations. */
export class JobStreamOperations {
  private readonly client: AutomationClientContext;

  /**
   * Create a JobStreamOperations.
   * @param {AutomationClientContext} client Reference to the service client.
   */
  constructor(client: AutomationClientContext) {
    this.client = client;
  }

  /**
   * Retrieve the job stream identified by job stream id.
   * @param resourceGroupName Name of an Azure Resource group.
   * @param automationAccountName The name of the automation account.
   * @param jobName The job name.
   * @param jobStreamId The job stream id.
   * @param [options] The optional parameters
   * @returns Promise<Models.JobStreamGetResponse>
   */
  get(resourceGroupName: string, automationAccountName: string, jobName: string, jobStreamId: string, options?: Models.JobStreamGetOptionalParams): Promise<Models.JobStreamGetResponse>;
  /**
   * @param resourceGroupName Name of an Azure Resource group.
   * @param automationAccountName The name of the automation account.
   * @param jobName The job name.
   * @param jobStreamId The job stream id.
   * @param callback The callback
   */
  get(resourceGroupName: string, automationAccountName: string, jobName: string, jobStreamId: string, callback: msRest.ServiceCallback<Models.JobStream>): void;
  /**
   * @param resourceGroupName Name of an Azure Resource group.
   * @param automationAccountName The name of the automation account.
   * @param jobName The job name.
   * @param jobStreamId The job stream id.
   * @param options The optional parameters
   * @param callback The callback
   */
  get(resourceGroupName: string, automationAccountName: string, jobName: string, jobStreamId: string, options: Models.JobStreamGetOptionalParams, callback: msRest.ServiceCallback<Models.JobStream>): void;
  get(resourceGroupName: string, automationAccountName: string, jobName: string, jobStreamId: string, options?: Models.JobStreamGetOptionalParams, callback?: msRest.ServiceCallback<Models.JobStream>): Promise<Models.JobStreamGetResponse> {
    return this.client.sendOperationRequest(
      {
        resourceGroupName,
        automationAccountName,
        jobName,
        jobStreamId,
        options
      },
      getOperationSpec,
      callback) as Promise<Models.JobStreamGetResponse>;
  }

  /**
   * Retrieve a list of jobs streams identified by job name.
   * @param resourceGroupName Name of an Azure Resource group.
   * @param automationAccountName The name of the automation account.
   * @param jobName The job name.
   * @param [options] The optional parameters
   * @returns Promise<Models.JobStreamListByJobResponse>
   */
  listByJob(resourceGroupName: string, automationAccountName: string, jobName: string, options?: Models.JobStreamListByJobOptionalParams): Promise<Models.JobStreamListByJobResponse>;
  /**
   * @param resourceGroupName Name of an Azure Resource group.
   * @param automationAccountName The name of the automation account.
   * @param jobName The job name.
   * @param callback The callback
   */
  listByJob(resourceGroupName: string, automationAccountName: string, jobName: string, callback: msRest.ServiceCallback<Models.JobStreamListResult>): void;
  /**
   * @param resourceGroupName Name of an Azure Resource group.
   * @param automationAccountName The name of the automation account.
   * @param jobName The job name.
   * @param options The optional parameters
   * @param callback The callback
   */
  listByJob(resourceGroupName: string, automationAccountName: string, jobName: string, options: Models.JobStreamListByJobOptionalParams, callback: msRest.ServiceCallback<Models.JobStreamListResult>): void;
  listByJob(resourceGroupName: string, automationAccountName: string, jobName: string, options?: Models.JobStreamListByJobOptionalParams, callback?: msRest.ServiceCallback<Models.JobStreamListResult>): Promise<Models.JobStreamListByJobResponse> {
    return this.client.sendOperationRequest(
      {
        resourceGroupName,
        automationAccountName,
        jobName,
        options
      },
      listByJobOperationSpec,
      callback) as Promise<Models.JobStreamListByJobResponse>;
  }

  /**
   * Retrieve a list of jobs streams identified by job name.
   * @param nextPageLink The NextLink from the previous successful call to List operation.
   * @param [options] The optional parameters
   * @returns Promise<Models.JobStreamListByJobNextResponse>
   */
  listByJobNext(nextPageLink: string, options?: Models.JobStreamListByJobNextOptionalParams): Promise<Models.JobStreamListByJobNextResponse>;
  /**
   * @param nextPageLink The NextLink from the previous successful call to List operation.
   * @param callback The callback
   */
  listByJobNext(nextPageLink: string, callback: msRest.ServiceCallback<Models.JobStreamListResult>): void;
  /**
   * @param nextPageLink The NextLink from the previous successful call to List operation.
   * @param options The optional parameters
   * @param callback The callback
   */
  listByJobNext(nextPageLink: string, options: Models.JobStreamListByJobNextOptionalParams, callback: msRest.ServiceCallback<Models.JobStreamListResult>): void;
  listByJobNext(nextPageLink: string, options?: Models.JobStreamListByJobNextOptionalParams, callback?: msRest.ServiceCallback<Models.JobStreamListResult>): Promise<Models.JobStreamListByJobNextResponse> {
    return this.client.sendOperationRequest(
      {
        nextPageLink,
        options
      },
      listByJobNextOperationSpec,
      callback) as Promise<Models.JobStreamListByJobNextResponse>;
  }
}

// Operation Specifications
const serializer = new msRest.Serializer(Mappers);
const getOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Automation/automationAccounts/{automationAccountName}/jobs/{jobName}/streams/{jobStreamId}",
  urlParameters: [
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.automationAccountName,
    Parameters.jobName,
    Parameters.jobStreamId
  ],
  queryParameters: [
    Parameters.apiVersion1
  ],
  headerParameters: [
    Parameters.clientRequestId,
    Parameters.acceptLanguage
  ],
  responses: {
    200: {
      bodyMapper: Mappers.JobStream
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const listByJobOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  path: "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Automation/automationAccounts/{automationAccountName}/jobs/{jobName}/streams",
  urlParameters: [
    Parameters.resourceGroupName,
    Parameters.automationAccountName,
    Parameters.jobName,
    Parameters.subscriptionId
  ],
  queryParameters: [
    Parameters.filter,
    Parameters.apiVersion1
  ],
  headerParameters: [
    Parameters.clientRequestId,
    Parameters.acceptLanguage
  ],
  responses: {
    200: {
      bodyMapper: Mappers.JobStreamListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const listByJobNextOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  baseUrl: "https://management.azure.com",
  path: "{nextLink}",
  urlParameters: [
    Parameters.nextPageLink
  ],
  headerParameters: [
    Parameters.clientRequestId,
    Parameters.acceptLanguage
  ],
  responses: {
    200: {
      bodyMapper: Mappers.JobStreamListResult
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};