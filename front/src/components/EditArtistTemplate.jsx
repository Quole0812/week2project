import React from 'react';
import '../styles/SongTemplate.css'

function EditArtistTemplate({ artistObj }) {
    return (
        <>
            <div className="songTemplateContainer">
                <div className="songTemplateImageContainer">
                    {artistObj.images.length > 0 ? (
                        <img className="songTemplateImage" src={artistObj.images[0].url}/>
                    ) : (
                        <div className="songTemplateImage" />
                    )}
                </div>
                <div className="songTemplateTextContainer">
                    <div className="songTemplateName">
                        {artistObj.name}
                    </div>
                    <div className="songTemplateArtist">
                        {artistObj.type}
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditArtistTemplate