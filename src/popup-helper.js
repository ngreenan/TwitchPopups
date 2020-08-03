const popup = {
    /**
     * Displays the predictions bar with the relevant information
     */
    showPredictions: (session) => {

        $("#predictionsbox").empty();

        $("#predictionmessage").css({ "opacity": 0 });
        $("#predictionsbox").css({ "opacity": 0 });

        if (session === "quali") {
            $("#predictionmessage").text("Where will I qualify? Type !predict followed by your prediction");
        } else {
            $("#predictionmessage").text("Where will I finish? Type !predict followed by your prediction");
        }

        var predictionoptions = predictionresults.length;
        var width = ((predictionWidth - 4) / predictionoptions).toString() + 'px';

        predictionresults.forEach((item, i) => {

            var backcolorclass = '';

            if (item[0] <= 3) {
              backcolorclass = 'predictionoption-' + item[0];
            } else if (item[0] <= 10) {
              backcolorclass = 'predictionoption-topten';
            } else if (item[0] === 'DNF') {
              backcolorclass = 'predictionoption-DNF';
            } else {
              backcolorclass = 'predictionoption-other';
            }

            $("#predictionsbox").append("<div id='prediction-" + item[0]
              + "' class='predictionoption " + backcolorclass
              + "' style='width: " + width + "'>"
              + item[0]
              + "</div>");
        });

        predictionresults.forEach((item, i) => {

            $("#predictionsbox").append("<div id='predictionpercent-" + item[0]
              + "' class='predictionpercent"
              + "' style='width: " + width + "'>"
              + "0%"
              + "</div>");
        });

        predictionresults.forEach((item, i) => {

            $("#predictionsbox").append("<div id='predictionbar-" + item[0]
              + "' class='predictionbar"
              + "' style='width: " + width + "; max-height: " + barHeight + "px'>"
              + "</div>");
        });

        $("#predictionsbox").show();
        $("#predictionsbox").animate({ "opacity": 1 }, 500);
        $("#predictionmessage").show();
        $("#predictionmessage").animate({ "opacity": 1 }, 500);
    },
    /**
     * Updates the prediction bar to show the latest results
     */
    addPrediction: (prediction, predictor) => {

        predictionresults.forEach((item, i) => {
            if (item[1] !== 0) {

              var percentage = item[2] * 100;
              $("#predictionpercent-" + item[0]).text(Math.round(percentage).toString() + "%");

              $("#predictionbar-" + item[0]).animate({ "height": barHeight * item[2] }, 250);
            }
        });
    },
    /**
     * Closes the prediction bar with a closing message
     */
    closePredictions: () => {

        $("#predictionsbox").animate({ "opacity": 0 }, 500);
        $("#predictionmessage").text("Predictions are closed! Stay tuned to see who was correct...");
        $("#predictionmessage").delay(10000).animate({ "opacity": 0 }, 500);
    },
    /**
     * Shows the final result and if anyone predicted correctly
     */
    showResult: (result) => {

        var resultText = "";

        if (result === "DNF") {
          resultText = "DNF";
        } else {
          resultText = addOrdinal(parseInt(result));
        }

        var winners = [];
        var winnerText = ""

        predictions.forEach((item, i) => {

            if (item[1] === result
              || item[1] === parseInt(result)) {
                winners.push(item);
            }
        });

        if (winners.length > 0) {
            // we have at least one winner :)

            for (var j = 0; j < winners.length; j++) {
              console.log(j);

              winnerText += "<span style='color: " + winners[j][2] + "'>" + winners[j][0] + "</span>";

              if (j == winners.length - 2) {
                winnerText += " & ";
              } else if (j < winners.length - 2) {
                winnerText += ", ";
              }
            }

            winnerText += "! Congrats!";
        } else {
            // we have no winners :(
            winnerText += "No-one ☹️ Better luck next time!";
        }

        var colorclass = '';
        var resultNumber = result;
        // ordinals.forEach((item, i) => {
        //     resultNumber.replace(item,'');
        // });
        resultNumber = removeOrdinal(resultNumber);
        resultNumber = parseInt(resultNumber);

        if (resultNumber <= 3) {
          colorclass = 'winnertext-' + resultNumber;
        } else if (resultNumber <= 10) {
          colorclass = 'winnertext-topten';
        } else if (resultNumber === 'DNF') {
          colorclass = 'winnertext-DNF';
        } else {
          colorclass = 'winnertext-other';
        }

        $("#predictionmessage").animate({ "opacity": 1 }, 500);
        $("#predictionmessage").html("Result was <span class='" + colorclass + "'>" + resultText + "</span>. And the winner is...");
        // $("#predictionmessage").delay(5000).animate({ "opacity": 0 }, 500);
        // $("#predictionmessage").html(winnerText);
        // $("#predictionmessage").animate({ "opacity": 1 }, 500);

        $("#predictionmessage").delay(5000)
            .fadeOut(500)
            .delay(500)
            .queue(function(n) {
                $(this).html(winnerText);
                n();
            }).fadeIn(500);
    },
    /**
     * Ends the event and sets everything back to how it was at the start
     */
    endPredictions: () => {

        $("#predictionsbox").empty();
        $("#predictionmessage").animate({ "opacity": 0 }, 500);
        $("#predictionsbox").animate({ "opacity": 0 }, 500);
    }
}
