function ConfirmRemoveModal() {
  return (
    <div>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
          <h2 className="text-lg font-semibold mb-4">Confirm Removal</h2>
          <p>Are you sure you want to remove this item from your cart?</p>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={onConfirm}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmRemoveModal;
