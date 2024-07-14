import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';

const getNextChristmasDate = () => {
    const now = new Date();

    let nextChristmasYear = now.getFullYear();
    if (now.getMonth() === 6 && now.getDate() >= 6 && now.getDate()) {
        nextChristmasYear += 1;
    }

    return new Date(`06/06/${nextChristmasYear}`);
};

const isItChristmas = () => {
    const now = new Date();
    return now.getMonth() === 11 && now.getDate() === 25;
};

const padNumber = (number) => (number < 10 ? `0${number}` : `${number}`);

function App() {
    const intervalRef = useRef(null);

    // verdadero si estamos en navidad, falso en caso contrario
    const [itIsChristmas, setItIsChristmas] = useState(false);

    // la fecha de la siguiente navidad
    const [nextChristmasDate, setNextChristmasDate] = useState(getNextChristmasDate());

    // lo que falta hasta navidad
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // esta función nos permitira actualizar la cuenta regresiva
    const updateTimeLeft = useCallback(() => {
        const now = new Date();
        const timeDiffInMs = nextChristmasDate.getTime() - now.getTime();

        if (timeDiffInMs <= 0) {
            // cancelamos el intervalo que hace correr
            // esta funcion cada 1000ms, (linea 80 y 95)
            window.clearInterval(intervalRef.current);

            // como ya es navidad setteamos itIsChristmas a verdadero
            setItIsChristmas(true);

            // a nextChristmasDate le setteamos la próxima fecha de navidad
            setNextChristmasDate(getNextChristmasDate());
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
    }, [nextChristmasDate]);

    useEffect(() => {
        if (isItChristmas()) {
            // si ya es navidad setteamos itIsChristmas a Verdadero
            setItIsChristmas(true);
            return;
        }

        // si aun no es navidad actualizamos la cuenta regresiva
        updateTimeLeft();

        // actualizamos la cuenta regresiva cada un segundo
        intervalRef.current = window.setInterval(updateTimeLeft, 1000);

        return () => {
            /* en caso de que se desmontara el componente deberiamos
            cancelar el intervalo de la linea 80 mediante su id */
            window.clearInterval(intervalRef.current);
        };
    }, [nextChristmasDate, updateTimeLeft]);

    /*
        útil para comenzar una cuenta regresiva
        para la próxima navidad
    */
    const onStartNextCountdownClick = () => {
        updateTimeLeft();
        intervalRef.current = window.setInterval(updateTimeLeft, 1000);

        setItIsChristmas(false);
    };
    return (
        <div className="App">
          <div className="header-wrapper">
            <div className="header-content">
              <h1>Tiempo restante para nuestro aniversario</h1>
              <h2>6 de junio del 2024</h2>
            </div>
          </div>
          {itIsChristmas ? (
            <div className="is-christmas-wrapper">
              <h1>¡Es nuestro aniversario!</h1>
              <button onClick={onStartNextCountdownClick}>
                Comenzar cuenta para siguiente aniversario
              </button>
            </div>
          ) : (
            <div className="countdown-wrapper">
              <span>
                <b>{padNumber(timeLeft.days)}</b> dias, <b>{padNumber(timeLeft.hours)}</b> horas, <b>{padNumber(timeLeft.minutes)}</b> minutos y <b>{padNumber(timeLeft.seconds)}</b> segundos
              </span>
            </div>
          )}
        </div>
      );
      
      
}

export default App;