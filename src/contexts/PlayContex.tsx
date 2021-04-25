import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    playNext: () => void;
    toggIsShuffle: () => void;
    playPrevious: () => void;
    toggleLoop: () => void;
    clearPlayerState:()=>void;
    hasNext: boolean;
    hasPrevius: boolean;
    isLooping:boolean;
    isShuffling:boolean

}

export const PlayContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}
export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }
    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }
    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }
    function toggIsShuffle() {
        setIsShuffling(!isShuffling);
    }
    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }
    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }
    const hasPrevius = currentEpisodeIndex > 0;
    const hasNext = isShuffling||(currentEpisodeIndex + 1) < episodeList.length;
    function playNext() {
        if(isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random()*episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }

    }
    function playPrevious() {
        if (hasPrevius) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    return (
        <PlayContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                play,
                isPlaying,
                togglePlay,
                setPlayingState,
                isLooping,
                toggIsShuffle,
                playList,
                playNext,
                playPrevious,
                hasNext,
                hasPrevius,
                toggleLoop,
                isShuffling,
                clearPlayerState

            }}>
            {children}
        </PlayContext.Provider>
    )
}
export const usePlayer = () => {
    return useContext(PlayContext);
}