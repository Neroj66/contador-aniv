import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import cinna from "./assets/img/cinna.png"
import kurospi from "./assets/img/k-s.jpg"
import puls from "./assets/img/puls.png"
import faces from "./assets/img/faces.png"

const getNextAnniversaryDate = () => {
    const now = new Date();

    let nextAnniversaryYear = now.getFullYear();
    if (now.getMonth() > 5 || (now.getMonth() === 5 && now.getDate() >= 6)) {
        nextAnniversaryYear += 1;
    }

    return new Date(`06/06/${nextAnniversaryYear}`);
};

const isItAnniversary = () => {
    const now = new Date();
    return now.getMonth() === 5 && now.getDate() === 6;
};

const padNumber = (number) => (number < 10 ? `0${number}` : `${number}`);

function App() {
    const intervalRef = useRef(null);

    const [itIsAnniversary, setItIsAnniversary] = useState(false);
    const [nextAnniversaryDate, setNextAnniversaryDate] = useState(getNextAnniversaryDate());
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const updateTimeLeft = useCallback(() => {
        const now = new Date();
        const timeDiffInMs = nextAnniversaryDate.getTime() - now.getTime();

        if (timeDiffInMs <= 0) {
            window.clearInterval(intervalRef.current);
            setItIsAnniversary(true);
            setNextAnniversaryDate(getNextAnniversaryDate());
        }

        const seconds = 1000;
        const minutes = seconds * 60;
        const hours = minutes * 60;
        const days = hours * 24;

        setTimeLeft({
            days: Math.floor(timeDiffInMs / days),
            hours: Math.floor((timeDiffInMs % days) / hours),
            minutes: Math.floor((timeDiffInMs % hours) / minutes),
            seconds: Math.floor((timeDiffInMs % minutes) / seconds),
        });
    }, [nextAnniversaryDate]);

    useEffect(() => {
        if (isItAnniversary()) {
            setItIsAnniversary(true);
            return;
        }

        updateTimeLeft();
        intervalRef.current = window.setInterval(updateTimeLeft, 1000);

        return () => {
            window.clearInterval(intervalRef.current);
        };
    }, [nextAnniversaryDate, updateTimeLeft]);

    const onStartNextCountdownClick = () => {
        updateTimeLeft();
        intervalRef.current = window.setInterval(updateTimeLeft, 1000);
        setItIsAnniversary(false);
    };

    return (
        <div className="App">
            <div className="corner-image top-left">
                <img src={faces} alt="Imagen 1" />
            </div>
            <div className="corner-image top-right">
                <img src={puls} alt="Imagen 2" />
            </div>
            <div className="corner-image bottom-left">
                <img src={kurospi}alt="Imagen 3" />
            </div>
            <div className="corner-image bottom-right">
                <img src={cinna} alt="Cinna" />
            </div>
            <div className="header-wrapper">
                <div className="header-content">
                    <h1>Tiempo restante para nuestro aniversario</h1>
                    <h2>6 de junio del 2024</h2>
                </div>
            </div>
            {itIsAnniversary ? (
                <div className="is-anniversary-wrapper">
                    <h1>¡Es nuestro aniversario!</h1>
                    <button onClick={onStartNextCountdownClick}>
                        Comenzar cuenta para siguiente aniversario
                    </button>
                </div>
            ) : (
                <div className="countdown-wrapper">
                    <span>
                        <b>{padNumber(timeLeft.days)}</b> días, <b>{padNumber(timeLeft.hours)}</b> horas, <b>{padNumber(timeLeft.minutes)}</b> minutos y <b>{padNumber(timeLeft.seconds)}</b> segundos
                    </span>
                </div>
            )}
        </div>
    );
}

export default App;
