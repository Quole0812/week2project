import React from 'react';
import { Link } from "react-router";
import '../styles/SongTemplate.css'

function SongTemplate({ songObj }) {
    return (
        <>
            <Link to={songObj.external_urls.spotify} className="songTemplateContainer">
                <div className="songTemplateImageContainer">
                    <img className="songTemplateImage" src={songObj.album.images[0].url}/>
                </div>
                <div className="songTemplateTextContainer">
                    <div className="songTemplateName">
                        {songObj.name}
                    </div>
                    <div className="songTemplateArtist">
                        {songObj.artists[0].name}
                    </div>
                </div>
            </Link>
        </>
    )
}

export default SongTemplate