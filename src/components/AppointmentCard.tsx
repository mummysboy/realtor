import React, { useState } from 'react';

interface AppointmentCardProps {
  date: string;
  listingTitle: string;
  phone: string;
  address: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'canceled';
  onReschedule: (message: string) => void;
  onCancel: (message: string) => void;
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
  title: string;
  action: 'cancel' | 'reschedule';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  action
}) => {
  const [message, setMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);

  const handleConfirm = () => {
    if (!showMessageInput) {
      setShowMessageInput(true);
    } else {
      onConfirm(message);
      setMessage('');
      setShowMessageInput(false);
    }
  };

  const handleNoNotification = () => {
    onConfirm(''); // Pass empty message to indicate no notification
    onClose();
  };

  const handleClose = () => {
    setMessage('');
    setShowMessageInput(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600">
            {!showMessageInput 
              ? `Would you like to notify the client about this ${action}?`
              : `Enter a message to send to the client about the ${action}:`
            }
          </p>
        </div>

        {showMessageInput && (
          <div className="mb-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Enter your message about the ${action}...`}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
            />
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={showMessageInput ? handleClose : handleNoNotification}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {showMessageInput ? 'Cancel' : 'No'}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-3 text-sm font-medium text-white rounded-xl transition-colors ${
              action === 'cancel' 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-primary-500 hover:bg-primary-600'
            }`}
          >
            {showMessageInput ? 'Send' : 'Yes'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  date,
  listingTitle,
  phone,
  address,
  timeSlot,
  status,
  onReschedule,
  onCancel
}) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  const getStatusBadge = () => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center text-green-700 bg-green-100 text-sm px-3 py-1 rounded-full">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center text-yellow-700 bg-yellow-100 text-sm px-3 py-1 rounded-full">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Pending
          </span>
        );
      case 'canceled':
        return (
          <span className="inline-flex items-center text-red-700 bg-red-100 text-sm px-3 py-1 rounded-full">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Canceled
          </span>
        );
      default:
        return null;
    }
  };

  const handleCancel = (message: string) => {
    console.log('Canceling appointment with message:', message);
    // TODO: Implement actual cancel logic with message
    onCancel(message);
    setShowCancelDialog(false);
  };

  const handleReschedule = (message: string) => {
    console.log('Rescheduling appointment with message:', message);
    // TODO: Implement actual reschedule logic with message
    onReschedule(message);
    setShowRescheduleDialog(false);
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-xl p-4 my-4 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
        <div className="space-y-4">
          {/* Header with Time */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-lg font-semibold text-gray-900 truncate">
                {timeSlot}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-row space-x-3 sm:space-x-4 justify-end">
              <button
                onClick={() => setShowRescheduleDialog(true)}
                aria-label="Reschedule appointment"
                className="text-sm text-primary-600 hover:text-primary-800 font-semibold px-4 py-2 rounded-lg hover:bg-primary-50 transition-all border border-primary-200 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reschedule
              </button>
              <button
                onClick={() => setShowCancelDialog(true)}
                aria-label="Cancel appointment"
                className="text-sm text-red-600 hover:text-red-800 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-all border border-red-200 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </div>
          
          {/* Property Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-gray-900 flex-shrink-0">🏠 Property:</span>
              <span 
                className="text-sm text-gray-600 truncate ml-2 text-right"
                title={listingTitle}
              >
                {listingTitle}
              </span>
            </div>
            
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-gray-900 flex-shrink-0">📱 Phone:</span>
              <span 
                className="text-sm text-gray-600 font-mono truncate ml-2 text-right"
                title={phone}
              >
                {phone}
              </span>
            </div>
            
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-gray-900 flex-shrink-0">📍 Address:</span>
              <span 
                className="text-sm text-gray-600 truncate ml-2 text-right max-w-xs"
                title={address}
              >
                {address}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Cancel Appointment"
        action="cancel"
      />

      {/* Reschedule Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showRescheduleDialog}
        onClose={() => setShowRescheduleDialog(false)}
        onConfirm={handleReschedule}
        title="Reschedule Appointment"
        action="reschedule"
      />
    </>
  );
};

export default AppointmentCard; 