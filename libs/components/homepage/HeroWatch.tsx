import React, { useEffect, useRef, useState } from 'react';

interface WatchTime {
	hour: number;
	minute: number;
	second: number;
	date: number;
}

const HeroWatch = () => {
	const watchRef = useRef<HTMLDivElement>(null);
	const [time, setTime] = useState<WatchTime | null>(null);

	/** LIFECYCLES **/
	useEffect(() => {
		const now = new Date();
		const second = now.getSeconds() + now.getMilliseconds() / 1000;
		const minute = now.getMinutes() * 60 + second;
		setTime({
			hour: (now.getHours() % 12) * 3600 + minute,
			minute,
			second,
			date: now.getDate(),
		});
	}, []);

	/** HANDLERS **/
	const tiltHandler = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = watchRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		el.style.setProperty('--rx', `${-y * 16}deg`);
		el.style.setProperty('--ry', `${x * 16}deg`);
	};

	const resetTiltHandler = () => {
		watchRef.current?.style.setProperty('--rx', '0deg');
		watchRef.current?.style.setProperty('--ry', '0deg');
	};

	return (
		<div
			className={'hero-watch'}
			ref={watchRef}
			onMouseMove={tiltHandler}
			onMouseLeave={resetTiltHandler}
		>
			<div className={'halo'} />
			<div className={'orbit'} />
			<div className={'watch-body'} aria-hidden="true">
				<div className={'shadow'} />
				<svg viewBox="0 0 400 480">
					<defs>
						<linearGradient id="hw-brass" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0" stopColor="#f3e2ad" />
							<stop offset="0.45" stopColor="#c2a35a" />
							<stop offset="0.75" stopColor="#8a6f2e" />
							<stop offset="1" stopColor="#e6cf8f" />
						</linearGradient>
						<radialGradient id="hw-dial" cx="0.42" cy="0.38" r="0.7">
							<stop offset="0" stopColor="#1f4a78" />
							<stop offset="0.6" stopColor="#0f2742" />
							<stop offset="1" stopColor="#071423" />
						</radialGradient>
						<linearGradient id="hw-strap-top" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#13304f" stopOpacity="0" />
							<stop offset="0.7" stopColor="#13304f" />
						</linearGradient>
						<linearGradient id="hw-strap-bottom" x1="0" y1="1" x2="0" y2="0">
							<stop offset="0" stopColor="#13304f" stopOpacity="0" />
							<stop offset="0.7" stopColor="#13304f" />
						</linearGradient>
						<linearGradient id="hw-glass" x1="0" y1="0" x2="0.6" y2="1">
							<stop offset="0" stopColor="#fff" stopOpacity="0.22" />
							<stop offset="0.5" stopColor="#fff" stopOpacity="0" />
						</linearGradient>
					</defs>

					<rect
						x="150"
						y="0"
						width="100"
						height="110"
						fill="url(#hw-strap-top)"
					/>
					<rect
						x="150"
						y="370"
						width="100"
						height="110"
						fill="url(#hw-strap-bottom)"
					/>
					<path
						d="M160 0 V105 M240 0 V105 M160 375 V480 M240 375 V480"
						stroke="rgba(194,163,90,0.35)"
						strokeDasharray="4 5"
					/>

					<rect
						x="140"
						y="88"
						width="120"
						height="304"
						rx="26"
						fill="url(#hw-brass)"
					/>
					<rect
						x="336"
						y="224"
						width="18"
						height="32"
						rx="5"
						fill="url(#hw-brass)"
					/>
					<path
						d="M340 230 V250 M345 230 V250 M350 230 V250"
						stroke="#8a6f2e"
						strokeWidth="1.5"
					/>

					<circle cx="200" cy="240" r="142" fill="url(#hw-brass)" />
					<circle
						cx="200"
						cy="240"
						r="142"
						fill="none"
						stroke="#6f5823"
						strokeWidth="2"
					/>
					<circle cx="200" cy="240" r="128" fill="#0a1b2f" />
					{Array.from({ length: 60 }, (_, i) => (
						<rect
							key={i}
							x={i % 5 ? 199.5 : 198.5}
							y="114"
							width={i % 5 ? 1 : 3}
							height={i % 5 ? 6 : 10}
							fill={i % 5 ? 'rgba(255,255,255,0.35)' : '#e6cf8f'}
							transform={`rotate(${i * 6} 200 240)`}
						/>
					))}
					<circle cx="200" cy="240" r="112" fill="url(#hw-dial)" />
					{Array.from({ length: 12 }, (_, i) =>
						i === 3 ? null : i === 0 ? (
							<g key={i}>
								<rect
									x="191"
									y="136"
									width="6"
									height="22"
									rx="1.5"
									fill="url(#hw-brass)"
								/>
								<rect
									x="203"
									y="136"
									width="6"
									height="22"
									rx="1.5"
									fill="url(#hw-brass)"
								/>
							</g>
						) : (
							<rect
								key={i}
								x="197"
								y="138"
								width="6"
								height="18"
								rx="1.5"
								fill="url(#hw-brass)"
								transform={`rotate(${i * 30} 200 240)`}
							/>
						),
					)}

					<text
						x="200"
						y="190"
						textAnchor="middle"
						fill="#e6cf8f"
						fontFamily="Cormorant Garamond, serif"
						fontSize="18"
						fontWeight="600"
						letterSpacing="5"
					>
						AUCTRA
					</text>
					<text
						x="200"
						y="298"
						textAnchor="middle"
						fill="rgba(255,255,255,0.55)"
						fontFamily="Manrope, sans-serif"
						fontSize="7"
						letterSpacing="3"
					>
						AUTOMATIC
					</text>

					<rect
						x="268"
						y="230"
						width="28"
						height="20"
						rx="2"
						fill="#f6f1e2"
						stroke="url(#hw-brass)"
						strokeWidth="2"
					/>
					{time && (
						<text
							x="282"
							y="245"
							textAnchor="middle"
							fill="#0f2742"
							fontFamily="Manrope, sans-serif"
							fontSize="12"
							fontWeight="700"
						>
							{time.date}
						</text>
					)}
				</svg>
				{time && (
					<>
						<svg
							viewBox="0 0 400 480"
							className={'hand hour'}
							style={{ animationDelay: `-${time.hour}s` }}
						>
							<rect
								x="195.5"
								y="180"
								width="9"
								height="70"
								rx="4.5"
								fill="url(#hw-brass)"
							/>
						</svg>
						<svg
							viewBox="0 0 400 480"
							className={'hand minute'}
							style={{ animationDelay: `-${time.minute}s` }}
						>
							<rect
								x="197"
								y="146"
								width="6"
								height="104"
								rx="3"
								fill="url(#hw-brass)"
							/>
						</svg>
						<svg
							viewBox="0 0 400 480"
							className={'hand second'}
							style={{ animationDelay: `-${time.second}s` }}
						>
							<rect x="199.2" y="134" width="1.6" height="132" fill="#ff5a5f" />
							<circle cx="200" cy="258" r="4" fill="#ff5a5f" />
						</svg>
					</>
				)}
				<svg viewBox="0 0 400 480">
					<circle cx="200" cy="240" r="7" fill="url(#hw-brass)" />
					<circle cx="200" cy="240" r="2.5" fill="#0a1b2f" />
					<circle cx="200" cy="240" r="112" fill="url(#hw-glass)" />
				</svg>
			</div>
		</div>
	);
};

export default HeroWatch;
