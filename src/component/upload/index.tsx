import { ChangeEvent } from 'react';
import './style.css';


interface UploadFileButtonProps {
  onChange: (file: File) => void;
  loading: boolean;
}

const UploadFileButton = ({ onChange, loading }: UploadFileButtonProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      onChange(file);
    }
  };

  return (
    <label className="file-input-container">
      Upload File
      <input type="file" className="file-input" onChange={handleFileChange} accept="image/png, image/jpeg" disabled={loading} />
    </label>
  );
};

export default UploadFileButton;
