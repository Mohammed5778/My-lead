
import React from 'react';

const Loader: React.FC = () => {
    return (
        <div 
            className="w-6 h-6 border-4 border-gray-200 border-t-cyan-400 rounded-full animate-spin"
            style={{ borderTopColor: '#06b6d4' }}
        ></div>
    );
};

export default Loader;
