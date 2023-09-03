## Use it yourself

1. Clone this repository to your device
1. Create a `.env` file in the `client` directory
1. Log in to your OpenAI account and [create an API key](https://platform.openai.com/account/api-keys) for the program
1. Store this API key in the `.env` file as `REACT_APP_OPENAI_API_KEY` as seen in [`.env.example`](https://github.com/kegdotcom/aidj/blob/master/client/.env.example)
1. Go to [Spotify's Developer Getting Started Guide](https://developer.spotify.com/documentation/web-api/tutorials/getting-started) and follow the steps under `Set Up Your Account` and `Create an App` on this page
1. In your Spotify Dashboard, go to the app you just created, click settings and copy the Client ID and Client Secret into your `.env` file as `REACT_APP_SPOTIFY_CLIENT_ID` and `REACT_APP_SPOTIFY_CLIENT_SECRET`, respectively, as seen in [`.env.example`](https://github.com/kegdotcom/aidj/blob/master/client/.env.example)
1. Still in the Spotify app settings, click the `Edit` button on the bottom of the page and add `http://localhost:3000/connect` under the `Redirect URIs` section of the app's settings

## Running the program

In the client directory, you can run:

### `npm start`

This will start the program at [`http://localhost:3000`](http://localhost:3000) where you can use the program for yourself!

## Notes

Make sure you visit the [login](http://localhost:3000/login) page first to connect your Spotify account, otherwise the program will not work properly
