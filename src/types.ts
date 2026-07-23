/** A single item from NASA's Astronomy Picture of the Day API. */
export interface ApodItem {
  url: string;
  title?: string;
  explanation?: string;
  date?: string;
  media_type?: string;
  hdurl?: string;
}
