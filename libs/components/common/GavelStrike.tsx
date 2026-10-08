import React from 'react';

const GavelStrike = () => {
	return (
		<svg className={'gavel-scene'} viewBox={'0 0 160 120'}>
			<ellipse className={'ripple'} cx={'80'} cy={'104'} rx={'46'} ry={'6'} />
			<rect x={'38'} y={'94'} width={'84'} height={'12'} rx={'6'} />
			<g className={'gavel'}>
				<line x1={'80'} y1={'80'} x2={'138'} y2={'38'} />
				<rect x={'56'} y={'70'} width={'48'} height={'24'} rx={'6'} />
				<rect className={'band'} x={'64'} y={'70'} width={'4'} height={'24'} />
				<rect className={'band'} x={'92'} y={'70'} width={'4'} height={'24'} />
			</g>
			<g className={'impact'}>
				<line x1={'40'} y1={'78'} x2={'30'} y2={'70'} />
				<line x1={'120'} y1={'78'} x2={'130'} y2={'70'} />
				<line x1={'80'} y1={'60'} x2={'80'} y2={'50'} />
			</g>
		</svg>
	);
};

export default GavelStrike;
