import React from 'react';
import '../styles/SongTemplate.css'

function SongTemplate({ songObj }) {
    return (
        <>
            <div className="songTemplateContainer">
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
            </div>
        </>
    )
}

export default SongTemplate