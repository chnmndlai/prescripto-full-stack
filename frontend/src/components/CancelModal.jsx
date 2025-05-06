// frontend/src/components/CancelModal.jsx
import React, { useState } from 'react';

const CancelModal = ({ onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-xl shadow-xl max-w-md w-full'>
        <h2 className='text-lg font-semibold mb-4'>Цуцлах шалтгаан бичнэ үү</h2>
        <textarea
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className='w-full border p-2 rounded'
          placeholder='Жишээ нь: цаг давхцсан, төлөвлөгөө өөрчлөгдсөн гэх мэт...'
        />
        <div className='flex justify-end gap-2 mt-4'>
          <button onClick={onClose} className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'>Болих</button>
          <button
            onClick={() => {
              if (reason.trim()) onSubmit(reason);
            }}
            className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
          >
            Цуцлах
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
