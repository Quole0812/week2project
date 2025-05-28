import React from 'react';
import '../styles/ArtistTemplate.css'

function ArtistTemplate({ artistObj }) {
    return (
        <>
            <div className="artistTemplateContainer">
                <div className="artistTemplateImageContainer">
                    <img className="artistTemplateImage" src={artistObj.images[1].url}/>
                </div>
                <div className="artistTemplateName">
                    {artistObj.name}
                </div>
                <div className="artistTemplateType">
                    {artistObj.type.charAt(0).toUpperCase() + artistObj.type.slice(1)}
                </div>
            </div>
        </>
    )
}

export default ArtistTemplate