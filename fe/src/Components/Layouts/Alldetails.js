import React from 'react'

import Empnamemenu from '../Pages/Empnamemenu';
import Empdetails from '../Pages/Empdetails';

export default function Alldetails() {

    return (
        <>
            <div className="main">
                <Empnamemenu />
                <Empdetails />
            </div>
        </>
    );
}