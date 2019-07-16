# AlertmanagerRocketChat

## Overview
AlertmanagerIntegration is script that will parse webhook notifications coming to Rocket.Chat.

## Installation

### Rocket.Chat

1) Login as admin user and go to: Administration => Integrations => New Integration => Incoming WebHook

2) Set "Enabled" and "Script Enabled" to "True"

3) Set all channel, icons, etc. as you need

3) Paste contents of [AlertmanagerIntegrations.js](https://github.com/kiwigrid/AlertmanagerRocketChat/blob/master/AlertmanagerIntegration.js) into Script field.

4) Adjust script to fit your needs better, consider first 3 constants:
* `INPUT_URL_PATTERN` - Regular expression or string search within `generatorURL`
* `INPUT_URL_REPLACEMENT` - String replacement for the found INPUT_URL_PATTERN
* `EXCLUDE_LABELS` - Labels in `alert.labels` excluded from the display in the alert message

5) Create Integration. You'll see some values appear. Copy WebHook URL and proceed to Alertmanager.

### Alertmanager

1) Create new receiver or modify config of existing one. You'll need to add `webhooks_config` to it. Small example:

```yaml
route:
    repeat_interval: 30m
    group_interval: 30m
    receiver: 'rocketchat'

receivers:
    - name: 'rocketchat'
      webhook_configs:
          - send_resolved: false
            url: '${WEBHOOK_URL}'
```

2) Reload/restart alertmanager.

If everything is OK you should see alerts like this:

![alert example](https://i.imgur.com/tSbnoas.png)

## Testing

In order to test the webhook you can use the following curl (replace <webhook-url>):

```yaml
curl -X POST -H 'Content-Type: application/json' --data '
{
  "receiver": "rocketchat-scrum",
  "status": "firing",
  "alerts": [
    {
      "status": "firing",
      "labels": {
        "alertname": "HighLoadAlert",
        "cluster": "production",
        "owner": "Scrum Team One",
        "replica": "prometheus-server",
        "datawarehouse": "europe-west-3a",
        "job": "kubernetes-pods",
        "kubernetes_namespace": "test-namespace",
        "kubernetes_pod_name": "test-pod-1",
        "statefulset_kubernetes_io_pod_name": "test-pod-1",
        "severity": "P3"
      },
      "annotations": {
        "description": "Test Service is experiencing high load for last 10 minutes - CPU load avg. 98%. Memory load avg. 73%. Network load avg. 38%",
        "summary": "Test Service experiencing high load"
      },
      "startsAt": "2019-07-15T11:24:55.5121419Z",
      "generatorURL": "http://prometheus-server:80/graph?g0.expr=dummyQuery&g0.tab=1'"
    },{
      "status": "resolved",
      "labels": {
        "alertname": "DataNodeOutage",
        "cluster": "production",
        "owner": "Scrum Team Two",
        "replica": "prometheus-server",
        "datawarehouse": "europe-west-2",
        "severity": "P1"
      },
      "annotations": {
        "description": "There has been a network connections issues to Data Node DateWarehouse_3. It has been unreachable for last 3 minutes.",
        "summary": "Data Node DateWarehouse_3 offline"
      },
      "startsAt": "2019-07-15T11:24:55.5121419Z",
      "endsAt": "2019-07-15T11:40:55.5121419Z",
      "generatorURL": "http://prometheus-server:80/graph?g0.expr=dummyQuery&g0.tab=1'"
    },{
      "status": "resolved",
      "labels": {
        "alertname": "LocationHighTemp",
        "cluster": "none",
        "owner": "Lab Team",
        "replica": "prometheus-server",
        "datawarehouse": "company-location-2",
        "severity": "P5"
      },
      "annotations": {
        "description": "High Temperature (exceeding 40°C over 45 minutes) reported in location Lab Room",
        "summary": "High Temperature in Lab Room"
      },
      "startsAt": "2019-07-15T11:34:55.5121419Z",
      "endsAt": "2019-07-15T11:40:55.5121419Z",
      "generatorURL": "http://prometheus-server:80/graph?g0.expr=dummyQuery&g0.tab=1'"
    }
  ],
  "groupLabels": {},
  "commonLabels": {},
  "commonAnnotations": {
    },
  "externalURL": "",
  "version": "4",
  "groupKey": "{}/{owner=\"scrum\"}:{}"
}
' <webhook-url>
```

Or you can use test.sh script in the test folder.
To use it expoert environment variable 'WEBHOOK' or adjust script accordingly.

## Available Icons:

Several icons have been embedded in the script, and can be used to modify images attached to the alert:

ICON_CHECKMARK:
![ICON_CHECKMARK](http://files.softicons.com/download/application-icons/free-developer-icons-by-designkode/png/32/checkmark.png)

ICON_WARNING:
![ICON_WARNING](http://files.softicons.com/download/application-icons/free-developer-icons-by-designkode/png/32/warning.png)

ICON_ERROR:
![ICON_ERROR](http://files.softicons.com/download/application-icons/free-developer-icons-by-designkode/png/32/error.png)

ICON_STOP:
![ICON_STOP](http://files.softicons.com/download/application-icons/free-developer-icons-by-designkode/png/32/stop.png)

ICON_DELETE:
![ICON_DELETE](http://files.softicons.com/download/application-icons/free-developer-icons-by-designkode/png/32/delete.png)

Icons by DesignKode (http://www.softicons.com/designers/designkode)

## NOTES

Alertmanager doesn't actually sends singular alerts - it sends array of current alerts, so it doesn't seem possible for now to split then in separate messages, but if you want, you can configure separate alerts/receivers/webhooks.

[Alertmanager Docs](https://prometheus.io/docs/alerting/overview/)

[Rocket.Chat Docs](https://rocket.chat/docs/administrator-guides/integrations/)
