import { DetailClothing } from "../../utils";
// import {Link} from 'react-router-dom';
import './styles.css';

interface Props {
    outfit: DetailClothing;
}

const Card = ({ outfit }: Props) => {
    return (
        <div className="product-card">
            <div className="card-content">
                <h3 className="title">{outfit.color} {outfit.item}</h3>
                <p className="description">Design: {outfit.design}, {outfit.material}</p>
                <p>{outfit.additionalDetail}</p>
                <a href={`https://www.google.com/search?tbm=isch&q=${outfit.color}+${outfit.item}`} target='_blank' >
                    <button className="explore-button">Explore</button>
                </a>
            </div>
        </div>
    )
}

export default Card;