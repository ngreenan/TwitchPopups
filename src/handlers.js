var mode = "";
var predictions = []; //[name, prediction]
var predictionresults = []; //[position, count, fraction]
var average = 0;
var ordinals = [ 'st', 'nd', 'rd', 'th'];

// =======================================
// Command: !predictquali <positions>
// Description: will start a quali position prediction event, with valid responses being between 1st and the value of positions
// =======================================
actionHandlers['!predictquali'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {

        // Initialise the arrays
        predictions = [];
        predictionresults = [];

        for (var i = 1; i <= textContent.substr(14); i++) {
            predictionresults.push([i, 0, 0]);
        }

        popup.showPredictions("quali");
        //popup.showText(predictionresults, alertBg);
    }
};

// =======================================
// Command: !predictrace <positions>
// Description: will start a race position prediction event, with valid responses being between 1st and the value of positions, as well as a special case of DNF
// =======================================
actionHandlers['!predictrace'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {

      // Initialise the arrays
      predictions = [];
      predictionresults = [];

      for (var i = 1; i <= textContent.substr(13); i++) {
          predictionresults.push([i, 0, 0]);
      }

      // Special case for race: DNF
      predictionresults.push(['DNF',0, 0]);

      popup.showPredictions("race");
    }
};

// =======================================
// Command: !predictclose
// Description: will close the prediction event, e.g. when the race is actually happening
// =======================================
actionHandlers['!predictclose'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {
        popup.closePredictions();
    }
};

// =======================================
// Command: !predictresult <result>
// Description: will show the result and who predicted correctly/got closest to the actual result
// =======================================
actionHandlers['!predictresult'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {

        var result = textContent.substr(15);
        // Strip off the ordinal indicators, if they're there
        // ordinals.forEach((item, i) => {
        //     result.replace(item,'');
        // });
        result = removeOrdinal(result);
        popup.showResult(result);
    }
};

// =======================================
// Command: !predictend
// Description: will end the current prediction event
// =======================================
actionHandlers['!predictend'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {

        popup.endPredictions();
    }
};

// =======================================
// Command: !predict <prediction>
// Description: will add a prediction for the current prediction event
// =======================================
actionHandlers['!predict'] = {
    security: (context, textContent) => {
        return true; // anyone can predict!
    },
    handle: (context, textContent) => {

        if (allowDuplicates || !itemInArray(predictions, context['display-name'], 0)) {

            var prediction = textContent.substr(9);

            // Strip off the ordinal indicators, if they're there
            // ordinals.forEach((item, i) => {
            //     prediction.replace(item,'');
            // });
            prediction = removeOrdinal(prediction);

            // Add to predictions array
            predictions.push([context['display-name'], prediction, context.color]);

            // Update predictionresults
            updatePredictionResults(prediction);

            //const formattedText = popup.formatEmotes(textContent, context.emotes, true).substr(9);
            console.log("prediction is: " + prediction);

            popup.addPrediction(prediction, context['display-name']);
        }
    }
};

function itemInArray(array, item, index) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][index] === item) {
            return true;
        }
    }

    return false;
}

function updatePredictionResults(prediction) {

    var predictioncount = predictions.length;

    predictionresults.forEach((item, i) => {
        if (item[0] === "DNF" && prediction.toUpperCase() === "DNF") {
            item[1] += 1;
        } else if (item[0] === parseInt(prediction)) {
            item[1] += 1;
        }

        item[2] = item[1] / predictioncount;
    });
}

function addOrdinal(i) {
  //https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
  var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function removeOrdinal(number) {

    ordinals.forEach((item, i) => {
        number = number.replace(item,"");
    });

    return number;
}
