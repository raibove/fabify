import React, { useState } from 'react';
import './style.css';
import UploadFileButton from '../upload';
import { Clothing, getBase64Image, parseClothingData, processBase64, run } from '../../utils';

const InputModal: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState('');
  const [step, setStep] = useState<'upload' | 'select' | 'result'>('upload');
  const [result, setResult] = useState<Clothing[]>([]);

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      const base64 = await getBase64Image(file);
      const text = await run(processBase64(base64));
      const result = parseClothingData(text)
      setImage(base64);
      setStep('select')
      setResult(result);
      console.log('<< res', result)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    console.log("Next button clicked!");
    setStep('result')
  };

  return (
    <div className="app-container">
      {loading && <div className="loading style-2"><div className="loading-wheel"></div></div>}
      {step === 'upload' &&
        (
          <>
            <label className="upload-label">Upload photo to get matching outfit suggestions</label>
            <UploadFileButton onChange={handleFileUpload} loading={loading} />
          </>
        )
      }
      {
        step === 'select' && (
          <>
            <img src={image} alt="uplaoded outfit" style={{ height: '300px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {result.map((cloth) => (
                <div key={cloth.item} style={{ cursor: 'pointer' }}>
                  <input type='checkbox' />
                  <label style={{ color: 'black', cursor: 'pointer' }}>{cloth.item}</label>
                </div>)
              )}
            </div>
            <button className="next-button" onClick={handleNext} disabled={loading}>Next</button>
          </>
        )
      }
      {
        step === 'result' && (
          <>
            
          </>
        )
      }
    </div>
  );
};

export default InputModal;
