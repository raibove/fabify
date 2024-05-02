import { Clothing, DetailClothing } from "../../utils";
// import {Link} from 'react-router-dom';
import './styles.css';

interface Props {
    outfit: DetailClothing;
    selectedItem: Clothing;
}

const Card = ({ outfit, selectedItem }: Props) => {

    const getHref = (): string => {
        let href = `https://www.google.com/search?tbm=isch&q=${outfit.color}+${outfit.item}`;
        href += ` on ${selectedItem.color} ${selectedItem.item}` 
        
        if(selectedItem.for) {
            if(selectedItem.for.includes('women')){
                href += ' for women'; 
            }else if(selectedItem.for.includes('men')){
                href += ' for men'; 
            }
        }


        return href;
    }

    return (
        <div className="product-card" key={outfit.color+outfit.item}>
            <div className="card-content">
                <h3 className="title">{outfit.color} {outfit.item}</h3>
                <p className="description">Design: {outfit.design}, {outfit.material}</p>
                <p>{outfit.additionalDetail}</p>
                <a href={getHref()} target='_blank' >
                    <button className="explore-button">Explore</button>
                </a>
            </div>
        </div>
    )
}

export default Card;