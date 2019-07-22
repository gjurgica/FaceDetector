import React from 'react';
import './FaceRecognation.css';

const FaceRecognation = ({box,imageUrl}) => {
    return(
        <div className='center ma3'>
            <div className="absolute mt2">
                <img id="image" src={imageUrl} alt="title" width="500px" height="auto"/> 
                <div className="bounding-box" style={{left:box.leftCol,top:box.topCol,right:box.rightCol,bottom:box.bottomCol}}></div>  
            </div>
        </div>
    );
}

export default FaceRecognation;