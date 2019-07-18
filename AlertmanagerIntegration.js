const INPUT_URL_PATTERN = /http.*\:\/\/.*\:.*\//i; // eg http://prometheus-internal-address:9090/ or regexp  like /http.*\:\/\/.*\:.*\//i
const INPUT_URL_REPLACEMENT = "https://prometheus-server/"; // eg https://external-prometheus:8080/
const EXCLUDE_LABELS = ['owner', 'replica', 'alertname', 'cluster']; // labels to ignore from the print to channel

const ICON_CHECKMARK = "data:image/png;base64,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";

const ICON_WARNING = "data:image/png;base64,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";

const ICON_ERROR = "data:image/png;base64,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";

const ICON_STOP = "data:image/png;base64,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";

const ICON_DELETE = "data:image/png;base64,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";

class Script {
    process_incoming_request({
        request
    }) {
      function translateUri(uriToParse) {
        return uriToParse.replace(INPUT_URL_PATTERN, INPUT_URL_REPLACEMENT);
      }

      function secondsToHumanReadableDuration(secondsTotal) {
        secondsTotal = Number(secondsTotal);
        let days = Math.floor(secondsTotal / (3600*24));
        let hours = Math.floor(secondsTotal % (3600*24) / 3600);
        let minutes = Math.floor(secondsTotal % 3600 / 60);
        let seconds = Math.floor(secondsTotal % 60);

        let daysDisplay = days > 0 ? days + (days == 1 ? " day, " : " days, ") : "";
        let hoursDisplay = hours > 0 ? hours + (hours == 1 ? " hour, " : " hours, ") : "";
        let minutesDisplay = minutes > 0 ? minutes + (minutes == 1 ? " minute, " : " minutes, ") : "";
        let secondsDisplay = seconds > 0 ? seconds + (seconds == 1 ? " second" : " seconds") : "";
        return daysDisplay + hoursDisplay + minutesDisplay + secondsDisplay;
      }

      if (!request.content.alerts || !request.content.alerts[0]) {
        return {
          error: {
            success: false,
            message: 'Empty or missing alerts in request.'
          }
        };
      }

      var alertUsername = "Prometheus Alert";
      if (!!request.content.alerts[0].labels.cluster) {
        alertUsername= request.content.alerts[0].labels.cluster;
      }

      let attachments = [];
      for (i=0; i< request.content.alerts.length; i++) {
        let attachmentElement = {};
        attachments.push(attachmentElement);
        let attachmentFields = [];
        attachmentElement.fields = attachmentFields;

        var alertValue = request.content.alerts[i];
        attachmentElement.color = "warning";
        attachmentElement.collapsed = false;

        if (alertValue.status == "resolved") {
          attachmentElement.color = "good";
          attachmentElement.collapsed = true;
          attachmentElement.author_icon = ICON_CHECKMARK;

          if(!!alertValue.endsAt){
           let dateDiff = Math.abs(Date.parse(alertValue.endsAt)-Date.parse(alertValue.startsAt))/1000;
           attachmentElement.author_name = "Alert lasted for: "+secondsToHumanReadableDuration(dateDiff);
          }
        } else if (alertValue.status == "firing") {
          attachmentElement.color = "danger";
          attachmentElement.thumb_url = ICON_WARNING;
        }

        attachmentElement.title = alertValue.labels.alertname;

        if (!!alertValue.annotations.summary) {
          attachmentElement.title = attachmentElement.title + + ": " + alertValue.annotations.summary;
        } else if (!!alertValue.labels.container) {
          attachmentElement.title = attachmentElement.title + + " at " + alertValue.labels.container;
        }

        attachmentElement.title_link = translateUri(alertValue.generatorURL);

        attachmentElement.text = alertValue.annotations.description;

        Object.keys(alertValue.labels).forEach(function(extract) {
          if (!EXCLUDE_LABELS.includes(extract)){
            var elem = {
              title: extract,
              value: alertValue.labels[extract],
              short: true
            };

            attachmentFields.push(elem);
          }
        });

       }

      return {
        content: {
          alias: alertUsername,
          attachments: attachments
        }
      };
    }
}
