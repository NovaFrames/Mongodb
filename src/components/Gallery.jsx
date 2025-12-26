import React from 'react';
import Card from './Card';
import LoadingCard from './LoadingCard';

const Gallery = ({ items, isGenerating }) => {
    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <h2 style={{ marginBottom: '32px', fontSize: '2rem' }}>Latest Creations</h2>
            <div style={{
                columnCount: 3,
                columnGap: '24px',
            }}>
                {isGenerating && <LoadingCard />}
                {items.map((item) => (
                    <Card key={item._id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Gallery;
