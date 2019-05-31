/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as msRest from "@azure/ms-rest-js";
import * as Models from "../models";
import * as Mappers from "../models/endpointSettingsMappers";
import * as Parameters from "../models/parameters";
import { QnAMakerClientContext } from "../qnAMakerClientContext";

/** Class representing a EndpointSettings. */
export class EndpointSettings {
  private readonly client: QnAMakerClientContext;

  /**
   * Create a EndpointSettings.
   * @param {QnAMakerClientContext} client Reference to the service client.
   */
  constructor(client: QnAMakerClientContext) {
    this.client = client;
  }

  /**
   * @summary Gets endpoint settings for an endpoint.
   * @param [options] The optional parameters
   * @returns Promise<Models.EndpointSettingsGetSettingsResponse>
   */
  getSettings(options?: msRest.RequestOptionsBase): Promise<Models.EndpointSettingsGetSettingsResponse>;
  /**
   * @param callback The callback
   */
  getSettings(callback: msRest.ServiceCallback<Models.EndpointSettingsDTO>): void;
  /**
   * @param options The optional parameters
   * @param callback The callback
   */
  getSettings(options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<Models.EndpointSettingsDTO>): void;
  getSettings(options?: msRest.RequestOptionsBase | msRest.ServiceCallback<Models.EndpointSettingsDTO>, callback?: msRest.ServiceCallback<Models.EndpointSettingsDTO>): Promise<Models.EndpointSettingsGetSettingsResponse> {
    return this.client.sendOperationRequest(
      {
        options
      },
      getSettingsOperationSpec,
      callback) as Promise<Models.EndpointSettingsGetSettingsResponse>;
  }

  /**
   * @summary Updates endpoint settings for an endpoint.
   * @param endpointSettingsPayload Post body of the request.
   * @param [options] The optional parameters
   * @returns Promise<Models.EndpointSettingsUpdateSettingsResponse>
   */
  updateSettings(endpointSettingsPayload: Models.EndpointSettingsDTO, options?: msRest.RequestOptionsBase): Promise<Models.EndpointSettingsUpdateSettingsResponse>;
  /**
   * @param endpointSettingsPayload Post body of the request.
   * @param callback The callback
   */
  updateSettings(endpointSettingsPayload: Models.EndpointSettingsDTO, callback: msRest.ServiceCallback<string>): void;
  /**
   * @param endpointSettingsPayload Post body of the request.
   * @param options The optional parameters
   * @param callback The callback
   */
  updateSettings(endpointSettingsPayload: Models.EndpointSettingsDTO, options: msRest.RequestOptionsBase, callback: msRest.ServiceCallback<string>): void;
  updateSettings(endpointSettingsPayload: Models.EndpointSettingsDTO, options?: msRest.RequestOptionsBase | msRest.ServiceCallback<string>, callback?: msRest.ServiceCallback<string>): Promise<Models.EndpointSettingsUpdateSettingsResponse> {
    return this.client.sendOperationRequest(
      {
        endpointSettingsPayload,
        options
      },
      updateSettingsOperationSpec,
      callback) as Promise<Models.EndpointSettingsUpdateSettingsResponse>;
  }
}

// Operation Specifications
const serializer = new msRest.Serializer(Mappers);
const getSettingsOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  path: "endpointsettings",
  urlParameters: [
    Parameters.endpoint
  ],
  responses: {
    200: {
      bodyMapper: Mappers.EndpointSettingsDTO
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};

const updateSettingsOperationSpec: msRest.OperationSpec = {
  httpMethod: "PATCH",
  path: "endpointsettings",
  urlParameters: [
    Parameters.endpoint
  ],
  requestBody: {
    parameterPath: "endpointSettingsPayload",
    mapper: {
      ...Mappers.EndpointSettingsDTO,
      required: true
    }
  },
  responses: {
    200: {
      bodyMapper: {
        serializedName: "parsedResponse",
        type: {
          name: "String"
        }
      }
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  serializer
};
