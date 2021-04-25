import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';



import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';
import { usePlayer } from '../../contexts/PlayContex';
import { converteDurationToTimeString } from '../../utils/convertDurationToTimeString';
import SEO from '../Seo';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevius,
        isLooping,
        toggleLoop,
        toggIsShuffle,
        isShuffling,
        clearPlayerState
    } = usePlayer();
    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])
    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }
    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }
    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        }else{
            clearPlayerState();
        }
    }
    const episode = episodeList[currentEpisodeIndex]

    return (
       
        <div className={styles.playerContainer}>
             <SEO title="Dashboard" description={'Olá eu sou a description'} />
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Playing now </strong>
            </header>
            {episode ?
                (
                    <div className={styles.currentEpisode}>
                        <Image
                            width={592}
                            height={592}
                            src={episode.thumbnail}
                            objectFit="cover"
                        />
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </div>
                ) : (
                    <div className={styles.emptyPlayer}>
                        <strong>Select a podcast to listen</strong>
                    </div>
                )
            }
            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{converteDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ?
                            (
                                <Slider
                                    max={episode.duration}
                                    value={progress}
                                    onChange={handleSeek}
                                    trackStyle={{ backgroundColor: '#04d361' }}
                                    railStyle={{ backgroundColor: '#9f75ff' }}
                                    handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                                />
                            ) :
                            (
                                <div className={styles.empySlider} />
                            )}
                    </div>
                    <span>{converteDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}

                    />


                )}
                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length == 1}
                        onClick={toggIsShuffle}
                        className={isShuffling ? styles.isActive : ''}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button type="button" disabled={!episode || !hasPrevius} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>

                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        {isPlaying
                            ? <img src="/pause.svg" alt="Tocar" />
                            : <img src="/play.svg" alt="Tocar" />
                        }
                    </button>


                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Tocar próximo" />
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >

                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div >
    )
}
