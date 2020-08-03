# TwitchRacePredictions (WIP)

Allows chatters to predict quali/finishing positions in a race, and display it on screen, based on Twitch chat

Based on [DaftLimmy's TwitchPopups](https://github.com/DaftLimmy/TwitchPopups)

## COMMAND LIST

- !predictquali [positions]: will start a quali position prediction event, with valid responses being between 1st and the value of positions
- !predictrace [positions]: will start a race position prediction event, with valid responses being between 1st and the value of positions, as well as a special case of DNF
- !predictclose: will close the prediction event, e.g. when the race is actually happening
- !predictresult [result]: will show the result and who predicted correctly/got closest to the actual result
- !predict [prediction]: will add a prediction for the current prediction event
- !predictend: will end the current prediction event

## DOWNLOAD

The latest version of TwitchRacePredictions can be found [as a zip archive here](https://github.com/alfredbulbasaur/TwitchRacePredictions/archive/master.zip)

## INSTRUCTIONS

1. Extract the zip archive
2. Edit settings.js and change "alfredbulbasaur" to your Twitch channel name
3. Use OBS/Streamlabs OBS to add twitchracepredictions.htm as a browser source (Fit to Screen, 1920x1080)
4. Tick "Shutdown source when not visible" in browser source properties. That way, any tweaks you make are reloaded when you toggle the visibility button

## UPGRADE
1. Open your existing twitchracepredictions.htm and copy your configuration settings
2. Download the latest version
3. Open the zip archive and open the TwitchRacePredictions-master directory
4. Select all of the files and drag them into your existing TwitchRacePredictions directory. Say yes to any prompts to overwrite files but be careful not to overwrite your custom animations!
5. Edit the configuration section at the top of twitchracepredictions.htm, pasting in your settings from step 1.
6. If OBS hasn't recognized the update press the "refresh cache of current page" button in browser source properties.

## STILL TO BE UPDATED

## ADVANCED: ADD CUSTOM HANDLERS
If you want to add your own handlers, you will need to understand JavaScript and the tmi.js library.
There are a few extra things to consider.
1. Do you want it to fire based on a !command?
2. Do you want it to fire on every chat?
3. What security should prevent the handler being fired? e.g mod only, spotlight only etc.
4. What should the handler do?

Once you have answered those questions you are ready to add the handler.

1. Navigate to the handlers.js
2. If you want a command copy the following code into the file:
``` javascript
actionHandlers['!command'] = {
    security: (context, textContent) => {
        return true; // This should return a boolean, true will fire the handler
    },
    handle: (context, textContent) => {
        // Place handle script here
    }
};
```
3. If you want a general command copy the following code into the file:
``` javascript
allHandlers.push({
    security: (context, textContent) => {
        return true; // This should return a boolean, true will fire the handler
    },
    handle: (context, textContent) => {
        // Place handle script here
    }
});
```
4. Complete your handler and don't forget to add a description to the readme.md

## ADVANCED: POPUP HELPER
The popup helper contains a few functions so you don't need to worry about the animations for the popup box! it can be accessed anywhere by typing `popup` followed by a function.

Methods:

`popup.showText(text, bgColour)`: Displays popup on screen with the given text and colour.

`popup.delete()`: Removes popup from screen and resets state of all commands.

`popup.formatEmotes(message, emotes, upperCase)`: Formats text with emotes, This must be past only and all message un-formatted or emotes wont be replaced properly. e.g `popup.formatEmotes('Hello Twitch', context.emotes, true).substr(7)` The substr function removes the !command, just change the number to the length of the command.
