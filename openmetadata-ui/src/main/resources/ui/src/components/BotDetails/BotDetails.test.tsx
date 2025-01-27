/*
 *  Copyright 2021 Collate
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { findByTestId, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { OperationPermission } from '../PermissionProvider/PermissionProvider.interface';
import BotDetails from './BotDetails.component';

const revokeTokenHandler = jest.fn();
const updateBotsDetails = jest.fn();

const botsData = {
  id: 'ea09aed1-0251-4a75-b92a-b65641610c53',
  name: 'sachinchaurasiyachotey87',
  fullyQualifiedName: 'sachinchaurasiyachotey87',
  displayName: 'Sachin Chaurasiya',
  version: 0.2,
  updatedAt: 1652699178358,
  updatedBy: 'anonymous',
  email: 'sachinchaurasiyachotey87@gmail.com',
  href: 'http://localhost:8585/api/v1/users/ea09aed1-0251-4a75-b92a-b65641610c53',
  isBot: true,
  isAdmin: false,
  deleted: false,
};

const mockAuthMechanism = {
  config: {
    JWTToken:
      // eslint-disable-next-line max-len
      'eyJraWQiOiJHYjM4OWEtOWY3Ni1nZGpzLWE5MmotMDI0MmJrOTQzNTYiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJzYWNoaW5jaGF1cmFzaXlhY2hvdGV5ODciLCJpc0JvdCI6dHJ1ZSwiaXNzIjoib3Blbi1tZXRhZGF0YS5vcmciLCJleHAiOjE2NjY3OTE5NjAsImlhdCI6MTY2NDE5OTk2MCwiZW1haWwiOiJzYWNoaW5jaGF1cmFzaXlhY2hvdGV5ODdAZ21haWwuY29tIn0.e5y5hh61EksbcWlLet_GpE84raDYvMho6OXAOLe5MCKrimHYj1roqoY54PFlJDSdrPWJOOeAFsTOxlqnMB_FGhOIufNW9yJwlkIOspWCusNJisLpv8_oYw9ZbrB5ATKyDz9MLTaZRZptx3JirA7s6tV-DJZId-mNzQejW2kiecYZeLZ-ipHqQeVxfzryfxUqcBUGTv-_de0uxlPdklqBuwt24bCy29qVIGxUweFDhrstmdRx_ZyQdrRvmeMHifUB6FCB1OBbII8mKYvF2P0CWF_SsxVLlRHUeOsxKeAeUk1MAA1mHm4UYdMD9OAuFMTZ10gpiELebVWiKrFYYjdICA',
    JWTTokenExpiry: '30',
    JWTTokenExpiresAt: 1666791960664,
  },
  authType: 'JWT',
};

const mockProp = {
  botsData,
  botPermission: {
    Create: true,
    Delete: true,
    ViewAll: true,
    EditAll: true,
    EditDescription: true,
    EditDisplayName: true,
    EditCustomFields: true,
  } as OperationPermission,
  revokeTokenHandler,
  updateBotsDetails,
};

jest.mock('../../utils/PermissionsUtils', () => ({
  checkPermission: jest.fn().mockReturnValue(true),
}));

jest.mock('../../axiosAPIs/userAPI', () => {
  return {
    updateUser: jest.fn().mockImplementation(() => Promise.resolve(botsData)),
    getAuthMechanismForBotUser: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAuthMechanism)),
  };
});

jest.mock('../common/description/Description', () => {
  return jest.fn().mockReturnValue(<p>Description Component</p>);
});

describe('Test BotsDetail Component', () => {
  it('Should render all child elements', async () => {
    const { container } = render(<BotDetails {...mockProp} />, {
      wrapper: MemoryRouter,
    });

    const breadCrumb = await findByTestId(container, 'breadcrumb');

    const leftPanel = await findByTestId(container, 'left-panel');
    const rightPanel = await findByTestId(container, 'right-panel');
    const centerPanel = await findByTestId(container, 'center-panel');

    expect(breadCrumb).toBeInTheDocument();
    expect(leftPanel).toBeInTheDocument();
    expect(rightPanel).toBeInTheDocument();
    expect(centerPanel).toBeInTheDocument();
  });

  it('Should render token if token is present', async () => {
    const { container } = render(<BotDetails {...mockProp} />, {
      wrapper: MemoryRouter,
    });

    const tokenElement = await findByTestId(container, 'token');
    const tokenExpiry = await findByTestId(container, 'token-expiry');

    expect(tokenElement).toBeInTheDocument();
    expect(tokenExpiry).toBeInTheDocument();
  });

  it('Test Revoke token flow', async () => {
    const { container } = render(<BotDetails {...mockProp} />, {
      wrapper: MemoryRouter,
    });

    const revokeButton = await findByTestId(container, 'revoke-button');

    expect(revokeButton).toBeInTheDocument();

    fireEvent.click(revokeButton);

    // should open confirmartion before revoking token
    const confirmationModal = await findByTestId(
      container,
      'confirmation-modal'
    );

    expect(confirmationModal).toBeInTheDocument();

    const confirmButton = await findByTestId(confirmationModal, 'save-button');

    expect(confirmButton).toBeInTheDocument();

    fireEvent.click(confirmButton);

    // revoke token handler should get called
    expect(revokeTokenHandler).toBeCalled();
  });
});
