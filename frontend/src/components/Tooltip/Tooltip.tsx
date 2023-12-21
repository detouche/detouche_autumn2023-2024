import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Tooltip.module.scss';

type TooltipProps = {
    text: string;
};

export function Tooltip({ text, children }) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const tooltipRef = useRef(null);

    const handleMouseEnter = (event: React.MouseEvent) => {
        if (tooltipRef.current) {
            const rect = (event.target as HTMLElement).getBoundingClientRect();
            setPosition({
                top: rect.top + window.scrollY - tooltipRef.current.clientHeight,
                left: rect.left + window.scrollX + rect.width / 2 - tooltipRef.current.clientWidth / 2
            });
        }
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            document.removeEventListener('mousemove', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <>
            {isVisible && ReactDOM.createPortal(
                <div className={styles.tooltip} style={{ top: `${position.top}px`, left: `${position.left}px` }} ref={tooltipRef}>
                    {text}
                </div>,
                document.body
            )}
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {children}
            </div>
        </>
    );
}