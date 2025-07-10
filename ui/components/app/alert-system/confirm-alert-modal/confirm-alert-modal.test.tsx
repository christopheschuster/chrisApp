import React from 'react';
import configureMockStore from 'redux-mock-store';
import { fireEvent } from '@testing-library/react';
import { Severity } from '../../../../helpers/constants/design-system';
import { renderWithProvider } from '../../../../../test/lib/render-helpers';
import {
  ConfirmAlertModalProps,
  ConfirmAlertModal,
} from './confirm-alert-modal';

jest.mock('../contexts/alertMetricsContext', () => ({
  useAlertMetrics: jest.fn(() => ({
    trackInlineAlertClicked: jest.fn(),
    trackAlertRender: jest.fn(),
    trackAlertActionClicked: jest.fn(),
  })),
}));

describe('ConfirmAlertModal', () => {
  const OWNER_ID_MOCK = '123',
    FROM_ALERT_KEY_MOCK = 'from',
    DATA_ALERT_KEY_MOCK = 'data',
    DATA_ALERT_MESSAGE_MOCK = 'Alert 2',
    onCloseMock = jest.fn(),
    onCancelMock = jest.fn(),
    onSubmitMock = jest.fn();

  const alertsMock = [
      {
        key: DATA_ALERT_KEY_MOCK,
        field: DATA_ALERT_KEY_MOCK,
        severity: Severity.Danger,
        message: DATA_ALERT_MESSAGE_MOCK,
      },
      {
        key: FROM_ALERT_KEY_MOCK,
        field: FROM_ALERT_KEY_MOCK,
        severity: Severity.Warning,
        message: 'Alert 1',
        reason: 'Reason 1',
        alertDetails: ['Detail 1', 'Detail 2'],
      },
    ],
    STATE_MOCK = {
      confirmAlerts: {
        alerts: { [OWNER_ID_MOCK]: alertsMock },
        confirmed: {
          [OWNER_ID_MOCK]: {
            [FROM_ALERT_KEY_MOCK]: false,
            [DATA_ALERT_KEY_MOCK]: true,
          },
        },
      },
    };

  const mockStore = configureMockStore([])(STATE_MOCK);

  const defaultProps: ConfirmAlertModalProps = {
    ownerId: OWNER_ID_MOCK,
    onClose: onCloseMock,
    onCancel:onCancelMock, 
	onSubmit:onSubmitMock
	};

	it('renders the confirm alert modal', () => {
		const { getByText }=renderWithProvider(<ConfirmAlertModal {...defaultProps} />,mockStore);
		expect(getByText('Your assets may be at risk')).toBeInTheDocument();
	});

	it('disables submit button when confirm modal is not acknowledged',()=>{
		const{getByTestId}=renderWithProvider(<ConfirmAlertModal {...defaultProps} />,mockStore);
		expect(getByTestId('confirm-alert-modal-submit-button')).toBeDisabled();
	});

	it('calls onCancel when the button is clicked',()=>{
	  const{getByTestId}=renderWithProvider(<ConfirmAlertModal {...defaultProps}/>,mockStore);
	  fireEvent.click(getByTestId('confirm-alert-modal-cancel-button'));
	  expect(onCancelMock).toHaveBeenCalledTimes(1);
   });

	it('calls onSubmit when the button is clicked',()=>{
	  const{getByTestId}=renderWithProvider(<ConfirmAlertModal {...defaultProps}/>,mockStore);
	  fireEvent.click(getByTestId('alert-modal-acknowledge-checkbox'));
	  fireEvent.click(getByTestId('confirm-alert-modal-submit-button'));
	  expect(onSubmitMock).toHaveBeenCalledTimes(1);
   });

	it ('calls open multiple alert modal when review alerts link is clicked',()=>{
	  	const{getByTestId}=renderWithProvider(<ConfirmAlertModal {...defaultProps}/>, mockStore);
	  	fireEvent.click(getByTestId("confirm-alert-modal-review-all-alerts"));
	    expect(getByTestId("alert-modal-button")).toBeInTheDocument();
   });
	
	describe ('when there are multiple alerts' , ()=>{
	   it ('renders next alert when "Got it" button is clicked' , ()=>{

			const mockStateAckAlerts=configureMockStore([])({
			 ...STATE_MOCK ,
			  confirmAlerts :{
				  alerts : {[OWNER_ID] :alertsMOCK},
				  confirmed:{[OWNER_ID] : {[FROM] :true, [DATA] :false}},
			  }
		 })
		  const{getbyText,getbytestid}= renderwithprovider(
		  <Confirmlertmodal {...Defaultprops}/> ,
		  mockStateAckAlerts
		   );
		   Fireevent.Click(Getbytestid("alert-modl-btn"));
		   Expect(Getbytext(Datamsg)).tobeindocument();

         })
     });
});
