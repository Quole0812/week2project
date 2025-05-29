import React from 'react';
import { Link } from "react-router";
import '../styles/ArtistTemplate.css'

function ArtistTemplate({ artistObj }) {
    return (
        <>
            <Link to={artistObj.external_urls.spotify} className="artistTemplateContainer">
                <div className="artistTemplateImageContainer">
                    <img className="artistTemplateImage" src={artistObj.images[1].url}/>
                </div>
                <div className="artistTemplateName">
                    {artistObj.name}
                </div>
                <div className="artistTemplateType">
                    {artistObj.type.charAt(0).toUpperCase() + artistObj.type.slice(1)}
                </div>
            </Link>
        </>
    )
}

export default ArtistTemplate