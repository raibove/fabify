import React, { useState } from 'react';
import './style.css';
import UploadFileButton from '../upload';
import { Clothing, DetailClothing, getBase64Image, getComplementOutfit, parseClothingData, processBase64, processComplementOutfit, run } from '../../utils';

const InputModal: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState('');
  const [step, setStep] = useState<'upload' | 'select' | 'result'>('upload');
  const [clothesInImg, setClothesInImg] = useState<Clothing[]>([]);
  const [selectedClothIndex, setSelectedClothIndex] = useState<number>(-1);
  const [complementOutfit, setComplementOutfit] = useState<DetailClothing[]>([]);

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      const base64 = await getBase64Image(file);
      const text = await run(processBase64(base64));
      const result = parseClothingData(text)
      setImage(base64);
      setStep('select')
      setClothesInImg(result);
      console.log('<< res', result)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    const result = await getComplementOutfit(clothesInImg[selectedClothIndex]);
    setLoading(false);
    const oft = processComplementOutfit(result);
    console.log(oft);
    setComplementOutfit(oft);
    setStep('result')
  };

  const selectNextDisabled = loading || selectedClothIndex===-1;

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
              {clothesInImg.map((cloth, index) => (
                <div key={index} style={{ cursor: 'pointer' }}>
                  <label style={{ color: 'black', cursor: 'pointer' }}>
                  <input 
                  type='radio' 
                  value={index}
                  checked={selectedClothIndex === index}
                  onChange={()=>{
                    setSelectedClothIndex(index);
                  }}
                  />
                  {cloth.item}
                  </label>
                </div>)
              )}
            </div>
            <button className="next-button" onClick={handleNext} disabled={selectNextDisabled} style={{cursor: selectNextDisabled? 'no-drop' : 'pointer'}}>Next</button>
          </>
        )
      }
      {
        step === 'result' && (
          <>
            {
              complementOutfit.map((outfit)=> (
                <a href={`https://www.google.com/search?tbm=isch&q=${outfit.color}+${outfit.item}`} target='_blank' key={outfit.color + outfit.item}>
                  <div>
                      <p>{outfit.item}</p>
                  </div>
                </a>
              ))
            }
          </>
        )
      }
    </div>
  );
};

export default InputModal;
