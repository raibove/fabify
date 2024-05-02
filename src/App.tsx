import { useEffect } from 'react';
import './App.css'
import Header from './component/header'
import InputModal from './component/input-modal'

const prefetchImage = async (imageName: string) => {
  var img=new Image();
  img.src=`/${imageName}`;
};

function App() {
  useEffect(() => {
    const prefetchImages = async () => {
        const promises = [];
        for (let i = 0; i <= 11; i++) {
            promises.push(prefetchImage(`image${i}.png`));
        }
        await Promise.all(promises);
    };
    prefetchImages();
}, []);

  return (
    <div className='app'>
      <Header/>
      <>
        <InputModal />
      </>
    </div>
  )
}

export default App
