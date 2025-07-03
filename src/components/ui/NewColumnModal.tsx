import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';

interface NewColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumn: (name: string) => void;
}

export const NewColumnModal = ({ isOpen, onClose, onAddColumn }: NewColumnModalProps) => {
  const [columnName, setColumnName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (columnName.trim()) {
      onAddColumn(columnName.trim());
      setColumnName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-0 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Add New Column</h3>
        <Input 
          placeholder="Enter column name"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#4b6a4f]" onClick={handleSubmit}>Add</Button>
        </div>
      </div>
    </div>
  );
};
