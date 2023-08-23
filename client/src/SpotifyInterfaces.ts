export interface Playlist {
  collaborative: boolean; // whether the playlist is collaborative
  description: string; // the playlist's description
  external_urls: {
    // list of known external URLs for the playlist
    spotify: string; // the Spotify URL for the playlist
  };
  href: string; // a link to the Web API endpoint returning the full details of the playlist
  id: string; // the Spotify ID of the playlist
  images: Image[]; // the images for the playlist - length may be 0-3 - sorted by size in descending order
  name: string; // the name of the playlist
  public: boolean; // whether the playlist is public
  tracks: {
    // information on the songs on the playlist
    href: string; // link to the Web API endpoint with full details of the playlist's songs
    total: number; // the number of songs on the playlist
  };
  type: string; // the object type - always "playlist"
  uri: string; // the Spotify URI for the playlist
}

export interface PlaylistSearchResult {
  href: string; // a link to the Web API endpoint returning the full result of the request
  limit: number; // the maximum number of items returned
  next: string | null; // URL to the next page of items (null if none)
  previous: string | null; // URL to the previous page of items (null if none)
  offset: number; // the offset of the items returned
  total: number; // the total number of items availale to return
  items: Playlist[]; // the playlists returned
}

export interface Artist {
  external_urls: {
    // known external URLs for the artist
    spotify: string; // the Spotify URL for the artist
  };
  href: string; // a link to the Web API endpoint providing full details of the artist
  id: string; // the Spotify ID of the artist
  name: string; // the name of the artist
  type: string; // the object type - always "artist"
  uri: string; // the Spotify URI for the artist
}

export interface Image {
  url: string; // the source URL for the image
  height: number; // the height of the image in pixels
  width: number; // the width of the image in pixels
}

export interface SearchResult {
  href: string; // a link to the Web API endpoint returning the full result of the request
  limit: number; // the max number of items in the response
  offset: number; // the offset of the items returned
  total: number; // the total number of items available to return
  next: string | null; // URL to the next page of items (null if none)
  previous: string | null; // URL to the previous page of items (null if none)
  items: Song[]; // list of Song objects returned
}

export interface Album {
  album_type: "album" | "single" | "compilation"; // the type of the album
  total_tracks: number; // the number of tracks on the album
  available_markets: string[]; // the markets that the album is available in
  external_urls: {
    // known external URLs for the album
    spotify: string; // the Spotify URL for the album
  };
  href: string; // A link to the Web API endpoint providing full details of the album
  id: string; // the Spotify ID of the album
  images: Image[]; // the cover art for the album in various sizes, widest first
  name: string; // the name of the album
  release_date: string; // the date the album was first released ex. "1981-12"
  release_date_precision: "year" | "month" | "day"; // the precision with which 'release_date' is known
  restrictions?: {
    // included in the response when a content restrction is applied
    reason: "market" | "product" | "explicit"; // the reason for the restriction
  };
  type: string; // the object type. always "album"
  uri: string; // the Spotify URI for the album
  genres?: string[]; // the array of genres the album is associated with - empty if not classified
  label?: string; // the label associated with the album
  popularity?: number; // the popularity of the album (0 - 100 with 100 is the most popular)
  album_group?: "album" | "single" | "compilation" | "appears_on"; // relationship between the artist and the album
  artists: Artist[]; // the artists of the album
}

export interface Song {
  album: Album; // the Album object for the album the song is on
  artists: Artist[]; // the list of Artist objects for the artists of the song
  available_markets: string[]; // the list of markets the song is availale in
  disc_number: number; // the disc number the song is on - usually 1
  duration_ms: number; // the duration of the song in milliseconds
  explicit: boolean; // whether the song is explicit
  external_ids?: {
    isrc: string;
    ean: string;
    upc: string;
  };
  external_urls: {
    // known external URLs for the song
    spotify: string; // the Spotify URL for the song
  };
  href: string; // a link to the Web API endpoint providing full details of the song
  id: string; // the Spotify ID of the song
  is_playable: boolean; // whether the song is playable in the given market
  restrictions?: {
    //
    reason: "market" | "product" | "explicit"; // the reason for the restriction
  };
  name: string; // the name of the song
  popularity: number; // 0 - 100 how popular the song is
  preview_url: string; // a link to a 30 second preview of the song
  track_number: number; // the number of the song on the album
  type: string; // the type of object - always "track"
  uri: string; // the Spotify URI of the song
  is_local: boolean; // whether the song is from local files
}

export interface SearchSong {
  name: string;
  artist: string;
}

export interface SavedSong {
  added_at: string; // {date-time} representation of when the song was added to saved
  track: Song; // the Song object of the saved song
}
