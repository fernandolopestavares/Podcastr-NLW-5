import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
  description: string;
};

type EpisodeProps = {
  episodes: Episode;
}

export default function Episode({ episodes }: EpisodeProps) {
  return (
   <div className={styles.episode}>
     <div className={styles.thumbnailContainer}>
       <button type="button">
          <Link href="/">
            <img src="/arrow-left.svg" alt="Voltar"/>
          </Link>
       </button>
       <Image 
          width={700} 
          height={160} 
          src={episodes.thumbnail} 
          objectFit="cover" 
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar episode"/>
        </button>
     </div>

    <header>
      <h1>{episodes.title}</h1>
      <span>{episodes.members}</span>
      <span>{episodes.publishedAt}</span>
      <span>{episodes.durationAsString}</span>
    </header>

    <div 
      className={styles.description} 
      dangerouslySetInnerHTML={{ __html: episodes.description }} 
    />
   </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`)

  const episodes = {
      id: data.id,
      title: data.title,
      thumbnail: data.thumbnail,
      members: data.members,
      publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR}),
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(Number(data.file.duration)),
      description: data.description,
      url: data.file.url,
    };

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 24, // 24hours
  }
}