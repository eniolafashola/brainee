import React from 'react';
import Tilt from 'react-parallax-tilt';
import logoimg from './logoimg.png';

const Logo = () => {
	return (
	    <Tilt>
	      <div className="Tilt br2 shadow-5" style={{ height: '150px', width: '150px' , background: 'papayawhip', marginLeft: '15px'}}>
	         <div className="Tilt-inner"><img className="pa4" alt='Logo' src={logoimg}/></div>
	      </div>
	    </Tilt>
  );
}

export default Logo;